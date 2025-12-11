import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null); // State to manage user login status
  const [emailsInfo, setEmailsInfo] = useState<any[]>([])

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    // You would typically send this credential to your backend for verification
    setUser(credentialResponse as any);
    handleCredentialResponse(credentialResponse);
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
          fetch("http://localhost:3001/api/google-exchange-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: resp.code }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Access Token From Backend:", data);
              handleCredentialResponse(data.access_token)
            });
        },
      });
  
      client.requestCode(); // <-- THIS TRIGGERS GOOGLE OAUTH WINDOW
    };

  function handleCredentialResponse(response: CredentialResponse) {
    fetch("http://localhost:3001/api/get-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: response })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setEmailsInfo(data)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <GoogleOAuthProvider clientId="724865480976-f4qa63rdg29blru9nkk7retv57ghmp7t.apps.googleusercontent.com"> {/* Replace with your actual Client ID */}
      <>
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

      <button onClick={handleLogin}>
        Login with Google
      </button>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>

        {
          emailsInfo.length && emailsInfo.map(email => {
            <div>
              {email?.parts[0]?.body?.subject[0]}
            </div>
          })
        }
      </>
    </GoogleOAuthProvider>
  )
}

export default App
