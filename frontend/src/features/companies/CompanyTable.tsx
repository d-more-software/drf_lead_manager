import type { Company } from "../../types/company";

function money(v: number | string) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XAF",
	}).format(Number(v || 0));
}

export default function CompanyTable({
	companies = [],
	isAdmin,
	onEdit,
	onDelete,
}: {
	companies: Company[];
	isAdmin: boolean;
	onEdit: (c: Company) => void;
	onDelete: (id: number) => void;
}) {
	if (!Array.isArray(companies) || companies.length === 0) {
		return (
			<div className="text-center opacity-60 py-10">
				Aucune entreprise
			</div>
		);
	}

	return (
		<table className="table w-full">
			<thead>
				<tr>
					<th>Nom</th>
					<th>Ville</th>
					<th>Total dû</th>
					<th>Limite crédit</th>
					<th>Statut</th>
					{isAdmin && <th />}
				</tr>
			</thead>

			<tbody>
				{companies.map((c) => (
					<tr
						key={c.id}
						className="hover cursor-pointer"
						onClick={() => onEdit(c)}
					>
						<td>{c.name}</td>
						<td>{c.city}</td>
						<td>{money(c.total_due)}</td>
						<td>{money(c.credit_limit)}</td>
						<td>
							<span className="badge">{c.status}</span>
						</td>

						{isAdmin && (
							<td
								className="space-x-2"
								onClick={(e) => e.stopPropagation()} // évite edit au click bouton
							>
								<button
									className="btn btn-xs"
									onClick={() => onEdit(c)}
								>
									Modifier
								</button>

								<button
									className="btn btn-xs btn-error"
									onClick={() => onDelete(c.id)}
								>
									Supprimer
								</button>
							</td>
						)}
					</tr>
				))}
			</tbody>
		</table>
	);
}
