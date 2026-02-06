import { useState } from "react";
import { INVOICE_STATUS_LABELS } from "./invoiceStatus";

export type InvoiceFilterParams = {
	search?: string;
	status?: string;
};

type Props = {
	onChange: (params: InvoiceFilterParams) => void;
};

export default function InvoiceFilters({ onChange }: Props) {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");

	function submit() {
		onChange({
			search: search || undefined,
			status: status || undefined,
		});
	}

	function reset() {
		setSearch("");
		setStatus("");
		onChange({});
	}

	return (
		<div className="flex gap-2 flex-wrap items-end">
			<div className="flex flex-col">
				<label className="text-xs">Recherche</label>
				<input
					className="input input-bordered"
					placeholder="Numéro / Société"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && submit()}
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-xs">Statut</label>
				<select
					className="select select-bordered"
					onChange={(e) => setStatus(e.target.value)}
				>
					<option value="">Tous les statuts</option>

					{Object.entries(INVOICE_STATUS_LABELS).map(
						([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						),
					)}
				</select>
			</div>

			<button className="btn btn-primary" onClick={submit}>
				Filtrer
			</button>

			<button className="btn btn-ghost" onClick={reset}>
				Reset
			</button>
		</div>
	);
}
