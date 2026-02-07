import { createContext, useContext, useEffect, useState } from "react";

import { loginApi, registerApi, meApi } from "../../api/auth";
import type { ReactNode } from "react";

/* =========================
   Types stricts
========================= */

type User = {
	id: number;
	email: string;
	agency?: number;
	is_agency_admin?: boolean;
};

type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (data: any) => Promise<void>;
	logout: () => void;
};

/* ========================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ========================= */

export function useAuth() {
	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return ctx;
}

/* ========================= */

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	/* -------------------------
     restore session on reload
  ------------------------- */
	useEffect(() => {
		const token = localStorage.getItem("access");

		if (!token) {
			setLoading(false);
			return;
		}

		fetchMe();
	}, []);

	/* ------------------------- */

	const fetchMe = async () => {
		try {
			const res = await meApi();
			setUser(res.data);
		} catch (err: any) {
			// 401 = access expiré → l'interceptor va refresh automatiquement
			if (err.response?.status !== 401) {
				logout(); // vraie erreur uniquement
			}
		} finally {
			setLoading(false);
		}
	};

	/* ------------------------- */

	const login = async (email: string, password: string) => {
		const res = await loginApi({ email, password });

		localStorage.setItem("access", res.data.access);
		localStorage.setItem("refresh", res.data.refresh);

		setUser(res.data.user);
	};

	/* ------------------------- */

	const register = async (data: any) => {
		const res = await registerApi(data);

		localStorage.setItem("access", res.data.access);
		localStorage.setItem("refresh", res.data.refresh);

		setUser(res.data.user);
	};

	/* ------------------------- */

	const logout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		setUser(null);
	};

	/* ------------------------- */

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
