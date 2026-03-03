import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { handle } from "@workspace/api/utils";

import { api } from "~/lib/api/client";

import type { InferRequestType } from "hono/client";

const KEY = "api-keys";

const queries = {
  list: queryOptions({
    queryKey: [KEY, "list"],
    queryFn: () => handle(api["api-keys"].$get)(),
  }),
};

const mutations = {
  create: mutationOptions({
    mutationKey: [KEY, "create"],
    mutationFn: (
      json: InferRequestType<(typeof api)["api-keys"]["$post"]>["json"],
    ) => handle(api["api-keys"].$post)({ json }),
  }),
  delete: mutationOptions({
    mutationKey: [KEY, "delete"],
    mutationFn: (
      json: InferRequestType<
        (typeof api)["api-keys"]["delete"]["$post"]
      >["json"],
    ) => handle(api["api-keys"].delete.$post)({ json }),
  }),
};

export const apiKeysApi = {
  queries,
  mutations,
} as const;
