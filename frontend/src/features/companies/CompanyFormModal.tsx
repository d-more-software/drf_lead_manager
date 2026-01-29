import { useState, useEffect } from "react";
import type { Company } from "../../types/company";

export default function CompanyFormModal({
	open,
	initial,
	onClose,
	onSubmit,
}: {
	open: boolean;
	initial?: Company | null;
	onClose: () => void;
	onSubmit: (data: any) => void;
}) {
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

				<input
					className="input input-bordered w-full"
					placeholder="Secteurr"
					value={form.sector || ""}
					onChange={(e) => set("sector", e.target.value)}
				/>

				<input
					className="input input-bordered w-full"
					placeholder="Email"
					value={form.email || ""}
					onChange={(e) => set("email", e.target.value)}
				/>

				<input
					className="input input-bordered w-full"
					placeholder="Ville"
					value={form.city || ""}
					onChange={(e) => set("city", e.target.value)}
				/>

				<input
					className="input input-bordered w-full"
					placeholder="Credit limit"
					value={form.credit_limit || "0"}
					onChange={(e) => set("credit_limit", e.target.value)}
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
						Sauvegarder
					</button>
				</div>
			</div>
		</div>
	);
}
