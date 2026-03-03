import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { AdminSupportView } from "~/modules/admin/support-view";

export const generateMetadata = getMetadata({
  title: "dashboard:admin.supportTitle",
  description: "dashboard:admin.supportDescription",
});

export default async function AdminSupportPage() {
  const { user } = await getSession();

  if (!user || user.role !== "admin") {
    return redirect(pathsConfig.dashboard.index);
  }

  return <AdminSupportView />;
}
