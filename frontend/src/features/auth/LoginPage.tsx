import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setError("");
			await login(email, password);
			navigate("/");
		} catch {
			setError("Identifiants invalides");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-96 bg-base-100 shadow-xl">
				<div className="card-body">
					<h1 className="text-2xl font-bold text-center">
						Connexion
					</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="email"
							placeholder="Email"
							className="input input-bordered w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<input
							type="password"
							placeholder="Mot de passe"
							className="input input-bordered w-full"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						{error && <p className="text-error text-sm">{error}</p>}

						<button className="btn btn-primary w-full">
							Se connecter
						</button>
					</form>

					<p className="text-sm text-center mt-4">
						Pas de compte ?{" "}
						<Link to="/register" className="link link-primary">
							Créer un compte
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
