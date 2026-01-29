import { useAuth } from "../features/auth/AuthContext";

export default function Header() {
	const { logout } = useAuth();

	return (
		<header className="h-14 border-b bg-base-100 flex items-center justify-end px-6">
			<button className="btn btn-sm btn-outline" onClick={logout}>
				Déconnexion
			</button>
		</header>
	);
}
