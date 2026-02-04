import { useState } from "react";

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
					value={status}
					onChange={(e) => setStatus(e.target.value)}
				>
					<option value="">Tous</option>
					<option value="draft">Draft</option>
					<option value="pending">Pending</option>
					<option value="paid">Paid</option>
					<option value="overdue">Overdue</option>
					<option value="cancelled">Cancelled</option>
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
