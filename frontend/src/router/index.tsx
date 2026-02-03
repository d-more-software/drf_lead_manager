import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

import Dashboard from "../features/dashboard/DashboardPage";
import CompaniesPage from "../features/companies/CompaniesPage";
import ContractsPage from "../features/contracts/ContractsPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import InvoicesPage from "../features/invoices/InvoicesPage";

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},

	{
		path: "/",
		element: (
			<ProtectedRoute>
				<AppLayout />
			</ProtectedRoute>
		),
		children: [
			{ index: true, element: <Dashboard /> },
			{ path: "companies", element: <CompaniesPage /> },
			{ path: "contracts", element: <ContractsPage /> },
            { path: "invoices", element: <InvoicesPage /> },
		],
	},
]);
