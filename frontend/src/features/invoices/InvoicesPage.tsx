import { useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoiceFormModal from "./InvoiceFormModal";
import { useInvoices } from "./useInvoices";
import type { Invoice } from "../../types/invoice";

export default function InvoicesPage() {
	const {
		invoices,
		loading,
		create,
		update,
        downloadPdf,
		remove,
		count,
		page,
		next,
		previous,
	} = useInvoices();

	const [editing, setEditing] = useState<Invoice | null>(null);
	const [open, setOpen] = useState(false);

	if (loading) return <div>Loading...</div>;

	function handleSubmit(data: any) {
		editing?.id ? update(editing.id, data) : create(data);
	}

	return (
		<div className="space-y-4">
			<button
				className="btn btn-primary"
				onClick={() => {
					setEditing(null);
					setOpen(true);
				}}
			>
				Nouvelle facture
			</button>

			<InvoiceTable
				invoices={invoices}
				onEdit={(i) => {
					setEditing(i);
					setOpen(true);
				}}
				onDelete={remove}
                onPdf={downloadPdf}
			/>

			{/* pagination */}
			<div className="flex justify-between items-center">
				<button
					className="btn btn-sm"
					disabled={page === 1}
					onClick={previous}
				>
					Précédent
				</button>

				<span className="text-sm">
					Page {page} — {count} factures
				</span>

				<button
					className="btn btn-sm"
					disabled={page * 10 >= count}
					onClick={next}
				>
					Suivant
				</button>
			</div>

			<InvoiceFormModal
				open={open}
				initial={editing}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
