import React from 'react';
import { Box, TextField, Button } from '@mui/material';

import FileIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GradeIcon from '@mui/icons-material/Grade';

// translate data to greek
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

// Render the profile picture, name & score of nanny
export const ProfileOverview = (userData) => (
    <>
        <Box sx={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '2',
        }}>
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {/* Profile Pic */}
                <AccountCircleIcon style={{ fontSize: '7rem' }} />
                {userData.score && (    // if user is a nanny, display score
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--clr-gold)',
                        marginLeft: '1rem',
                    }}>
                        <GradeIcon sx={{ fontSize: '2.5rem', marginRight: '0.5rem' }} />
                        <p className='big-button-text-gold'>{userData.score}</p>
                    </Box>
                )}
            </Box>
            {/* Name */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '1rem',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', wordBreak: 'break-word' }}>
                    {userData.firstName} {userData.lastName}
                </p>
            </Box>
        </Box>
    </>
);

// data common to parents/nannies
export function renderCommonData(userData) {
    return (
        <>
            {/* Personal Data */}
            <h2>Προσωπικά Στοιχεία</h2>
            <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                <TextField
                    label="Φύλο"
                    value={
                        userData.gender === 'Male' ? 'Άντρας' :
                        userData.gender === 'Female' ? 'Γυναίκα' :
                        userData.gender === 'Other' ? 'Άλλο' :
                        ''
                    }
                    slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                    fullWidth
                    variant="outlined"
                />
                <TextField label="Ηλικία" value={userData.age} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Ρόλος" value={userData.role === 'parent' ? 'Γονέας' : 'Νταντά'} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="ΑΜΚΑ" value={userData.amka} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            </Box>

            {/* Contact Data */}
            <h2>Στοιχεία Επικοινωνίας</h2>
            <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                <TextField label="Διεύθυνση" value={userData.address} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Ταχυδρομικός Κώδικας" value={userData.postalCode} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Πόλη" value={userData.town} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Τηλέφωνο" value={userData.phoneNumber} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Email" value={userData.email} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            </Box>

            <h2>Σχετικά με μένα</h2>
            <TextField label="Σχετικά με μένα" value={userData.aboutMe} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" multiline rows={4} sx={{ maxHeight: '150px'}}/>
        </>
    );
}

// data common to parents/nannies (excluding sensitive data - AMKA, address, postal code, phone number)
export function renderNonSensitiveCommonData(userData) {
    return (
        <>
            {/* Personal Data */}
            <h2>Πληροφορίες</h2>
            <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                <TextField
                    label="Φύλο"
                    value={
                        userData.gender === 'Male' ? 'Άντρας' :
                        userData.gender === 'Female' ? 'Γυναίκα' :
                        userData.gender === 'Other' ? 'Άλλο' :
                        ''
                    }
                    slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                    fullWidth
                    variant="outlined"
                />
                <TextField label="Ηλικία" value={userData.age} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Ρόλος" value={userData.role === 'parent' ? 'Γονέας' : 'Νταντά'} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField label="Πόλη" value={userData.town} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            </Box>

            <h2>Σχετικά με μένα</h2>
            <TextField label="Σχετικά με μένα" value={userData.aboutMe} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" multiline rows={4} />
        </>
    );
}

// data exclusive to parents (child data)
export function renderParentData(userData) {
    return (
        <>
            <h2>Στοιχεία Παιδιού</h2>
            <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 1.5, width: '100%' }}>
                <TextField label="Όνομα Παιδιού" value={userData.childName} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
                <TextField
                    label="Φύλο Παιδιού"
                    value={
                        userData.childGender === 'Male' ? 'Αγόρι' :
                        userData.childGender === 'Female' ? 'Κορίτσι' :
                        userData.childGender === 'Other' ? 'Άλλο' :
                        ''
                    }
                    slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                    fullWidth
                    variant="outlined"
                />
                <TextField label="Ηλικιακή Ομάδα Παιδιού" value={userData.childAgeGroup} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            </Box>
        </>
    );
}

// data exclusive to nannies (experience, degrees, certificates, recommendations, skills)
export function renderNannyData(userData) {
    return (
        <>
            <h2>Εμπειρία</h2>
            <TextField
                label="Εμπειρία"
                value={`${userData.experience} μήνες`}
                slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                fullWidth
                variant="outlined"
            />

            <h2>Σπουδές</h2>
            {userData.degrees.length === 0 ? (
                <p style={{ color: 'var(--clr-grey)', fontSize: '1.25rem' }}>
                    Δεν υπάρχουν Σπουδές
                </p>
            ) : (
                userData.degrees.map((degree, index) => (
                    <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                            <strong>{index + 1}. {translateMap[degree.degreeLevel]}:</strong> {degree.degreeTitle}
                        </p>
                        <Button
                            variant="contained"
                            startIcon={<FileIcon />}
                            sx={{ backgroundColor: 'var(--clr-violet)' }}
                        >
                            <p className="smaller-button-text">{degree.degreeFile}</p>
                        </Button>
                    </Box>
                ))
            )}

            <h2>Πιστοποιητικά</h2>
            {userData.certificates.length === 0 ? (
                <p style={{ color: 'var(--clr-grey)', fontSize: '1.25rem' }}>
                    Δεν υπάρχουν Πιστοποιητικά
                </p>
            ) : (
                userData.certificates.map((certificate, index) => (
                    <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                            <strong>{index + 1}. {certificate.certificateTitle}: </strong>
                        </p>
                        <Button
                            variant="contained"
                            startIcon={<FileIcon />}
                            sx={{ backgroundColor: 'var(--clr-violet)' }}
                        >
                            <p className="smaller-button-text">{certificate.certificateFile}</p>
                        </Button>
                    </Box>
                ))
            )}

            <h2>Συστάσεις</h2>
            {userData.recommendations.length === 0 ? (
                <p style={{ color: 'var(--clr-grey)', fontSize: '1.25rem' }}>
                    Δεν υπάρχουν Συστάσεις
                </p>
            ) : (
                userData.recommendations.map((recommendation, index) => (
                    <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                            <strong>{index + 1}. {recommendation.recommendationTitle}: </strong>
                        </p>
                        <Button
                            variant="contained"
                            startIcon={<FileIcon />}
                            sx={{ backgroundColor: 'var(--clr-violet)' }}
                        >
                            <p className="smaller-button-text">{recommendation.recommendationFile}</p>
                        </Button>
                    </Box>
                ))
            )}

            <h2>Δεξιότητες</h2>
            {Object.values(userData.languages).every(value => !value) && Object.values(userData.music).every(value => !value) ? (
                <p style={{ color: 'var(--clr-grey)', fontSize: '1.25rem' }}>
                    Δεν υπάρχουν Δεξιότητες
                </p>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                    {Object.entries(userData.languages).map(([language, value]) => (
                        value && (
                            <Box
                                key={language}
                                sx={{
                                    backgroundColor: 'var(--clr-violet)',
                                    color: 'white',
                                    padding: '1rem',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '20px'
                                }}
                            >
                                <p className="button-text">
                                    {translateMap[language]}
                                </p>
                            </Box>
                        )
                    ))}
                    {Object.entries(userData.music).map(([music, value]) => (
                        value && (
                            <Box
                                key={music}
                                sx={{
                                    backgroundColor: 'var(--clr-violet)',
                                    color: 'white',
                                    padding: '1rem',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '20px'
                                }}
                            >
                                <p className="button-text">
                                    {translateMap[music]}
                                </p>
                            </Box>
                        )
                    ))}
                </Box>
            )}
        </>
    );
}