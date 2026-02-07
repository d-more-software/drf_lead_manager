import axios from "axios";

export const api = axios.create({
	baseURL: "/api",
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      try {
        const { data } = await api.post("/accounts/token/refresh/", {
          refresh,
        });

        localStorage.setItem("access", data.access);

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.access}`,
        };

        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

