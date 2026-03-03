import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { AdminFeedbackView } from "~/modules/admin/feedback-view";

export const generateMetadata = getMetadata({
  title: "dashboard:admin.feedbackTitle",
  description: "dashboard:admin.feedbackDescription",
});

export default async function AdminFeedbackPage() {
  const { user } = await getSession();

  if (!user || user.role !== "admin") {
    return redirect(pathsConfig.dashboard.index);
  }

  return <AdminFeedbackView />;
}
