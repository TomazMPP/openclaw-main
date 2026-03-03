"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { cn } from "@workspace/ui";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";
import { Spinner } from "@workspace/ui-web/spinner";
import { Textarea } from "@workspace/ui-web/textarea";
import { toast } from "sonner";

import { handle } from "@workspace/api/utils";

import { api } from "~/lib/api/client";
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

interface FeedbackItem {
  id: string;
  message: string;
  rating: number | null;
  createdAt: string;
}

export const FeedbackForm = () => {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);

  const feedbacks = useQuery({
    queryKey: ["feedback", "list"],
    queryFn: () => handle(api.support.feedback.$get)(),
  });
  const feedbackList = (feedbacks.data ?? []) as unknown as FeedbackItem[];

  const submit = useMutation({
    mutationKey: ["feedback", "create"],
    mutationFn: () =>
      handle(api.support.feedback.$post)({
        json: { message, rating: rating > 0 ? rating : undefined },
      }),
    onSuccess: () => {
      toast.success(t("feedback.submitSuccess"));
      setMessage("");
      setRating(0);
      void queryClient.invalidateQueries({ queryKey: ["feedback", "list"] });
    },
    onError: () => {
      toast.error(t("feedback.submitError"));
    },
  });

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>{t("feedback.title")}</DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("feedback.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <SettingsCard>
          <SettingsCardHeader>
            <SettingsCardTitle>{t("feedback.newFeedback")}</SettingsCardTitle>
            <SettingsCardDescription>
              {t("feedback.newFeedbackDescription")}
            </SettingsCardDescription>
          </SettingsCardHeader>
          <SettingsCardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("feedback.ratingLabel")}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? 0 : star)}
                      className="rounded p-1 transition-colors hover:bg-accent"
                    >
                      <Icons.Star
                        className={cn(
                          "size-6",
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("feedback.messageLabel")}
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("feedback.messagePlaceholder")}
                  rows={5}
                />
              </div>
            </div>
          </SettingsCardContent>
          <SettingsCardFooter>
            <p className="text-muted-foreground text-sm">
              {t("feedback.footer")}
            </p>
            <Button
              size="sm"
              onClick={() => submit.mutate()}
              disabled={submit.isPending || !message}
            >
              {submit.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <Icons.MessageCircle className="size-4" />
              )}
              {t("feedback.submit")}
            </Button>
          </SettingsCardFooter>
        </SettingsCard>

        {feedbackList.length > 0 && (
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>
                {t("feedback.previousFeedback")}
              </SettingsCardTitle>
            </SettingsCardHeader>
            <SettingsCardContent>
              <div className="flex flex-col divide-y">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="flex flex-col gap-1 py-3">
                    {fb.rating && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icons.Star
                            key={star}
                            className={cn(
                              "size-4",
                              star <= fb.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-sm">{fb.message}</p>
                    <span className="text-muted-foreground text-xs">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </SettingsCardContent>
          </SettingsCard>
        )}
      </div>
    </>
  );
};
