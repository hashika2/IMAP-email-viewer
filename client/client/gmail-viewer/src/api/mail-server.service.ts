import { type CredentialResponse } from '@react-oauth/google';


export const getGoogleExchangeCode = async (resp: any): Promise<any> => {
    return fetch("http://localhost:3001/api/google-exchange-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: resp.code }),
    })
}

export const getUserEmails = async (response: CredentialResponse): Promise<any> => {
    return fetch("http://localhost:3001/api/get-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: response })
      })
}
