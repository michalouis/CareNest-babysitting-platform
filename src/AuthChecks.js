import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebase';

// Redirect the user to the profile creation page if the profile is not created
export function useFinishProfileRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (!userData.profileCreated) {
                        navigate('/create-profile');
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);
}

// Redirect the user to the 404 page if the profile is already created
export function useProfileExistsRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.profileCreated) {
                        navigate('/error404');
                    }
                }
            } else {
                navigate('/error404');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
}

// Redirect the user to the login page if they are not logged in
export function useLoginRequiredRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (!user) {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
}

// Redirect the user to the home page if they are already logged in
export function useAlreadyLoggedInRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
}