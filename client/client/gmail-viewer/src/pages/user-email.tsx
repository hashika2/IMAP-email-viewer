import './user-email.css'
import { type CredentialResponse } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { getUserEmails } from '../api/mail-server.service';
import EmailaViewer from '../components/EmailViewer';
import { getAccessToken, removeAccessToken } from '../session/store-data';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserEmail = () => {
    const [emailsInfo, setEmailsInfo] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery,setSearchQuery] = useState("");
    const [emailsPerPage] = useState(10);

    const navigate = useNavigate();

    // Get current emails for pagination
    const indexOfLastEmail = currentPage * emailsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
    const currentEmails = emailsInfo.slice(indexOfFirstEmail, indexOfLastEmail);


    useEffect(() => {
        const access_token = getAccessToken()
        handleCredentialResponse(access_token as CredentialResponse)
    }, [])

    function handleCredentialResponse(response: CredentialResponse) {
        getUserEmails(response)
            .then(response => response.json())
            .then(data => {
                console.log(data?.emails);
                setEmailsInfo(data.emails)
            })
            .catch(() => {
                toast("Failed to fetch the emails", {
                    type:"error"
                })
            });
    }

    const handleLogout = () => {
        removeAccessToken();
        navigate('/');
    };

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="user-email-container">
            {/* <button className='login-button' onClick={handleLogout}>
                Logout
            </button> */}
            <div className="w-full max-w-sm min-w-[200px]">
                <div className="relative">
                    <input
                    className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="UI Kits, Dashboards..." 
                    />
                </div>
            </div>
            {currentEmails.length === 0 && <div className="loading-text">Loading ....</div>}
            <div className="email-list-container">
                {
                    currentEmails.length > 0 && currentEmails.map((email, index) => (
                        <div key={index} className='email-item'>
                            <EmailaViewer email={email} />
                        </div>
                    ))
                }
            </div>

            {emailsInfo.length > 0 && <nav className="pagination-container" aria-label="Page navigation example">
                <ul className="flex -space-x-px text-sm">
                    <li>
                        <a href="#" className="pagination-link" onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}>
                            <span className="sr-only">Previous</span>
                            <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" /></svg>
                        </a>
                    </li>
                    {Array.from({ length: Math.ceil(emailsInfo.length / emailsPerPage) }, (_, i) => (
                        <li key={i}>
                            <a onClick={() => paginate(i + 1)} href="#" className={`pagination-link ${currentPage === i + 1 ? 'active' : ''}`}>
                                {i + 1}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#" className="pagination-link" onClick={() => paginate(currentPage < Math.ceil(emailsInfo.length / emailsPerPage) ? currentPage + 1 : currentPage)}>
                            <span className="sr-only">Next</span>
                            <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                        </a>
                    </li>
                </ul>
            </nav>}

        </div>
    );
}

export default UserEmail;