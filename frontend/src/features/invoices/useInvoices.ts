import { useEffect, useState } from "react";
import { invoicesApi } from "../../api/invoicesApi";
import type { Invoice } from "../../types/invoice";

const PAGE_SIZE = 10;

export function useInvoices() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);

	async function load(p = page) {
		setLoading(true);

		const { data } = await invoicesApi.list(p);

		setInvoices(data.results);
		setCount(data.count);

		setLoading(false);
	}

	async function create(payload: Partial<Invoice>) {
		await invoicesApi.create(payload);
		load();
	}

	async function update(id: number, payload: Partial<Invoice>) {
		await invoicesApi.update(id, payload);
		load();
	}

	async function remove(id: number) {
		await invoicesApi.remove(id);
		load();
	}

async function downloadPdf(id: number) {
  const res = await invoicesApi.pdf(id);

  const blob = new Blob([res.data], { type: "application/pdf" });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${id}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}


	function next() {
		if (page * PAGE_SIZE < count) {
			const p = page + 1;
			setPage(p);
			load(p);
		}
	}

	function previous() {
		if (page > 1) {
			const p = page - 1;
			setPage(p);
			load(p);
		}
	}

	useEffect(() => {
		load(1);
	}, []);

	return {
		invoices,
		loading,
		create,
		update,
		remove,
		downloadPdf,
		page,
		count,
		next,
		previous,
	};
}
