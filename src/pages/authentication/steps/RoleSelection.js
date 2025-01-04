import React, { useState, useEffect } from 'react';
import { Box, Radio, FormControlLabel } from '@mui/material';

function RoleSelection({ selectedRole, onRoleSelect, showError }) {
    const [role, setRole] = useState(selectedRole);

    useEffect(() => {
        setRole(selectedRole);
    }, [selectedRole]);

    const handleRoleChange = (event) => {
        setRole(event.target.value);
        onRoleSelect(event.target.value);
    };

    return (
        <>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Which role do you belong to?</p>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    width: { xs: '95%', sm: '80%', md: '60%' },
                    padding: '1rem',
                    borderRadius: '1rem',
                    margin: '0 auto',
                }}
            >
                <Box
                    onClick={() => {
                        setRole('parent');
                        onRoleSelect('parent');
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <FormControlLabel
                        value="parent"
                        control={<Radio checked={role === 'parent'} onChange={handleRoleChange} sx={{ transform: 'scale(1.5)', color: role === 'parent' ? 'var(--clr-white)' : 'var(--clr-grey)' }} />}
                        sx={{ marginRight: '1rem' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: showError && !role ? 'var(--clr-error-lighter)' : role === 'parent' ? 'var(--clr-blue)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: 1,
                            width: '100%',
                            height: 'auto',
                            boxShadow: role === 'parent' ? '6' : '0'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: role === 'parent' ? 'var(--clr-white)' : 'var(--clr-black)' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Γονέας</p>
                            <p style={{
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                marginTop: '0.5rem',
                                wordWrap: 'break-word'
                            }}>
                                Απαλλαγείτε από το άγχος, αφήνοντας τα παιδιά σας σε ασφαλή χέρια! Βρείτε την ιδανική νταντά, δείτε τις αιτήσεις σας και κλείστε ραντεβού γνωριμίας εύκολα μέσα από την πλατφόρμα.
                            </p>
                        </Box>
                    </Box>
                </Box>
                <Box
                    onClick={() => {
                        setRole('nanny');
                        onRoleSelect('nanny');
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <FormControlLabel
                        value="nanny"
                        control={<Radio checked={role === 'nanny'} onChange={handleRoleChange} sx={{ transform: 'scale(1.5)', color: role === 'nanny' ? 'var(--clr-white)' : 'var(--clr-grey)' }} />}
                        sx={{ marginRight: '1rem' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: showError && !role ? 'var(--clr-error-lighter)' : role === 'nanny' ? 'var(--clr-blue)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: 1,
                            width: '100%',
                            height: 'auto',
                            boxShadow: role === 'nanny' ? '6' : '0'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: role === 'nanny' ? 'var(--clr-white)' : 'var(--clr-black)' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Νταντά</p>
                            <p style={{
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                marginTop: '0.5rem',
                                wordWrap: 'break-word'
                            }}>
                                Ψάχνετε ευκαιρίες να προσφέρετε τις υπηρεσίες σας; Εγγραφείτε, δημιουργήστε προφίλ και ξεκινήστε αξιόπιστες συνεργασίες με γονείς που σας χρειάζονται!
                            </p>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default RoleSelection;