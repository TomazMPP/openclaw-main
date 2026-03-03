import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { FeedbackForm } from "~/modules/feedback/feedback-form";

export const generateMetadata = getMetadata({
  title: "dashboard:feedback.title",
  description: "dashboard:feedback.description",
});

export default async function FeedbackPage() {
  const { user } = await getSession();

  if (!user) {
    return redirect(pathsConfig.index);
  }

  return <FeedbackForm />;
}
