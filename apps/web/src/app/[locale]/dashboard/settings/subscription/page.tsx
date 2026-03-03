import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { SubscriptionView } from "~/modules/settings/subscription-view";

export const generateMetadata = getMetadata({
  title: "dashboard:settings.subscription.title",
  description: "dashboard:settings.subscription.description",
});

export default async function SubscriptionPage() {
  const { user } = await getSession();

  if (!user) {
    return redirect(pathsConfig.index);
  }

  return <SubscriptionView />;
}
