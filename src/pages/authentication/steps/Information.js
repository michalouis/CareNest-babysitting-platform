import React, { useState, useEffect } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import FaqItem from '../../faq/FaqItem';

const faqItemsParent = [
    { question: "Question 1 Parent", answer: "Answer 1" },
    { question: "Question 2 Parent", answer: "Answer 2" },
    { question: "Question 3 Parent", answer: "Answer 3" },
    { question: "Question 4 Parent", answer: "Answer 4" }
];

const faqItemsNanny = [
    { question: "Question 1 Nanny", answer: "Answer 1" },
    { question: "Question 2 Nanny", answer: "Answer 2" },
    { question: "Question 3 Nanny", answer: "Answer 3" },
    { question: "Question 4 Nanny", answer: "Answer 4" }
];

function Information({ selectedRole, isInfoRead, onInfoRead, showError }) {
    const [checked, setChecked] = useState(isInfoRead);

    useEffect(() => {
        setChecked(isInfoRead);
    }, [isInfoRead]);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
        onInfoRead(event.target.checked);
    };

    const faqItems = selectedRole === 'parent' ? faqItemsParent : faqItemsNanny;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '80%', maxWidth: '1000px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Insert text here.</p>
                {faqItems.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleCheckboxChange} sx={{ color: showError && !checked ? 'var(--clr-error)' : 'var(--clr-black)' }} />}
                    label="I have read and understood the information"
                    sx={{ marginTop: '2rem', color: showError && !checked ? 'var(--clr-error)' : 'var(--clr-black)' }}
                />
            </Box>
        </Box>
    );
}

export default Information;