import { redirect } from "next/navigation";

import { pathsConfig } from "~/config/paths";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { ApiKeysView } from "~/modules/settings/api-keys-view";

export const generateMetadata = getMetadata({
  title: "dashboard:settings.apiKeys.title",
  description: "dashboard:settings.apiKeys.description",
});

export default async function ApiKeysPage() {
  const { user } = await getSession();

  if (!user) {
    return redirect(pathsConfig.index);
  }

  return <ApiKeysView />;
}
