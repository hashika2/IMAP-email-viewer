import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { getGoogleExchangeCode } from '../api/mail-server.service';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../session/store-data';

const GoogleAuth = () => {
    const [count, setCount] = useState(0)
    const [user, setUser] = useState(null); // State to manage user login status

    const navigate = useNavigate()
    const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse);
        // You would typically send this credential to your backend for verification
        setUser(credentialResponse as any);
    };

    const handleLoginError = () => {
        console.log('Login Failed');
    };

    const handleLogin = () => {
        const client = window.google.accounts.oauth2.initCodeClient({
            client_id: "724865480976-f4qa63rdg29blru9nkk7retv57ghmp7t.apps.googleusercontent.com",
            scope: "https://mail.google.com/",
            ux_mode: "popup",
            callback: (resp: any) => {
                console.log("AUTH CODE:", resp.code);

                // send the code to backend for token exchange
                getGoogleExchangeCode(resp)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Access Token From Backend:", data);
                        navigate('/user')
                        setAccessToken(data.access_token)
                    });
            },
        });

        client.requestCode(); // <-- THIS TRIGGERS GOOGLE OAUTH WINDOW
    };

    return <>
        <div>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>

        {user ? (
            <div>
                <h2>Welcome!</h2>
                <p>You are logged in.</p>
                {/* Display user information here if available */}
            </div>
        ) : (
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
            />
        )}

        {!user && <button onClick={handleLogin}>
            Login with Google
        </button>}

        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </>
}

export default GoogleAuth;