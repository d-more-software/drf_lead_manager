import type { Invoice } from "../../types/invoice";

type Props = {
	invoices: Invoice[];
	onEdit: (i: Invoice) => void;
	onDelete: (id: number) => void;
	onPdf: (id: number) => void;
};

function money(v: string) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XAF",
	}).format(Number(v));
}

export default function InvoiceTable({
	invoices,
	onEdit,
	onDelete,
	onPdf,
}: Props) {
	if (!invoices.length) {
		return (
			<div className="py-10 text-center opacity-60">Aucune facture</div>
		);
	}

	return (
		<>
			{/* desktop */}
			<div className="hidden md:block overflow-x-auto border rounded-box">
				<table className="table w-full">
					<thead>
						<tr>
							<th>N°</th>
							<th>Montant</th>
							<th>Due</th>
							<th>Statut</th>
							<th />
						</tr>
					</thead>

					<tbody>
						{invoices.map((i) => (
							<tr key={i.id}>
								<td>{i.invoice_number}</td>
								<td>{money(i.amount_total)}</td>
								<td>{i.due_date}</td>
								<td>{i.status}</td>
								<td className="flex gap-2">
									<button
										className="btn btn-xs"
										onClick={() => onEdit(i)}
									>
										Edit
									</button>

									<button
										className="btn btn-xs"
										onClick={() => onPdf(i.id)}
									>
										PDF
									</button>

									<button
										className="btn btn-xs btn-error"
										onClick={() => onDelete(i.id)}
									>
										Del
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* mobile cards */}
			<div className="md:hidden space-y-3">
				{invoices.map((i) => (
					<div key={i.id} className="card border p-3 space-y-2">
						<div className="font-semibold">{i.invoice_number}</div>
						<div>{money(i.amount_total)}</div>
						<div className="text-xs">{i.status}</div>

						<div className="flex gap-2">
							<button
								className="btn btn-xs"
								onClick={() => onEdit(i)}
							>
								Edit
							</button>
							<button
								className="btn btn-xs"
								onClick={() => onPdf(i.id)}
							>
								PDF
							</button>
							<button
								className="btn btn-xs btn-error"
								onClick={() => onDelete(i.id)}
							>
								Del
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
