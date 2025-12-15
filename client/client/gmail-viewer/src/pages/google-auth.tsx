import { getGoogleExchangeCode } from '../api/mail-server.service';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../session/store-data';
import { toast } from 'react-toastify';
import './google-auth.css'; // We'll create this file for styling

const GoogleAuth = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        const client = window.google.accounts.oauth2.initCodeClient({
            client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
            scope: "https://mail.google.com/",
            ux_mode: "popup",
            callback: (resp: any) => {
                console.log("AUTH CODE:", resp.code);

                // send the code to backend for token exchange
                getGoogleExchangeCode(resp)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Access Token From Backend:", data);
                        setAccessToken(data.access_token);
                        navigate('/user');
                    }).catch((() => {
                        toast("Access token getting error", {
                            type:"error"
                        });
                    }));
            },
        });

        client.requestCode(); // <-- THIS TRIGGERS GOOGLE OAUTH WINDOW
    };

    return (
        <div className="google-auth-container">
            <div className="google-takeout-title">
                <span className="google-word">Google</span>
                <span className="takeout-word">Takeout</span>
            </div>
            <div className="gmail-viewer-banner">
                Gmail Email Viewer
            </div>
            <button className='login-button' onClick={handleLogin}>
                Login with Google
            </button>
        </div>
    );
}

export default GoogleAuth;