"use client";

import { useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { Button } from "@workspace/ui-web/button";
import { Icons } from "@workspace/ui-web/icons";
import { Input } from "@workspace/ui-web/input";
import { Spinner } from "@workspace/ui-web/spinner";
import { toast } from "sonner";

import { authClient } from "~/lib/auth/client";
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

interface AccountViewProps {
  readonly user: User;
}

export const AccountView = ({ user }: AccountViewProps) => {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>
            {t("settings.account.title")}
          </DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("settings.account.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <ProfileCard user={user} />
        <PasswordCard />
        <DeleteAccountCard />
      </div>
    </>
  );
};

const ProfileCard = ({ user }: { user: User }) => {
  const { t } = useTranslation("dashboard");
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authClient.updateUser({ name });
      toast.success(t("settings.account.profileUpdated"));
    } catch {
      toast.error(t("settings.account.profileUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard>
      <SettingsCardHeader>
        <SettingsCardTitle>{t("settings.account.profile")}</SettingsCardTitle>
        <SettingsCardDescription>
          {t("settings.account.profileDescription")}
        </SettingsCardDescription>
      </SettingsCardHeader>
      <SettingsCardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("settings.account.nameLabel")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("settings.account.namePlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("settings.account.emailLabel")}</label>
            <Input value={user.email} disabled />
            <p className="text-muted-foreground text-xs">
              {t("settings.account.emailReadonly")}
            </p>
          </div>
        </div>
      </SettingsCardContent>
      <SettingsCardFooter>
        <p className="text-muted-foreground text-sm">
          {t("settings.account.profileFooter")}
        </p>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || name === user.name}
        >
          {saving ? <Spinner className="size-4" /> : null}
          {t("settings.account.save")}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};

const PasswordCard = () => {
  const { t } = useTranslation("dashboard");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    setSaving(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      toast.success(t("settings.account.passwordUpdated"));
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error(t("settings.account.passwordUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard>
      <SettingsCardHeader>
        <SettingsCardTitle>{t("settings.account.password")}</SettingsCardTitle>
        <SettingsCardDescription>
          {t("settings.account.passwordDescription")}
        </SettingsCardDescription>
      </SettingsCardHeader>
      <SettingsCardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("settings.account.currentPassword")}
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("settings.account.newPassword")}
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
      </SettingsCardContent>
      <SettingsCardFooter>
        <p className="text-muted-foreground text-sm">
          {t("settings.account.passwordFooter")}
        </p>
        <Button
          size="sm"
          onClick={handleChangePassword}
          disabled={saving || !currentPassword || newPassword.length < 8}
        >
          {saving ? <Spinner className="size-4" /> : null}
          {t("settings.account.updatePassword")}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};

const DeleteAccountCard = () => {
  const { t } = useTranslation("dashboard");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t("settings.account.deleteConfirm"))) return;

    setDeleting(true);
    try {
      await authClient.deleteUser();
      window.location.href = "/";
    } catch {
      toast.error(t("settings.account.deleteError"));
      setDeleting(false);
    }
  };

  return (
    <SettingsCard variant="destructive">
      <SettingsCardHeader>
        <SettingsCardTitle>{t("settings.account.dangerZone")}</SettingsCardTitle>
        <SettingsCardDescription>
          {t("settings.account.deleteDescription")}
        </SettingsCardDescription>
      </SettingsCardHeader>
      <SettingsCardFooter>
        <p className="text-muted-foreground text-sm">
          {t("settings.account.deleteWarning")}
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? <Spinner className="size-4" /> : <Icons.Trash className="size-4" />}
          {t("settings.account.deleteAccount")}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};
