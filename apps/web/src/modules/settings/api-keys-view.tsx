"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { Badge } from "@workspace/ui-web/badge";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";
import { Input } from "@workspace/ui-web/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-web/select";
import { Spinner } from "@workspace/ui-web/spinner";
import { toast } from "sonner";

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
import { apiKeysApi } from "~/modules/settings/lib/api-keys-api";

interface ApiKeyItem {
  id: string;
  provider: string;
  label: string;
  maskedKey: string;
  createdAt: string;
}

const PROVIDERS = [
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
  { id: "google", name: "Google AI" },
] as const;

export const ApiKeysView = () => {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();

  const keys = useQuery(apiKeysApi.queries.list);
  const keysList = (keys.data ?? []) as unknown as ApiKeyItem[];

  const [provider, setProvider] = useState<string>("openai");
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");

  const createKey = useMutation({
    ...apiKeysApi.mutations.create,
    onSuccess: () => {
      void queryClient.invalidateQueries(apiKeysApi.queries.list);
      toast.success(t("settings.apiKeys.addSuccess"));
      setKey("");
      setLabel("");
    },
    onError: () => {
      toast.error(t("settings.apiKeys.addError"));
    },
  });

  const deleteKey = useMutation({
    ...apiKeysApi.mutations.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries(apiKeysApi.queries.list);
      toast.success(t("settings.apiKeys.deleteSuccess"));
    },
  });

  const handleAdd = () => {
    createKey.mutate({ provider: provider as "openai" | "anthropic" | "google", key, label });
  };

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>
            {t("settings.apiKeys.title")}
          </DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("settings.apiKeys.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <SettingsCard>
          <SettingsCardHeader>
            <SettingsCardTitle>
              {t("settings.apiKeys.addKey")}
            </SettingsCardTitle>
            <SettingsCardDescription>
              {t("settings.apiKeys.addKeyDescription")}
            </SettingsCardDescription>
          </SettingsCardHeader>
          <SettingsCardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("settings.apiKeys.provider")}
                </label>
                <Select value={provider} onValueChange={(v) => { if (v) setProvider(v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("settings.apiKeys.label")}
                </label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={t("settings.apiKeys.labelPlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("settings.apiKeys.keyValue")}
                </label>
                <Input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
            </div>
          </SettingsCardContent>
          <SettingsCardFooter>
            <p className="text-muted-foreground text-sm">
              {t("settings.apiKeys.addFooter")}
            </p>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={createKey.isPending || !key || !label}
            >
              {createKey.isPending ? <Spinner className="size-4" /> : <Icons.Plus className="size-4" />}
              {t("settings.apiKeys.add")}
            </Button>
          </SettingsCardFooter>
        </SettingsCard>

        {keysList.length > 0 && (
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>
                {t("settings.apiKeys.yourKeys")}
              </SettingsCardTitle>
            </SettingsCardHeader>
            <SettingsCardContent>
              <div className="flex flex-col divide-y">
                {keysList.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{k.label}</span>
                        <Badge variant="secondary">{k.provider}</Badge>
                      </div>
                      <span className="text-muted-foreground font-mono text-xs">
                        {k.maskedKey}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => {
                        if (confirm(t("settings.apiKeys.deleteConfirm"))) {
                          deleteKey.mutate({ id: k.id });
                        }
                      }}
                      disabled={deleteKey.isPending}
                    >
                      <Icons.Trash className="size-4" />
                    </Button>
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
