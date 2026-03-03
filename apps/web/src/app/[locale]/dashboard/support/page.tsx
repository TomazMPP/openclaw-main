import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { SupportForm } from "~/modules/support/support-form";

export const generateMetadata = getMetadata({
  title: "dashboard:support.title",
  description: "dashboard:support.description",
});

export default async function SupportPage() {
  const { user } = await getSession();

  if (!user) {
    return redirect(pathsConfig.index);
  }

  return <SupportForm user={user} />;
}
