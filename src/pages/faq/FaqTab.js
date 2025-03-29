import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import './faq.css';

// FAQ tab to change from parents to nannies FAQs
function FaqTab({ onTabChange }) {
    const [selectedTab, setSelectedTab] = useState(0);

    // Function to handle tab change
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
        onTabChange(newValue);
    };

    return (
        <Box sx={{
            width: 'auto',
            marginTop: '1rem',
            padding: '10px',
            backgroundColor: 'var(--clr-white)',
            boxShadow: 2,
            borderRadius: '10px'
        }}>
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                centered
                TabIndicatorProps={{ style: { display: 'none' } }}  // remove default indicator styling
            >
                <Tab
                    label="Parents"
                    className="faq-tab"
                    sx={{
                        backgroundColor: selectedTab === 0 ? 'var(--clr-light-grey)' : 'transparent',
                        borderRadius: '4px',
                        color: 'var(--clr-black)',
                        margin: '10px',
                        fontWeight: '600',
                        fontSize: 'large',
                        '&.Mui-selected': {
                            color: 'var(--clr-black)',
                        },
                        '&:hover': {
                            outline: selectedTab === 0 ? 'none' : '2px solid var(--clr-light-grey)',
                        },
                    }}
                />
                <Tab
                    label="Nannies"
                    className="faq-tab"
                    sx={{
                        backgroundColor: selectedTab === 1 ? 'var(--clr-light-grey)' : 'transparent',
                        borderRadius: '4px',
                        color: 'var(--clr-black)',
                        margin: '10px',
                        fontWeight: '600',
                        fontSize: 'large',
                        '&.Mui-selected': {
                            color: 'var(--clr-black)',
                        },
                        '&:hover': {
                            outline: selectedTab === 1 ? 'none' : '2px solid var(--clr-light-grey)',
                        },
                    }}
                />
            </Tabs>
        </Box>
    );
}

export default FaqTab;