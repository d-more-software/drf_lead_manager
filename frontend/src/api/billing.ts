import { api } from "./axios";

export const billingStatsApi = () =>
  api.get("/billing/stats/");
