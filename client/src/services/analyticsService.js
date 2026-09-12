import api from "./api";

const getAnalyticsOverview = async () => {
  const response = await api.get("/analytics/overview");
  return response.data;
};

const analyticsService = {
  getAnalyticsOverview,
};

export default analyticsService;