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
		loading,
		create,
		update,
		remove,
		next,
		previous,
		page,
		count,
		downloadPdf,
		fetch, // ← ajouter
	} = useInvoices();

	const [editing, setEditing] = useState<Invoice | null>(null);
	const [open, setOpen] = useState(false);
	const [paying, setPaying] = useState<Invoice | null>(null);

	const [toDelete, setToDelete] = useState<Invoice | null>(null);
	const [loadingDelete, setLoadingDelete] = useState(false);

	// if (loading) return <div>Loading...</div>;

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
				onChange={
					(p) =>
						Object.keys(p).length === 0
							? fetch({ page: 1 }, true) // reset
							: fetch({ ...p, page: 1 }) // filter
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

			{/* <InvoiceTable
				invoices={invoices}
				onEdit={(i) => {
					setEditing(i);
					setOpen(true);
				}}
				// onDelete={(i) => remove(i)}
				onDelete={(i) => setToDelete(i)}
				onPdf={(i) => downloadPdf(i.id)}
				onPay={(i) => setPaying(i)}
			/> */}

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

			<InvoiceFormModal
				open={open}
				initial={editing}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
			/>

			<InvoicePaymentModal
				open={!!paying}
				invoiceId={paying?.id ?? null}
				maxAmount={Number(paying?.amount_due ?? 0)}
				onClose={() => setPaying(null)}
				// onSuccess={() => fetch()}
			/>

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
					// fetch();
				}}
			/>
		</div>
	);
}
