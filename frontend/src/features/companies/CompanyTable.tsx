import type { Company } from "../../types/company";

function money(v: number | string | null) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XAF",
	}).format(Number(v || 0));
}

type Props = {
	companies: Company[];
	isAdmin: boolean;
	onEdit: (c: Company) => void;
	onDelete: (Company: Company) => void;
};

export default function CompanyTable({
	companies = [],
	isAdmin,
	onEdit,
	onDelete,
}: Props) {
	if (!companies.length) {
		return (
			<div className="text-center opacity-60 py-10">
				Aucune entreprise
			</div>
		);
	}

	return (
		/* ✅ scroll horizontal mobile */
		<div className="overflow-x-auto rounded-box border bg-base-100">
			<table className="table table-sm md:table-md w-full">
				<thead>
					<tr>
						<th>Nom</th>
						<th className="hidden sm:table-cell">Ville</th>
						<th>Total dû</th>
						<th className="hidden md:table-cell">Limite crédit</th>
						<th className="hidden md:table-cell">Statut</th>
						{isAdmin && <th className="w-32" />}
					</tr>
				</thead>

				<tbody>
					{companies.map((c) => (
						<tr
							key={c.id}
							className="hover cursor-pointer"
							onClick={() => onEdit(c)}
						>
							<td className="font-medium">{c.name}</td>

							{/* cache sur petit écran */}
							<td className="hidden sm:table-cell">{c.city}</td>

							<td>{money(c.total_due)}</td>

							<td className="hidden md:table-cell">
								{money(c.credit_limit)}
							</td>

							<td className="hidden md:table-cell">
								<span className="badge">{c.status}</span>
							</td>

							{isAdmin && (
								<td
									className="space-y-1 md:space-y-0 md:space-x-2"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="flex flex-col md:flex-row gap-1">
										<button
											className="btn btn-xs w-full md:w-auto"
											onClick={() => onEdit(c)}
										>
											Modifier
										</button>

										<button
											className="btn btn-xs btn-error w-full md:w-auto"
											onClick={() => onDelete(c)}
										>
											Supprimer
										</button>
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
