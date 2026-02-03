import { paymentsApi, type PaymentCreate } from "../../api/paymentsApi";

export function usePayments() {
	async function create(data: PaymentCreate) {
		await paymentsApi.create(data);
	}

	return { create };
}
