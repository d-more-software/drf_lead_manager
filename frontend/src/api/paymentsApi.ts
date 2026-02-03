import { api } from "./axios";

export type PaymentCreate = {
	invoice: number;
	amount: string;
	payment_method: "cash" | "bank" | "mobile" | "crypto";
	reference?: string;
};

export const paymentsApi = {
	create: (data: PaymentCreate) => api.post("/payments/", data),
};
