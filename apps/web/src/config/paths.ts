const ADMIN_PREFIX = "/admin";
const DASHBOARD_PREFIX = "/dashboard";

const API_PREFIX = "/api";

const pathsConfig = {
  index: "/",
  dashboard: {
    index: DASHBOARD_PREFIX,
    admin: {
      users: `${DASHBOARD_PREFIX}/admin`,
    },
  },
} as const;

export { pathsConfig, DASHBOARD_PREFIX, ADMIN_PREFIX, API_PREFIX };
