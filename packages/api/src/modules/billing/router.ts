import { Hono } from "hono";

import { eq } from "@workspace/db";
import { subscription } from "@workspace/db/schema";
import { db } from "@workspace/db/server";
import { generateId } from "@workspace/shared/utils";

import { env } from "../../env";
import { enforceAuth } from "../../middleware";

import { getStripe } from "./stripe";

import type Stripe from "stripe";

const getOrigin = (c: {
  req: { header: (name: string) => string | undefined };
}) => {
  const origin = c.req.header("origin") ?? c.req.header("referer") ?? "";
  try {
    return new URL(origin).origin;
  } catch {
    return "";
  }
};

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (customerId && subscriptionId) {
        await db
          .update(subscription)
          .set({
            stripeSubscriptionId: subscriptionId,
            status: "active",
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeCustomerId, customerId));
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      if (customerId) {
        const periodEnd = sub.items.data[0]?.current_period_end;
        await db
          .update(subscription)
          .set({
            status: sub.status,
            ...(periodEnd
              ? { currentPeriodEnd: new Date(periodEnd * 1000) }
              : {}),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeCustomerId, customerId));
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      if (customerId) {
        await db
          .update(subscription)
          .set({
            status: "canceled",
            cancelAtPeriodEnd: false,
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeCustomerId, customerId));
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (customerId) {
        await db
          .update(subscription)
          .set({
            status: "past_due",
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeCustomerId, customerId));
      }
      break;
    }
  }
};

export const billingRouter = new Hono()
  .post("/webhook", async (c) => {
    const stripe = getStripe();
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");

    if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
      return c.json({ error: "Missing signature" }, 400);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch {
      return c.json({ error: "Invalid signature" }, 400);
    }

    await handleWebhookEvent(event);

    return c.json({ received: true });
  })
  .use(enforceAuth)
  .get("/subscription", async (c) => {
    const userId = c.var.user.id;

    const sub = await db.query.subscription.findFirst({
      where: eq(subscription.userId, userId),
    });

    return c.json(sub ?? null);
  })
  .post("/checkout", async (c) => {
    const userId = c.var.user.id;
    const userEmail = c.var.user.email;
    const stripe = getStripe();
    const origin = getOrigin(c);

    const existing = await db.query.subscription.findFirst({
      where: eq(subscription.userId, userId),
    });

    let customerId = existing?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;

      await db.insert(subscription).values({
        id: generateId(),
        userId,
        stripeCustomerId: customerId,
        status: "incomplete",
      });
    }

    if (existing?.status === "active") {
      return c.json({ error: "Already subscribed" }, 400);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancel`,
      metadata: { userId },
    });

    return c.json({ url: session.url });
  })
  .post("/portal", async (c) => {
    const userId = c.var.user.id;
    const stripe = getStripe();
    const origin = getOrigin(c);

    const sub = await db.query.subscription.findFirst({
      where: eq(subscription.userId, userId),
    });

    if (!sub?.stripeCustomerId) {
      return c.json({ error: "No subscription found" }, 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${origin}/dashboard/settings/subscription`,
    });

    return c.json({ url: session.url });
  });
