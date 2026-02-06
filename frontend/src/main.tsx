import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";
import  ToastProvider  from "./components/ui/ToastProvider";
import { AuthProvider } from "./features/auth/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ToastProvider>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</ToastProvider>,
);
