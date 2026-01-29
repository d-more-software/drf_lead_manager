import { useState, useEffect } from "react";
import type { BillingFrequency } from "../../types/contract";

const frequencies: BillingFrequency[] = [
	"MONTHLY",
	"QUARTERLY",
	"HALF_YEARLY",
	"YEARLY",
];

export default function ContractFormModal({
	open,
	initial,
	companies,
	onClose,
	onSubmit,
}: any) {
	const [form, setForm] = useState<any>({});

	useEffect(() => {
		setForm(initial ?? {});
	}, [initial]);

	if (!open) return null;

	function set(key: string, value: any) {
		setForm((f: any) => ({ ...f, [key]: value }));
	}

	return (
		<div className="modal modal-open">
			<div className="modal-box space-y-3">
				<input
					className="input input-bordered w-full"
					placeholder="Nom"
					value={form.name || ""}
					onChange={(e) => set("name", e.target.value)}
				/>

				<select
					className="select select-bordered w-full"
					value={form.company || ""}
					onChange={(e) => set("company", Number(e.target.value))}
				>
					<option value="">Entreprise</option>
					{companies.map((c: any) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>

				<select
					className="select select-bordered w-full"
					value={form.billing_frequency || "MONTHLY"}
					onChange={(e) => set("billing_frequency", e.target.value)}
				>
					{frequencies.map((f) => (
						<option key={f}>{f}</option>
					))}
				</select>

				<input
					type="date"
					className="input input-bordered w-full"
					value={form.start_date || ""}
					onChange={(e) => set("start_date", e.target.value)}
				/>

				<input
					className="input input-bordered w-full"
					placeholder="Jour de facturation"
					type="number"
					value={form.billing_day || 1}
					onChange={(e) => set("billing_day", Number(e.target.value))}
				/>

				<input
					className="input input-bordered w-full"
					placeholder="Montant"
					value={form.amount_due || "0"}
					onChange={(e) => set("amount_due", e.target.value)}
				/>

				<div className="modal-action">
					<button className="btn" onClick={onClose}>
						Fermer
					</button>
					<button
						className="btn btn-primary"
						onClick={() => {
							onSubmit(form);
							onClose();
						}}
					>
						sauvegarder
					</button>
				</div>
			</div>
		</div>
	);
}
