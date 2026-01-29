import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi, meApi } from "../../api/auth";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: any) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("access");
		if (token) me();
	}, []);

	const me = async () => {
		const res = await meApi();
		setUser(res.data);
	};

	const login = async (email: string, password: string) => {
		const res = await loginApi({ email, password });

		localStorage.setItem("access", res.data.access);
		localStorage.setItem("refresh", res.data.refresh);

		setUser(res.data.user);
	};

	const register = async (data: any) => {
		const res = await registerApi(data);

		localStorage.setItem("access", res.data.access);
		localStorage.setItem("refresh", res.data.refresh);

		setUser(res.data.user);
	};

	const logout = () => {
		localStorage.clear();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
