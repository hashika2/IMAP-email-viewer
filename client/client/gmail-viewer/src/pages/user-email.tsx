import '../App.css'
import { type CredentialResponse } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { getUserEmails } from '../api/mail-server.service';
import EmailaViewer from '../components/EmailViewer';
import { getAccessToken, removeAccessToken } from '../session/store-data';
import { useNavigate } from 'react-router-dom';

const UserEmail = () => {
    const [emailsInfo, setEmailsInfo] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
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
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleLogout = () => {
        removeAccessToken();
        navigate('/');
    };

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return <>
        {/* <button className='border' onClick={handleLogout}>Logout</button> */}
        {currentEmails.length == 0 && <div>Loading ....</div>}
        {
            currentEmails.length > 0 && currentEmails.map((email, index) => (
                <div key={index} className='text-left'>
                    <EmailaViewer email={email} />
                </div>
            ))
        }

        {emailsInfo.length > 0 && <nav aria-label="Page navigation example">
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
}

export default UserEmail;