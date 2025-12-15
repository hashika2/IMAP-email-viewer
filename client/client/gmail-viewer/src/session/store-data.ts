import { useState, useEffect } from 'react';

export const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
};

export const useAuth = () => {
    const [accessToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        setAuthToken(token);

        const handleStorageChange = () => {
            setAuthToken(getAccessToken());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { accessToken, setAccessToken: setAuthToken };
};
