import React, { useState, useEffect } from 'react';
import { Box, Radio, FormControlLabel } from '@mui/material';

function RoleSelection({ selectedRole, onRoleSelect, showError }) {
    const [role, setRole] = useState(selectedRole);

    // Update the role when the selected role changes
    useEffect(() => {
        setRole(selectedRole);
    }, [selectedRole]);

    // Handle the role change
    const handleRoleChange = (event) => {
        setRole(event.target.value);
        onRoleSelect(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className='description'>Σε ποια ομάδα ανήκετε;</p>
            <Box
                sx={{
                    width: { xs: '95%', sm: '85%', md: '70%', lg: '60%' },
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1rem 2rem 1rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Parent Role Radio Button (can click box or radio button) */}
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
                    {/* Radio Button */}
                    <FormControlLabel
                        value="parent"
                        control={
                            <Radio checked={role === 'parent'}
                            onChange={handleRoleChange}
                            sx={{
                                transform: 'scale(1.5)',
                                color: role === 'parent' ? 'var(--clr-white)' : 'var(--clr-grey)'
                        }} />}
                    />

                    {/* For box colors */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: showError && !role ? 'var(--clr-error-lighter)' : role === 'parent' ? 'var(--clr-violet)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            width: '100%',
                            height: 'auto',
                            boxShadow: role === 'parent' ? '6' : '0'
                        }}
                    >
                        {/* For text colors */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            color: role === 'parent' ? 'var(--clr-white)' : 'var(--clr-black)'
                        }}>
                            <p className='role-title'>Γονέας</p>
                            <p className='role-description'>
                                Απαλλαγείτε από το άγχος, αφήνοντας τα παιδιά σας σε ασφαλή χέρια!
                                Βρείτε την ιδανική νταντά, δείτε τις αιτήσεις σας και κλείστε
                                ραντεβού γνωριμίας εύκολα μέσα από την πλατφόρμα.
                            </p>
                        </Box>
                    </Box>
                </Box>

                {/* Nanny Role Radio Button (can click box or radio button) */}
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
                    {/* Radio Button */}
                    <FormControlLabel
                        value="nanny"
                        control={
                            <Radio checked={role === 'nanny'}
                            onChange={handleRoleChange}
                            sx={{
                                transform: 'scale(1.5)',
                                color: role === 'nanny' ? 'var(--clr-white)' : 'var(--clr-grey)'
                        }} />}
                    />

                    {/* For box colors */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: showError && !role ? 'var(--clr-error-lighter)' : role === 'nanny' ? 'var(--clr-violet)' : 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            width: '100%',
                            height: 'auto',
                            boxShadow: role === 'nanny' ? '6' : '0'
                        }}
                    >
                        {/* For text colors */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            color: role === 'nanny' ? 'var(--clr-white)' : 'var(--clr-black)'
                        }}>
                            <p className='role-title'>Νταντά</p>
                            <p className='role-description'>
                                Ψάχνετε ευκαιρίες να προσφέρετε τις υπηρεσίες σας;
                                Εγγραφείτε, δημιουργήστε προφίλ και ξεκινήστε αξιόπιστες
                                συνεργασίες με γονείς που σας χρειάζονται!
                            </p>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default RoleSelection;