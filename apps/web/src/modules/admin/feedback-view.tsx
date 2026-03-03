"use client";

import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@workspace/i18n";
import { cn } from "@workspace/ui";
import { Icons } from "@workspace/ui-web/icons";

import { handle } from "@workspace/api/utils";

import { api } from "~/lib/api/client";
import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
} from "~/modules/common/layout/dashboard/header";

interface FeedbackItem {
  id: string;
  userId: string;
  message: string;
  rating: number | null;
  createdAt: string;
}

export const AdminFeedbackView = () => {
  const { t } = useTranslation("dashboard");

  const feedbacks = useQuery({
    queryKey: ["admin", "feedback"],
    queryFn: () => handle(api.support.feedback.all.$get)(),
  });
  const feedbackList = (feedbacks.data ?? []) as unknown as FeedbackItem[];

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>
            {t("admin.feedbackTitle")}
          </DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("admin.feedbackDescription")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="text-muted-foreground mb-4 text-sm">
        {t("admin.totalFeedback", { count: feedbackList.length })}
      </div>

      {feedbackList.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("admin.noFeedback")}
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    {t("admin.rating")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("admin.message")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("admin.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb) => (
                  <tr key={fb.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {fb.rating ? (
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
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[400px]">
                      <p className="line-clamp-2">{fb.message}</p>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
