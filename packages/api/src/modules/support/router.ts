import { Hono } from "hono";
import * as z from "zod";

import { eq, desc } from "@workspace/db";
import { supportTicket, feedback } from "@workspace/db/schema";
import { db } from "@workspace/db/server";
import { generateId } from "@workspace/shared/utils";

import { enforceAuth, enforceAdmin, validate } from "../../middleware";

const createSupportTicketSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

const updateTicketStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["open", "in_progress", "closed"]),
});

const createFeedbackSchema = z.object({
  message: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).optional(),
});

export const supportRouter = new Hono()
  .use(enforceAuth)
  .post(
    "/support",
    validate("json", createSupportTicketSchema),
    async (c) => {
      const userId = c.var.user.id;
      const data = c.req.valid("json");

      const ticket = await db
        .insert(supportTicket)
        .values({
          id: generateId(),
          userId,
          ...data,
        })
        .returning();

      return c.json(ticket[0], 201);
    },
  )
  .get("/support", async (c) => {
    const userId = c.var.user.id;

    const tickets = await db.query.supportTicket.findMany({
      where: eq(supportTicket.userId, userId),
      orderBy: [desc(supportTicket.createdAt)],
    });

    return c.json(tickets);
  })
  .get("/support/all", enforceAdmin, async (c) => {
    const tickets = await db.query.supportTicket.findMany({
      orderBy: [desc(supportTicket.createdAt)],
    });

    return c.json(tickets);
  })
  .post(
    "/support/status",
    enforceAdmin,
    validate("json", updateTicketStatusSchema),
    async (c) => {
      const { id, status } = c.req.valid("json");

      await db
        .update(supportTicket)
        .set({ status })
        .where(eq(supportTicket.id, id));

      return c.json({ success: true });
    },
  )
  .post(
    "/feedback",
    validate("json", createFeedbackSchema),
    async (c) => {
      const userId = c.var.user.id;
      const data = c.req.valid("json");

      const fb = await db
        .insert(feedback)
        .values({
          id: generateId(),
          userId,
          ...data,
        })
        .returning();

      return c.json(fb[0], 201);
    },
  )
  .get("/feedback", async (c) => {
    const userId = c.var.user.id;

    const fbs = await db.query.feedback.findMany({
      where: eq(feedback.userId, userId),
      orderBy: [desc(feedback.createdAt)],
    });

    return c.json(fbs);
  })
  .get("/feedback/all", enforceAdmin, async (c) => {
    const fbs = await db.query.feedback.findMany({
      orderBy: [desc(feedback.createdAt)],
    });

    return c.json(fbs);
  });
