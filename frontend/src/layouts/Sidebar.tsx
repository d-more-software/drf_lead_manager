import { NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Sidebar() {
	const { user } = useAuth();

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`px-4 py-2 rounded-lg transition ${
			isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
		}`;

	function closeDrawer() {
		const el = document.getElementById(
			"app-drawer",
		) as HTMLInputElement | null;
		if (el) el.checked = false;
	}

	return (
		<aside className="w-64 bg-base-100 border-r min-h-screen p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-6">Billing SaaS</h2>

			<nav className="flex flex-col gap-2 flex-1">
				<NavLink to="/" className={linkClass} onClick={closeDrawer}>
					Tableau de bord
				</NavLink>

				<NavLink
					to="/companies"
					className={linkClass}
					onClick={closeDrawer}
				>
					Entreprises
				</NavLink>

				<NavLink
					to="/contracts"
					className={linkClass}
					onClick={closeDrawer}
				>
					Contrats
				</NavLink>

				<NavLink
					to="/invoices"
					className={linkClass}
					onClick={closeDrawer}
				>
					Facturation
				</NavLink>
			</nav>

			<div className="text-xs opacity-60 mt-6">{user?.email}</div>
		</aside>
	);
}
