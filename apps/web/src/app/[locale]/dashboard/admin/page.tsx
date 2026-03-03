import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { AdminUsersView } from "~/modules/admin/users-view";

export const generateMetadata = getMetadata({
  title: "dashboard:admin.title",
  description: "dashboard:admin.description",
});

export default async function AdminPage() {
  const { user } = await getSession();

  if (!user || user.role !== "admin") {
    return redirect(pathsConfig.dashboard.index);
  }

  return <AdminUsersView />;
}
