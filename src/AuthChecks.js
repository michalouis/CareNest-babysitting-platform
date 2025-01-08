import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebase';

export function useAuthCheck(loginRequired = false, logoutRequired = false, createProfilePage = false, role = '') {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);

                    if (!data.profileCreated) {
                        navigate('/create-profile');
                    } else if (createProfilePage) {
                        navigate('/');
                    } else if (loginRequired) {
                        if (role && data.role !== role) {
                            navigate('/error404');
                        }
                    }
                }
            } else {
                setUserData(null);
                if (loginRequired) {
                    navigate('/login');
                }
            }

            if (logoutRequired && user) {
                navigate('/');
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [loginRequired, logoutRequired, createProfilePage, role, navigate]);

    return { userData, isLoading };
}