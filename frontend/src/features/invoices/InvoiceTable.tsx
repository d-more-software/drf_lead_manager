import type { Invoice } from "../../types/invoice";
import { invoiceStatusLabel } from "./invoiceStatus";

type Props = {
	invoices: Invoice[];
	onEdit: (i: Invoice) => void;
	onDelete: (invoice: Invoice) => void;
	onPdf: (i: Invoice) => void;
	onPay: (i: Invoice) => void;
};

function money(v: number | string) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XAF",
	}).format(Number(v || 0));
}

export default function InvoiceTable({
	invoices = [],
	onEdit,
	onDelete,
	onPdf,
	onPay,
}: Props) {
	if (!invoices.length) {
		return (
			<div className="text-center opacity-60 py-10">Aucune facture</div>
		);
	}

	return (
		<div className="space-y-3">
			{invoices.map((i) => (
				<div key={i.id} className="card bg-base-100 border shadow-sm">
					<div className="card-body p-4 space-y-2">
						<div className="flex justify-between">
							<span className="font-semibold">
								{i.invoice_number}
							</span>

							<span className="badge">
								{invoiceStatusLabel(i.status)}
							</span>
						</div>

						<div className="text-sm opacity-70">
							{i.issue_date} → {i.due_date}
						</div>

						<div className="font-medium">
							Total : {money(i.amount_total)}
						</div>

						<div className="text-error font-semibold">
							Dû : {money(i.amount_due)}
						</div>

						<div className="flex flex-col gap-2 pt-2">
							<button
								className="btn btn-xs w-full"
								onClick={() => onEdit(i)}
							>
								Modifier
							</button>

							<button
								className="btn btn-xs btn-info w-full"
								onClick={() => onPdf(i)}
							>
								PDF
							</button>
							{Number(i.amount_due) > 0 && (
								<button
									className="btn btn-xs btn-success w-full"
									onClick={() => onPay(i)}
								>
									Paiement
								</button>
							)}

							<button
								className="btn btn-xs btn-error w-full"
								onClick={() => onDelete(i)}
							>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
