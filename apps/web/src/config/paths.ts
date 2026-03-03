const ADMIN_PREFIX = "/admin";
const DASHBOARD_PREFIX = "/dashboard";

const API_PREFIX = "/api";

const pathsConfig = {
  index: "/",
  dashboard: {
    index: DASHBOARD_PREFIX,
    settings: {
      account: `${DASHBOARD_PREFIX}/settings/account`,
      subscription: `${DASHBOARD_PREFIX}/settings/subscription`,
      apiKeys: `${DASHBOARD_PREFIX}/settings/api-keys`,
    },
    support: `${DASHBOARD_PREFIX}/support`,
    feedback: `${DASHBOARD_PREFIX}/feedback`,
    admin: {
      users: `${DASHBOARD_PREFIX}/admin`,
      support: `${DASHBOARD_PREFIX}/admin/support`,
      feedback: `${DASHBOARD_PREFIX}/admin/feedback`,
    },
  },
} as const;

export { pathsConfig, DASHBOARD_PREFIX, ADMIN_PREFIX, API_PREFIX };
