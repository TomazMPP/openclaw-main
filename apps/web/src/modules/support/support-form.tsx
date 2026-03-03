"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { Badge } from "@workspace/ui-web/badge";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";
import { Input } from "@workspace/ui-web/input";
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

import type { User } from "@workspace/auth";

interface SupportFormProps {
  readonly user: User;
}

interface SupportTicketItem {
  id: string;
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

export const SupportForm = ({ user }: SupportFormProps) => {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const tickets = useQuery({
    queryKey: ["support", "list"],
    queryFn: () => handle(api.support.support.$get)(),
  });
  const ticketsList = (tickets.data ?? []) as unknown as SupportTicketItem[];

  const submit = useMutation({
    mutationKey: ["support", "create"],
    mutationFn: () =>
      handle(api.support.support.$post)({
        json: { name, email, subject, message },
      }),
    onSuccess: () => {
      toast.success(t("support.submitSuccess"));
      setSubject("");
      setMessage("");
      void queryClient.invalidateQueries({ queryKey: ["support", "list"] });
    },
    onError: () => {
      toast.error(t("support.submitError"));
    },
  });

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>{t("support.title")}</DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("support.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <SettingsCard>
          <SettingsCardHeader>
            <SettingsCardTitle>{t("support.newTicket")}</SettingsCardTitle>
            <SettingsCardDescription>
              {t("support.newTicketDescription")}
            </SettingsCardDescription>
          </SettingsCardHeader>
          <SettingsCardContent>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    {t("support.nameLabel")}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    {t("support.emailLabel")}
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("support.subjectLabel")}
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t("support.subjectPlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("support.messageLabel")}
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("support.messagePlaceholder")}
                  rows={5}
                />
              </div>
            </div>
          </SettingsCardContent>
          <SettingsCardFooter>
            <p className="text-muted-foreground text-sm">
              {t("support.footer")}
            </p>
            <Button
              size="sm"
              onClick={() => submit.mutate()}
              disabled={submit.isPending || !subject || !message}
            >
              {submit.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <Icons.Mail className="size-4" />
              )}
              {t("support.submit")}
            </Button>
          </SettingsCardFooter>
        </SettingsCard>

        {ticketsList.length > 0 && (
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>
                {t("support.previousTickets")}
              </SettingsCardTitle>
            </SettingsCardHeader>
            <SettingsCardContent>
              <div className="flex flex-col divide-y">
                {ticketsList.map((ticket) => (
                  <div key={ticket.id} className="flex flex-col gap-1 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {ticket.subject}
                      </span>
                      <Badge
                        variant={
                          STATUS_VARIANT[
                            ticket.status as keyof typeof STATUS_VARIANT
                          ] ?? "secondary"
                        }
                      >
                        {t(`support.status.${ticket.status}` as "support.status.open")}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {ticket.message}
                    </p>
                    <span className="text-muted-foreground text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString()}
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
