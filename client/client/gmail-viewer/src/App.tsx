import './App.css'
import { Route, Routes } from 'react-router-dom';
import UserEmail from './pages/user-email';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './pages/google-auth';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <div>
        <Routes>
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/user" element={< UserEmail/>} />
          {/* </Route> */}
          <Route path="/" element={<GoogleAuth />} />
        </Routes>
      </div>
      <ToastContainer />
    </GoogleOAuthProvider>
  )
}

export default App
