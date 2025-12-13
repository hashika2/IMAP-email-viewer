import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { getGoogleExchangeCode, getUserEmails } from '../api/mail-server.service';
import EmailaViewer from './EmailViewer';

const GoogleAuth = ({ email }: any) => {
    const [count, setCount] = useState(0)
  const [user, setUser] = useState(null); // State to manage user login status
  const [emailsInfo, setEmailsInfo] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(10);
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
            getGoogleExchangeCode(resp)
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
        getUserEmails(response)
          .then(response => response.json())
          .then(data => {
            console.log(data?.emails);
            setEmailsInfo(data.emails)
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    
      // Get current emails for pagination
      const indexOfLastEmail = currentPage * emailsPerPage;
      const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
      const currentEmails = emailsInfo.slice(indexOfFirstEmail, indexOfLastEmail);
    
      // Change page
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

      
return <GoogleOAuthProvider clientId="724865480976-f4qa63rdg29blru9nkk7retv57ghmp7t.apps.googleusercontent.com"> {/* Replace with your actual Client ID */}
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

        {!user && <button onClick={handleLogin}>
          Login with Google
        </button>}

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        {
          currentEmails.length > 0 && currentEmails.map((email, index) => (
            <div key={index} className='text-left'>
              <EmailaViewer email={email} />
            </div>
          ))
        }

        { emailsInfo.length > 0 && <nav aria-label="Page navigation example">
          <ul className="flex -space-x-px text-sm">
            <li>
              <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm w-9 h-9 focus:outline-none" onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}>
                <span className="sr-only">Previous</span>
                <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" /></svg>
              </a>
            </li>
            {Array.from({ length: Math.ceil(emailsInfo.length / emailsPerPage) }, (_, i) => (
              <li key={i}>
                <a onClick={() => paginate(i + 1)} href="#" className={`flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-9 h-9 focus:outline-none ${currentPage === i + 1 ? 'bg-neutral-tertiary-medium' : ''}`}>
                  {i + 1}
                </a>
              </li>
            ))}
            <li>
              <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm w-9 h-9 focus:outline-none" onClick={() => paginate(currentPage < Math.ceil(emailsInfo.length / emailsPerPage) ? currentPage + 1 : currentPage)}>
                <span className="sr-only">Next</span>
                <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
              </a>
            </li>
          </ul>
        </nav>}

      </>
    </GoogleOAuthProvider>
}

export default GoogleAuth;