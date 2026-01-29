import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RegisterPage() {
	const { register } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: "",
		username: "",
		password: "",
		agency_name: "",
	});

	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setError("");
			await register(form);
			navigate("/");
		} catch {
			setError("Impossible de créer le compte");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-96 bg-base-100 shadow-xl">
				<div className="card-body">
					<h1 className="text-2xl font-bold text-center">
						Créer un compte
					</h1>

					<form onSubmit={handleSubmit} className="space-y-3">
						<input
							name="agency_name"
							placeholder="Nom de l’agence"
							className="input input-bordered w-full"
							onChange={handleChange}
							required
						/>

						<input
							name="username"
							placeholder="Nom d’utilisateur"
							className="input input-bordered w-full"
							onChange={handleChange}
							required
						/>

						<input
							type="email"
							name="email"
							placeholder="Email"
							className="input input-bordered w-full"
							onChange={handleChange}
							required
						/>

						<input
							type="password"
							name="password"
							placeholder="Mot de passe"
							className="input input-bordered w-full"
							onChange={handleChange}
							required
						/>

						{error && <p className="text-error text-sm">{error}</p>}

						<button className="btn btn-primary w-full">
							Créer mon compte
						</button>
					</form>

					<p className="text-sm text-center mt-4">
						Déjà inscrit ?{" "}
						<Link to="/login" className="link link-primary">
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
