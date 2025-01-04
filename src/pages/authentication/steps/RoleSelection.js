import React, { useState } from 'react';
import { Box, Radio, FormControlLabel } from '@mui/material';

function RoleSelection({ onRoleSelect }) {
    const [selectedRole, setSelectedRole] = useState('');

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        onRoleSelect(true); // Notify parent component that a role is selected
    };

    return (
        <>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Which role do you belong to?</p>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
                <Box
                    onClick={() => {
                        setSelectedRole('parent');
                        onRoleSelect(true);
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: '95%', sm: '80%', md: '60%' },
                        cursor: 'pointer',
                    }}
                >
                    <FormControlLabel
                        value="parent"
                        control={<Radio checked={selectedRole === 'parent'} onChange={handleRoleChange} sx={{ transform: 'scale(1.5)', color: selectedRole === 'parent' ? 'var(--clr-white)' : 'var(--clr-grey)' }} />}
                        sx={{ marginRight: '1rem' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: selectedRole === 'parent' ? 'var(--clr-blue)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: 1,
                            width: '100%',
                            height: 'auto',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: selectedRole === 'parent' ? 'var(--clr-white)' : 'var(--clr-black)' }}>
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
                        setSelectedRole('nanny');
                        onRoleSelect(true);
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: '95%', sm: '80%', md: '60%' },
                        cursor: 'pointer',
                    }}
                >
                    <FormControlLabel
                        value="nanny"
                        control={<Radio checked={selectedRole === 'nanny'} onChange={handleRoleChange} sx={{ transform: 'scale(1.5)', color: selectedRole === 'nanny' ? 'var(--clr-white)' : 'var(--clr-grey)' }} />}
                        sx={{ marginRight: '1rem' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: selectedRole === 'nanny' ? 'var(--clr-blue)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: 1,
                            width: '100%',
                            height: 'auto',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: selectedRole === 'nanny' ? 'var(--clr-white)' : 'var(--clr-black)' }}>
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