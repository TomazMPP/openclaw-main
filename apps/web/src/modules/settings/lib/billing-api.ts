import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { handle } from "@workspace/api/utils";

import { api } from "~/lib/api/client";

const KEY = "billing";

const queries = {
  subscription: queryOptions({
    queryKey: [KEY, "subscription"],
    queryFn: () => handle(api.billing.subscription.$get)(),
  }),
};

const mutations = {
  checkout: mutationOptions({
    mutationKey: [KEY, "checkout"],
    mutationFn: async () => {
      const res = await api.billing.checkout.$post();
      const data = await res.json();
      if (!res.ok) throw new Error("error" in data ? data.error : "Failed");
      return data as { url: string | null };
    },
  }),
  portal: mutationOptions({
    mutationKey: [KEY, "portal"],
    mutationFn: async () => {
      const res = await api.billing.portal.$post();
      const data = await res.json();
      if (!res.ok) throw new Error("error" in data ? data.error : "Failed");
      return data as { url: string };
    },
  }),
};

export const billing = {
  queries,
  mutations,
} as const;
