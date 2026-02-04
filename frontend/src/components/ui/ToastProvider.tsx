import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";

/* ================================
   Types
================================ */

type ToastType = "success" | "error" | "info";

type Toast = {
	id: number;
	message: string;
	type: ToastType;
};

type ToastContextType = {
	success: (msg: string) => void;
	error: (msg: string) => void;
	info: (msg: string) => void;
};

/* ================================
   Context
================================ */

const ToastContext = createContext<ToastContextType | null>(null);

let counter = 0;

/* ================================
   Provider
================================ */

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const push = useCallback((message: string, type: ToastType) => {
		const id = ++counter;

		setToasts((t) => [...t, { id, message, type }]);

		setTimeout(() => {
			setToasts((t) => t.filter((x) => x.id !== id));
		}, 3000);
	}, []);

	const value: ToastContextType = {
		success: (m) => push(m, "success"),
		error: (m) => push(m, "error"),
		info: (m) => push(m, "info"),
	};

	return (
		<ToastContext.Provider value={value}>
			{children}

			{/* container */}
			<div className="toast toast-top toast-end z-50">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={`alert shadow-lg ${
							t.type === "success"
								? "alert-success"
								: t.type === "error"
									? "alert-error"
									: "alert-info"
						}`}
					>
						<span>{t.message}</span>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

/* ================================
   Hook
================================ */

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used inside ToastProvider");
	return ctx;
}
