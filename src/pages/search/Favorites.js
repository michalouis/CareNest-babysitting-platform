import React, { useState, useEffect } from 'react';
import { Box, Pagination, Skeleton } from '@mui/material';
import Breadcrumbs from '../../layout/Breadcrumbs';
import PageTitle from '../../PageTitle';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { ResultsItem } from './ResultsComponents';
import { onAuthStateChanged } from 'firebase/auth';

export default function Favorites() {
    const { isLoading } = AuthCheck(true, false, false, 'parent');
    const [favorites, setFavorites] = useState([]);
    const [favoritesUID, setFavoritesUID] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const favoriteIds = userData.favorites || [];
                        setFavoritesUID(favoriteIds);

                        // Fetch favorite nannies' data
                        const favoriteNannies = await Promise.all(
                            favoriteIds.map(async (id) => {
                                const nannyDoc = await getDoc(doc(FIREBASE_DB, 'users', id));
                                if (nannyDoc.exists()) {
                                    return { id, ...nannyDoc.data() };
                                } else {
                                    console.error('No such nanny:', id);
                                    return null;
                                }
                            })
                        );

                        setFavorites(favoriteNannies.filter(nanny => nanny !== null));
                    } else {
                        console.log("User document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching favorites:", error.message, error.stack);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("No user is currently logged in.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Favorites:", favorites);
    }, [favorites]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedFavorites = favorites.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(favorites.length / itemsPerPage);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Αγαπημένα" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αγαπημένα</h1>
            <Box sx={{ flexGrow: 1, margin: '1rem', display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                {loading ? (
                    // Create skeleton items while loading
                    Array.from(new Array(itemsPerPage)).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width="100%" height={130} />
                    ))
                ) : (
                    paginatedFavorites.length > 0 ? (
                        // Display the favorites
                        paginatedFavorites.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <ResultsItem item={item} favorites={favoritesUID} setFavorites={setFavoritesUID} />
                            </Box>
                        ))
                    ) : (
                        // Display no favorites message
                        <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Δεν έχετε προσθέσει αγαπημένα!
                            </p>
                        </Box>
                    )
                )}
                {/* Pagination */}
                {!loading && paginatedFavorites.length > 0 && (
                    // Pagination component is inside grid, so use gridColumn to span the entire row
                    <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <Pagination count={totalPages} page={page} onChange={handleChange} />
                    </Box>
                )}
            </Box>
        </>
    );
}