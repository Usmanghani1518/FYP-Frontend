import { API_BASE_URL } from "@/constants/constants";
import { FormEvent } from "react";

export async function backendRequest<SuccessResponse = { success: true }, ErrorResponse = { success: false | undefined, detail: string | object }>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string,
    path: string,
    body?: FormData | object,
    headers: Record<string, string> = {},
    multipart: boolean = false
): Promise<SuccessResponse | ErrorResponse> {
    const url: string = path.startsWith("http://") || path.startsWith("https://") ?
        path :
        ("/api/v1" + path);

    const passableBody: FormData | string = multipart && body instanceof FormData ?
        body :
        JSON.stringify(
            body instanceof FormData ?
                Object.fromEntries(body.entries()) :
                body
        );

    const passableHeaders: Record<string, string> = headers;

    const token = localStorage.getItem("token");
    if (token) passableHeaders["Authorization"] = `Bearer ${token}`;
    if (!multipart) passableHeaders["Content-Type"] = "application/json";

    try {
         const response = await fetch(url, { method, body: passableBody, headers: passableHeaders });
        
        if (!response.ok) {
            const errorResponse = await response.json();
            if (errorResponse.detail === "Could not validate credentials") {
                localStorage.removeItem('token');
                window.location.href = "/login";
            }
            return errorResponse as ErrorResponse;
        }

        return await response.json() as SuccessResponse;
    } catch (error) {
        console.error(error);
        return { success: false, detail: "There was a network error." } as ErrorResponse;
    }
}

export async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { action, method } = e.currentTarget;
    const data = new FormData(e.currentTarget);
    return await backendRequest(method, action, data);
}