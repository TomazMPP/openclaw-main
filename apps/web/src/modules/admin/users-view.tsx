"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "@workspace/i18n";
import { cn } from "@workspace/ui";
import { Icons } from "@workspace/ui-web/icons";

import { authClient } from "~/lib/auth/client";
import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
} from "~/modules/common/layout/dashboard/header";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
}

export const AdminUsersView = () => {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await authClient.admin.listUsers({
        query: { limit: 100 },
      });
      setUsers(
        (response.users ?? []) as unknown as AdminUser[],
      );
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleSetRole = async (userId: string, role: "user" | "admin") => {
    await authClient.admin.setRole({
      userId,
      role,
    });
    void fetchUsers();
  };

  const handleBan = async (userId: string) => {
    if (!confirm(t("admin.confirmBan"))) return;
    await authClient.admin.banUser({ userId });
    void fetchUsers();
  };

  const handleUnban = async (userId: string) => {
    await authClient.admin.unbanUser({ userId });
    void fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await authClient.admin.removeUser({ userId });
    void fetchUsers();
  };

  return (
    <>
      <DashboardHeader>
        <div>
          <DashboardHeaderTitle>{t("admin.title")}</DashboardHeaderTitle>
          <DashboardHeaderDescription>
            {t("admin.description")}
          </DashboardHeaderDescription>
        </div>
      </DashboardHeader>

      <div className="text-muted-foreground mb-4 text-sm">
        {t("admin.totalUsers", { count: users.length })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icons.Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("admin.noUsers")}
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    {tc("name")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {tc("email")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {tc("role")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {tc("status")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {tc("createdAt")}
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    {tc("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name}
                            className="size-7 rounded-full"
                            width={28}
                            height={28}
                          />
                        ) : (
                          <div className="bg-muted flex size-7 items-center justify-center rounded-full">
                            <Icons.UserRound className="size-4" />
                          </div>
                        )}
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {user.role === "admin" ? tc("admin") : tc("user")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          user.banned
                            ? "bg-destructive/10 text-destructive"
                            : "text-emerald-600 bg-emerald-500/10",
                        )}
                      >
                        {user.banned ? tc("banned") : tc("running")}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {user.role !== "admin" ? (
                          <button
                            onClick={() => handleSetRole(user.id, "admin")}
                            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                            title={t("admin.setRole", {
                              role: tc("admin"),
                            })}
                          >
                            <Icons.ShieldUser className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSetRole(user.id, "user")}
                            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                            title={t("admin.setRole", {
                              role: tc("user"),
                            })}
                          >
                            <Icons.UserRound className="size-4" />
                          </button>
                        )}
                        {user.banned ? (
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                            title={tc("unban")}
                          >
                            <Icons.CheckCircle2 className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                            title={tc("ban")}
                          >
                            <Icons.Ban className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                          title={tc("delete")}
                        >
                          <Icons.Trash className="size-4" />
                        </button>
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
