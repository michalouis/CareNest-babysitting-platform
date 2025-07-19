import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebase';

// Check if the user is authenticated/authenticated + return user data
// loginRequired: Redirect to login page if user is not authenticated
// logoutRequired: Redirect to home page if user is authenticated and the page is for logged out users
// createProfilePage: Redirect to create profile page if user is authenticated and profile is not created
// role: Redirect to 404 page if user role is not the same as the role passed

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
                        navigate('/CareNest-babysitting-platform/create-profile');
                    } else if (createProfilePage) {
                        navigate('/CareNest-babysitting-platform');
                    } else if (loginRequired) {
                        if (role && data.role !== role) {
                            navigate('/CareNest-babysitting-platform/error404');
                        }
                    }
                }
            } else {
                setUserData(null);
                if (loginRequired) {
                    navigate('/CareNest-babysitting-platform/login');
                }
            }

            if (logoutRequired && user) {
                navigate('/CareNest-babysitting-platform');
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [loginRequired, logoutRequired, createProfilePage, role, navigate]);

    return { userData, isLoading };
}