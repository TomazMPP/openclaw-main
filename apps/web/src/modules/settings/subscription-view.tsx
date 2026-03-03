"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { cn } from "@workspace/ui";
import { Badge } from "@workspace/ui-web/badge";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";
import { Spinner } from "@workspace/ui-web/spinner";

import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
} from "~/modules/common/layout/dashboard/header";
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from "~/modules/common/layout/dashboard/settings-card";
import { billing } from "~/modules/settings/lib/billing-api";

const STATUS_VARIANT = {
  active: "success",
  canceled: "destructive",
  past_due: "warning",
  incomplete: "secondary",
  trialing: "secondary",
} as const;

type PlanKey = "monthly" | "quarterly" | "semiannual";

const PLANS: {
  key: PlanKey;
  price: string;
  period: string;
  perMonth: string;
  badge: string | null;
}[] = [
  { key: "monthly", price: "R$49", period: "/mês", perMonth: "R$49/mês", badge: null },
  { key: "quarterly", price: "R$139", period: "/3 meses", perMonth: "~R$46,33/mês", badge: "5% OFF" },
  { key: "semiannual", price: "R$249,90", period: "/6 meses", perMonth: "~R$41,65/mês", badge: "15% OFF" },
];

export const SubscriptionView = () => {
  const { t } = useTranslation("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("monthly");

  const sub = useQuery(billing.queries.subscription);

  const checkout = useMutation({
    ...billing.mutations.checkout,
    onSuccess: (data) => {
      const result = data as { url?: string | null };
      if (result.url) {
        window.location.href = result.url;
      }
    },
  });

  const portal = useMutation({
    ...billing.mutations.portal,
    onSuccess: (data) => {
      const result = data as { url?: string | null };
      if (result.url) {
        window.location.href = result.url;
      }
    },
  });

  const subscription = sub.data as {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;

  const isActive = subscription?.status === "active";
  const statusKey = (subscription?.status ?? "inactive") as keyof typeof STATUS_VARIANT;

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>
            {t("settings.subscription.title")}
          </DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("settings.subscription.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        {isActive && (
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>
                {t("settings.subscription.currentPlan")}
              </SettingsCardTitle>
              <SettingsCardDescription>
                {t("settings.subscription.planDescription")}
              </SettingsCardDescription>
            </SettingsCardHeader>
            <SettingsCardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{t("settings.subscription.status")}:</span>
                  <Badge variant={STATUS_VARIANT[statusKey] ?? "secondary"}>
                    {t(`settings.subscription.statusLabel.${statusKey}` as "settings.subscription.statusLabel.active")}
                  </Badge>
                </div>

                {subscription?.currentPeriodEnd && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {t("settings.subscription.nextBilling")}:
                    </span>
                    <span className="text-sm">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {subscription?.cancelAtPeriodEnd && (
                  <p className="text-destructive text-sm">
                    {t("settings.subscription.cancelingAtEnd")}
                  </p>
                )}
              </div>
            </SettingsCardContent>
            <SettingsCardFooter>
              <p className="text-muted-foreground text-sm">
                {t("settings.subscription.manageFooter")}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => portal.mutate(undefined)}
                disabled={portal.isPending}
              >
                {portal.isPending ? <Spinner className="size-4" /> : null}
                {t("settings.subscription.manage")}
              </Button>
            </SettingsCardFooter>
          </SettingsCard>
        )}

        {!isActive && (
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>
                {t("settings.subscription.choosePlan")}
              </SettingsCardTitle>
              <SettingsCardDescription>
                {t("settings.subscription.choosePlanDescription")}
              </SettingsCardDescription>
            </SettingsCardHeader>
            <SettingsCardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.key}
                      type="button"
                      onClick={() => setSelectedPlan(plan.key)}
                      className={cn(
                        "relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-colors",
                        selectedPlan === plan.key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      {plan.badge && (
                        <span className="bg-primary text-primary-foreground absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-xs font-medium">
                          {plan.badge}
                        </span>
                      )}
                      <span className="text-sm font-medium">
                        {t(`settings.subscription.plans.${plan.key}` as "settings.subscription.plans.monthly")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {plan.perMonth}
                      </span>
                    </button>
                  ))}
                </div>

                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Icons.Check className="text-primary size-4" />
                    {t("settings.subscription.feature1")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.Check className="text-primary size-4" />
                    {t("settings.subscription.feature2")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.Check className="text-primary size-4" />
                    {t("settings.subscription.feature3")}
                  </li>
                </ul>
              </div>
            </SettingsCardContent>
            <SettingsCardFooter>
              <p className="text-muted-foreground text-sm">
                {t("settings.subscription.subscribeFooter")}
              </p>
              <Button
                size="sm"
                onClick={() => checkout.mutate(selectedPlan)}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <Icons.CreditCard className="size-4" />
                )}
                {t("settings.subscription.subscribe")}
              </Button>
            </SettingsCardFooter>
          </SettingsCard>
        )}
      </div>
    </>
  );
};
