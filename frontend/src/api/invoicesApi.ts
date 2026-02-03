import { api } from "./axios";

export const invoicesApi = {
	list: (page = 1) => api.get("/invoices/", { params: { page } }),

	retrieve: (id: number) => api.get(`/invoices/${id}/`),

	create: (data: any) => api.post("/invoices/", data),

	update: (id: number, data: any) => api.patch(`/invoices/${id}/`, data),

	remove: (id: number) => api.delete(`/invoices/${id}/`),

	pdf: (id: number) =>
		api.get(`/invoices/${id}/pdf/`, {
			responseType: "blob",
		}),
};
