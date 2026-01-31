import { api } from "./axios";

export const loginApi = (data: { email: string; password: string }) =>
	api.post("/accounts/login/", data);

export const registerApi = (data: {
	email: string;
	username: string;
	password: string;
	agency_name: string;
}) => api.post("/accounts/register/", data);

export const meApi = () => api.get("api/accounts/me/");
