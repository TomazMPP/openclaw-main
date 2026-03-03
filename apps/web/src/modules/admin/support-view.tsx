"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "@workspace/i18n";
import { cn } from "@workspace/ui";
import { Badge } from "@workspace/ui-web/badge";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";

import { handle } from "@workspace/api/utils";

import { api } from "~/lib/api/client";
import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
} from "~/modules/common/layout/dashboard/header";

interface SupportTicketItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_VARIANT = {
  open: "secondary",
  in_progress: "warning",
  closed: "success",
} as const;

export const AdminSupportView = () => {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");
  const queryClient = useQueryClient();

  const tickets = useQuery({
    queryKey: ["admin", "support"],
    queryFn: () => handle(api.support.support.all.$get)(),
  });
  const ticketsList = (tickets.data ?? []) as unknown as SupportTicketItem[];

  const updateStatus = useMutation({
    mutationKey: ["admin", "support", "status"],
    mutationFn: (data: { id: string; status: string }) =>
      handle(api.support.support.status.$post)({
        json: data as { id: string; status: "open" | "in_progress" | "closed" },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "support"] });
    },
  });

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>
            {t("admin.supportTitle")}
          </DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("admin.supportDescription")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="text-muted-foreground mb-4 text-sm">
        {t("admin.totalTickets", { count: ticketsList.length })}
      </div>

      {ticketsList.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("admin.noTickets")}
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">{tc("name")}</th>
                  <th className="px-4 py-3 text-left font-medium">{tc("email")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("admin.subject")}</th>
                  <th className="px-4 py-3 text-left font-medium">{tc("status")}</th>
                  <th className="px-4 py-3 text-left font-medium">{tc("createdAt")}</th>
                  <th className="px-4 py-3 text-right font-medium">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {ticketsList.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{ticket.name}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {ticket.email}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          STATUS_VARIANT[ticket.status as keyof typeof STATUS_VARIANT] ?? "secondary"
                        }
                      >
                        {t(`support.status.${ticket.status}` as "support.status.open")}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {ticket.status !== "in_progress" && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title={t("admin.markInProgress")}
                            onClick={() =>
                              updateStatus.mutate({
                                id: ticket.id,
                                status: "in_progress",
                              })
                            }
                          >
                            <Icons.ClockFading className="size-4" />
                          </Button>
                        )}
                        {ticket.status !== "closed" && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title={t("admin.markClosed")}
                            onClick={() =>
                              updateStatus.mutate({
                                id: ticket.id,
                                status: "closed",
                              })
                            }
                          >
                            <Icons.CheckCircle2 className="size-4" />
                          </Button>
                        )}
                        {ticket.status === "closed" && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title={t("admin.reopen")}
                            onClick={() =>
                              updateStatus.mutate({
                                id: ticket.id,
                                status: "open",
                              })
                            }
                          >
                            <Icons.Undo2 className="size-4" />
                          </Button>
                        )}
                      </div>
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
