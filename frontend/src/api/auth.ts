import { api } from "./axios";

export const loginApi = (data: { email: string; password: string }) =>
	api.post("api/accounts/login/", data);

export const registerApi = (data: {
	email: string;
	username: string;
	password: string;
	agency_name: string;
}) => api.post("api/accounts/register/", data);

export const meApi = () => api.get("api/accounts/me/");
