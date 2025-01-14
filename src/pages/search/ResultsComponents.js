import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardActionArea, CardActions, IconButton, Pagination, Skeleton } from '@mui/material';
import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';

const translateMap = {
    school: 'Απολυτήριο Σχολείου',
    university: 'Πανεπιστήμιο',
    college: 'Κολέγιο',
    tei: 'ΤΕΙ',
    english: 'Αγγλικά',
    german: 'Γερμανικά',
    french: 'Γαλλικά',
    spanish: 'Ισπανικά',
    piano: 'Πιάνο',
    guitar: 'Κιθάρα',
    violin: 'Βιολί',
    flute: 'Φλάουτο'
};

function ResultsItem({ item }) {
    const { firstName, lastName, experience, degrees, languages, music, score } = item;

    const ShowSkills = (languages, music) => {
        const skills = { ...languages, ...music };
        const skillArray = Object.entries(skills)
            .filter(([_, value]) => value)  // Filter out the false values
            .map(([key, _]) => translateMap[key]); // Translate the skill names using translateMap

        return (
            <>
                {skillArray.map((skill, index) => (
                    <Box
                        key={index}
                        sx={{ 
                            display: 'inline-block',
                            backgroundColor: 'var(--clr-violet)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '20px',
                            marginRight: '0.3rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                    }}>
                        <p className='small-button-text'>{skill}</p>
                    </Box>
                ))}
            </>
        );
    };

    const hasSkills = Object.values({ ...languages, ...music }).some(value => value);

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'space-between' },
            height: '100%',
            padding: '0',
        }}>
            <CardActionArea
                // onClick={() => { /* Handle click event */ }}
            >
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }} >
                    {/* Profile Icon & Score */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'column' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem'
                    }}>
                        <AccountCircleIcon sx={{ fontSize: '5rem' }} />
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--clr-gold)',
                            marginTop: { xs: '0.5rem', sm: '0' }
                        }}>
                            <GradeIcon sx={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                            <p className='big-button-text'>{score}</p>
                        </Box>
                    </Box>
                    {/* Info */}
                    <Box sx={{ flex: 1 }}>
                        <p style={{ fontSize: '1.5rem' }}>
                            <b>{firstName} {lastName}</b>
                            <span style={{ color: 'grey' }}><b> | Εμπειρία</b> {experience} μήνες</span>
                        </p>
                        {degrees.length > 0 && (<p style={{ fontSize: '1.5rem' }}><strong>Σπουδές</strong> {degrees[0].degreeTitle}</p>)}
                        {hasSkills && (<p style={{ fontSize: '1.5rem' }}><strong>Δεξιότητες</strong> {ShowSkills(languages, music)}</p>)}
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Favorite Icon */}
            <CardActions sx={{ marginRight: '0.5rem' }} >
                <IconButton
                    // onClick={() => { /* Handle favorite click event */ }}
                    sx={{ justifyItems: 'center' }}
                    >
                    <FavoriteIcon sx={{ fontSize: '3rem' }}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

function ResultsContainer({ filterData }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const jobPostingsSnapshot = await getDocs(collection(FIREBASE_DB, 'jobPostings'));
                const jobPostings = jobPostingsSnapshot.docs.map(doc => {
                    return { id: doc.id, ...doc.data() };
                });
    
                console.log('Filtered Data:', filterData);
                const users = await Promise.all(
                    jobPostings.map(async (jobPosting) => {
                        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', jobPosting.id));
                        if (userDoc.exists()) {
                            console.log('User Data:', userDoc.data()); // Print user data to the console
                            return { ...userDoc.data(), jobPostingData: jobPosting };
                        } else {
                            console.error('No such user:', jobPosting.id);
                            return null;
                        }
                    })
                );
    
                const validUsers = users.filter(user => {
                    if (user === null) return false;
    
                    const { jobPostingData } = user;
    
                    // Check town
                    if (user.town !== filterData.town) return false;
    
                    // Check child age group
                    if (!jobPostingData.ageGroups.includes(filterData.childAgeGroup)) return false;
    
                    // Check work time
                    if (jobPostingData.employmentType !== filterData.workTime) return false;
    
                    // Check babysitting place
                    if (jobPostingData.babysittingPlace !== 'both' && jobPostingData.babysittingPlace !== filterData.babysittingPlace) return false;
    
                    // Check experience by the index of the experienceLevels array
                    const experienceLevels = ['0-6', '6-12', '12-18', '18-24', '24-36', '36+'];
                    const userExperienceIndex = experienceLevels.indexOf(user.experience);
                    const filterExperienceIndex = experienceLevels.indexOf(filterData.experience);
                    if (filterData.experience && userExperienceIndex < filterExperienceIndex) return false;
    
                    // Check degree, some: check if at least one degree matches the filter
                    if (filterData.degree && !user.degrees.some(degree => degree.degreeLevel === filterData.degree)) return false;
    
                    // // Check languages
                    for (const [language, value] of Object.entries(filterData.languages)) {
                        if (value && !user.languages[language]) return false;
                    }
    
                    // // Check music
                    for (const [instrument, value] of Object.entries(filterData.music)) {
                        if (value && !user.music[instrument]) return false;
                    }
    
                    // // Check rating
                    if (user.score < filterData.rating) return false;
    
                    return true;
                });
    
                setResults(validUsers);
                console.log('Result Data:', validUsers); // Print result data to the console
            } catch (error) {
                console.error("Error fetching job postings or user data:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobPostings();
    }, [filterData]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage); // Current results to display on the page
    const totalPages = Math.ceil(results.length / itemsPerPage);

    return (
        <Box sx={{ flexGrow: 1, margin: '1rem', display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
            {loading ? (
                // Create skeleton items while loading
                Array.from(new Array(itemsPerPage)).map((_, index) => (
                    <Skeleton key={index} variant="rectangular" width="100%" height={130} />
                ))
            ) : (
                paginatedResults.length > 0 ? (
                    // Display the results
                    paginatedResults.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <ResultsItem item={item} />
                        </Box>
                    ))
                ) : (
                    // Display no results message
                    <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Δεν βρέθηκαν αποτελέσματα!
                        </p>
                        <p style={{ fontSize: '1rem' }}>
                            Αλλάξτε τα φίλτρα για να εμφανιστούν κάποια αποτελέσματα.
                        </p>
                    </Box>
                )
            )}
            {/* Pagination */}
            {!loading && paginatedResults.length > 0 && (
                // Pagination component is inside grid, so use gridColumn to span the entire row
                <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Pagination count={totalPages} page={page} onChange={handleChange} />
                </Box>
            )}
        </Box>
    );
}

export { ResultsContainer, ResultsItem };