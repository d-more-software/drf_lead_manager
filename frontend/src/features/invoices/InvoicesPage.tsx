import { useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoiceFormModal from "./InvoiceFormModal";
import InvoicePaymentModal from "./InvoicePaymentModal";
import { useInvoices } from "./useInvoices";
import type { Invoice } from "../../types/invoice";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import TableState from "../../components/ui/TableState";
import InvoiceFilters from "./InvoiceFilters";

export default function InvoicesPage() {
	const {
		invoices,
		setInvoices, // ← important pour optimistic update
		loading,
		create,
		update,
		remove,
		next,
		previous,
		page,
		count,
		downloadPdf,
		fetch,
	} = useInvoices();

	const [editing, setEditing] = useState<Invoice | null>(null);
	const [open, setOpen] = useState(false);
	const [paying, setPaying] = useState<Invoice | null>(null);

	const [toDelete, setToDelete] = useState<Invoice | null>(null);
	const [loadingDelete, setLoadingDelete] = useState(false);

	function handleSubmit(data: Partial<Invoice>) {
		editing?.id != null ? update(editing.id, data) : create(data);
	}

	return (
		<div className="space-y-4">
			<button
				className="btn btn-primary w-full md:w-auto"
				onClick={() => {
					setEditing(null);
					setOpen(true);
				}}
			>
				Nouvelle facture
			</button>

			<InvoiceFilters
				onChange={(p) =>
					Object.keys(p).length === 0
						? fetch({ page: 1 }, true)
						: fetch({ ...p, page: 1 })
				}
			/>

			<TableState
				loading={loading}
				empty={invoices.length === 0}
				emptyMessage="Aucune facture trouvée"
			>
				<InvoiceTable
					invoices={invoices}
					onEdit={(i) => {
						setEditing(i);
						setOpen(true);
					}}
					onDelete={(i) => setToDelete(i)}
					onPdf={(i) => downloadPdf(i.id)}
					onPay={(i) => setPaying(i)}
				/>
			</TableState>

			<div className="flex justify-between items-center">
				<button className="btn btn-sm" onClick={previous}>
					Précédent
				</button>

				<span className="text-sm">
					Page {page} — {count} factures
				</span>

				<button className="btn btn-sm" onClick={next}>
					Suivant
				</button>
			</div>

			{/* Create / Edit */}
			<InvoiceFormModal
				open={open}
				initial={editing}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
			/>

			{/* Payment with optimistic update */}
			<InvoicePaymentModal
				open={!!paying}
				invoiceId={paying?.id ?? null}
				maxAmount={Number(paying?.amount_due ?? 0)}
				onClose={() => setPaying(null)}
				onSuccess={(paidAmount) => {
					if (!paying) return;

					setInvoices((prev: Invoice[]) =>
						prev.map((inv): Invoice => {
							if (inv.id !== paying.id) return inv;

							const newDue = Number(inv.amount_due) - paidAmount;

							return {
								...inv,
								amount_due: String(newDue),
								status: newDue <= 0 ? "paid" : inv.status, // ← FIX
							};
						}),
					);
				}}
			/>

			{/* Delete */}
			<ConfirmDialog
				open={!!toDelete}
				title="Supprimer la facture"
				message="Cette action est irréversible."
				loading={loadingDelete}
				onClose={() => setToDelete(null)}
				onConfirm={async () => {
					if (!toDelete) return;

					setLoadingDelete(true);
					await remove(toDelete.id);
					setLoadingDelete(false);

					setToDelete(null);
				}}
			/>
		</div>
	);
}
