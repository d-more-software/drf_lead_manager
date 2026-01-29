import type { Company } from "../../types/company";

export default function CompanyTable({
	companies,
	isAdmin,
	onEdit,
	onDelete,
}: {
	companies: Company[];
	isAdmin: boolean;
	onEdit: (c: Company) => void;
	onDelete: (id: number) => void;
}) {
	return (
		<table className="table w-full">
			<thead>
				<tr>
					<th>Nom</th>
					<th>Ville</th>
					<th>Total due</th>
					<th>Status</th>
					{isAdmin && <th />}
				</tr>
			</thead>

			<tbody>
				{companies.map((c) => (
					<tr key={c.id}>
						<td>{c.name}</td>
						<td>{c.city}</td>
						<td>{c.total_due} €</td>
						<td>
							<span className="badge">{c.status}</span>
						</td>

						{isAdmin && (
							<td className="space-x-2">
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
