import type { Contract } from "../../types/contract";

export default function ContractTable({
	contracts,
	companies,
	isAdmin,
	onEdit,
	onDelete,
}: any) {
	function companyName(id: number) {
		return companies.find((c: any) => c.id === id)?.name ?? id;
	}

	return (
		<table className="table w-full">
			<thead>
				<tr>
					<th>Entreprise</th>
					<th>Nom</th>
					<th>Frequence</th>
					<th>Montant</th>
					{isAdmin && <th />}
				</tr>
			</thead>

			<tbody>
				{contracts.map((c: Contract) => (
					<tr key={c.id}>
						<td>{companyName(c.company)}</td>
						<td>{c.name}</td>
						<td>{c.billing_frequency}</td>
						<td>{c.amount_due} €</td>

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
