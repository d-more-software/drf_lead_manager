import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
	return (
		<div className="drawer lg:drawer-open">
			<input id="app-drawer" type="checkbox" className="drawer-toggle" />

			<div className="drawer-content flex flex-col">
				{/* mobile top bar */}
				<div className="navbar bg-base-100 border-b lg:hidden">
					<label htmlFor="app-drawer" className="btn btn-ghost">
						☰
					</label>
				</div>

				{/* ✅ header desktop */}
				<Header />

				<main className="p-6 flex-1">
					<Outlet />
				</main>
			</div>

			<div className="drawer-side">
				<label htmlFor="app-drawer" className="drawer-overlay" />
				<Sidebar />
			</div>
		</div>
	);
}
