import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { getGoogleExchangeCode } from '../api/mail-server.service';
import { useNavigate } from 'react-router-dom';
import { setAccessToken, getAccessToken } from '../session/store-data';
import { toast } from 'react-toastify';

const GoogleAuth = () => {
    const navigate = useNavigate()

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
                        setAccessToken(data.access_token)
                        navigate('/user')
                    }).catch((error => {
                        toast("Access token getting error", {
                            type:"error"
                        })
                    }));
            },
        });

        client.requestCode(); // <-- THIS TRIGGERS GOOGLE OAUTH WINDOW
    };

    return <>
        <div className='flex'>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
        <h1>IMAP Gmail Viewer</h1>

        <button className='border' onClick={handleLogin}>
            Login with Google
        </button>
    </>
}

export default GoogleAuth;