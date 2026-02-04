import { api } from "./axios";

export type InvoiceQueryParams = {
	page?: number;
	search?: string;
	status?: string;
	ordering?: string;
};

export const invoicesApi = {
	list: (params?: any) => api.get("/invoices/", { params }),

	retrieve: (id: number) => api.get(`/invoices/${id}/`),

	create: (data: any) => api.post("/invoices/", data),

	update: (id: number, data: any) => api.patch(`/invoices/${id}/`, data),

	remove: (id: number) => api.delete(`/invoices/${id}/`),

	pdf: (id: number) =>
		api.get(`/invoices/${id}/pdf/`, {
			responseType: "blob",
		}),
};
