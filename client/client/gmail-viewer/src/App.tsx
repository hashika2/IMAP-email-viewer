import './App.css'
import { Route, Routes } from 'react-router-dom';
import UserEmail from './pages/user-email';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './pages/google-auth';

function App() {

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE"> {/* Replace with your actual Client ID */}
      <div>
        <Routes>
          <Route path="/" element={<GoogleAuth />} />
          <Route path="/user" element={< UserEmail/>} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
