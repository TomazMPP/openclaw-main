"use client";

import { useTranslation } from "@workspace/i18n";
import { Icons } from "@workspace/ui-web/icons";

export const DeployTips = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-warning/10 border-warning/30 flex items-start gap-3 rounded-xl border p-4">
        <Icons.TriangleAlert className="text-warning mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {t("instance.deploy.tips.languageTitle")}
          </span>
          <span className="text-muted-foreground text-sm">
            {t("instance.deploy.tips.languageDescription")}
          </span>
        </div>
      </div>

      <div className="bg-muted/50 flex items-start gap-3 rounded-xl border p-4">
        <Icons.ClockFading className="text-muted-foreground mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {t("instance.deploy.tips.timeTitle")}
          </span>
          <span className="text-muted-foreground text-sm">
            {t("instance.deploy.tips.timeDescription")}
          </span>
        </div>
      </div>

      <div className="bg-muted/50 flex items-start gap-3 rounded-xl border p-4">
        <Icons.MessageCircle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {t("instance.deploy.tips.telegramTitle")}
          </span>
          <span className="text-muted-foreground text-sm">
            {t("instance.deploy.tips.telegramDescription")}
          </span>
        </div>
      </div>
    </div>
  );
};
