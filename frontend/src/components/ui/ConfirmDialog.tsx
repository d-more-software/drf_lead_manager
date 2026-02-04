import { useEffect } from "react";

type Props = {
	open: boolean;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
	onClose: () => void;
};

export default function ConfirmDialog({
	open,
	title = "Confirmation",
	message = "Êtes-vous sûr ?",
	confirmText = "Supprimer",
	cancelText = "Annuler",
	loading = false,
	onConfirm,
	onClose,
}: Props) {
	// ESC → close
	useEffect(() => {
		if (!open) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box space-y-4">
				<h3 className="font-bold text-lg">{title}</h3>

				<p className="opacity-80">{message}</p>

				<div className="modal-action">
					<button
						className="btn"
						onClick={onClose}
						disabled={loading}
					>
						{cancelText}
					</button>

					<button
						className="btn btn-error"
						onClick={onConfirm}
						disabled={loading}
					>
						{loading && (
							<span className="loading loading-spinner loading-xs" />
						)}
						{confirmText}
					</button>
				</div>
			</div>

			{/* click outside */}
			<div className="modal-backdrop" onClick={onClose} />
		</div>
	);
}
