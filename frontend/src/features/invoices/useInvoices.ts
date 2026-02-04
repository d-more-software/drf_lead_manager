import { useEffect, useState } from "react";
import { invoicesApi } from "../../api/invoicesApi";
import type { Invoice } from "../../types/invoice";

const PAGE_SIZE = 10;

export type InvoiceFilterParams = {
	search?: string;
	status?: string;
	start_date?: string;
	end_date?: string;
	page?: number;
};

export function useInvoices() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);

	const [filters, setFilters] = useState<InvoiceFilterParams>({});

	/* =========================
	   SINGLE SOURCE OF TRUTH
	   ========================= */
	async function fetch(params?: InvoiceFilterParams, replace = false) {
		setLoading(true);

		const finalParams = replace ? params || {} : { ...filters, ...params };

		const { data } = await invoicesApi.list(finalParams);

		setInvoices(data.results);
		setCount(data.count);

		setFilters(finalParams);
		setPage(finalParams.page ?? 1);

		setLoading(false);
	}

	/* =========================
	   CRUD
	   ========================= */

	async function create(payload: Partial<Invoice>) {
		await invoicesApi.create(payload);
		fetch();
	}

	async function update(id: number, payload: Partial<Invoice>) {
		await invoicesApi.update(id, payload);
		fetch();
	}

	async function remove(id: number) {
		await invoicesApi.remove(id);
		fetch();
	}

	async function downloadPdf(id: number) {
		const res = await invoicesApi.pdf(id);

		const blob = new Blob([res.data], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `invoice_${id}.pdf`;
		link.click();

		window.URL.revokeObjectURL(url);
	}

	/* =========================
	   PAGINATION (keeps filters)
	   ========================= */

	function next() {
		if (page * PAGE_SIZE < count) {
			fetch({ page: page + 1 });
		}
	}

	function previous() {
		if (page > 1) {
			fetch({ page: page - 1 });
		}
	}

	useEffect(() => {
		fetch({ page: 1 }, true);
	}, []);

	return {
		invoices,
		loading,
		create,
		update,
		remove,
		downloadPdf,
		fetch,
		page,
		count,
		next,
		previous,
	};
}
