"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useTranslation } from "@workspace/i18n";
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

export const SubscriptionView = () => {
  const { t } = useTranslation("dashboard");

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
                  {t(`settings.subscription.statusLabel.${statusKey}`)}
                </Badge>
              </div>

              {isActive && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {t("settings.subscription.price")}:
                    </span>
                    <span className="text-2xl font-bold">R$49</span>
                    <span className="text-muted-foreground text-sm">
                      /{t("settings.subscription.month")}
                    </span>
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
                </>
              )}

              {!isActive && (
                <div className="flex flex-col gap-3 rounded-xl border p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">R$49</span>
                    <span className="text-muted-foreground">
                      /{t("settings.subscription.month")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {t("settings.subscription.includes")}
                  </p>
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
              )}
            </div>
          </SettingsCardContent>
          <SettingsCardFooter>
            <p className="text-muted-foreground text-sm">
              {isActive
                ? t("settings.subscription.manageFooter")
                : t("settings.subscription.subscribeFooter")}
            </p>
            {isActive ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => portal.mutate(undefined)}
                disabled={portal.isPending}
              >
                {portal.isPending ? <Spinner className="size-4" /> : null}
                {t("settings.subscription.manage")}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => checkout.mutate(undefined)}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <Icons.CreditCard className="size-4" />
                )}
                {t("settings.subscription.subscribe")}
              </Button>
            )}
          </SettingsCardFooter>
        </SettingsCard>
      </div>
    </>
  );
};
