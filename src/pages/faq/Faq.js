import React, { useState } from 'react';
import { Box } from '@mui/material';
import Breadcrumbs from '../../layout/Breadcrumbs';
import FaqTab from './FaqTab';
import FaqItem from './FaqItem';
import './faq.css';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

// Faq component
export default function Faq() {
    const { isLoading } = AuthCheck();
    const [selectedTab, setSelectedTab] = useState(0);

    if (isLoading) {
        return <Loading />;
    }

    const handleTabChange = (newValue) => {
        setSelectedTab(newValue);
    };

    // FAQs
    const faqParents = [
        { question: "What are the eligibility criteria?", answer: "Access to the platform's services depends on income and family status. If you meet the eligibility criteria, you will be able to use the platform to find and collaborate with nannies who meet your needs." },
        { question: "What process should I follow?", answer: "First, you need to search for a nanny based on your needs and selected criteria (e.g., schedules, experience). Then, you should arrange a meet-and-greet appointment, which can be done either in person or online. Once you find a nanny that suits you, you need to create and send a request. After signing the agreement, the collaboration will begin and will last for the agreed month." },
        { question: "What do I do at the end of the collaboration?", answer: "At the end of the collaboration, you need to go to your 'current collaboration' and complete it. This way, the nanny will be able to get paid, and you will have the opportunity to start a new collaboration with another nanny if you wish. Don’t forget to leave a review about your experience with the nanny!" },
        { question: "What features does the platform provide?", answer: "The platform provides a large network of nannies that you can choose from for part-time or full-time employment to take care of your children safely. Whether it is for daily care or special needs, the platform ensures a safe and flexible experience for parents." }
    ];
    
    const faqNannies = [
        { question: "What are the eligibility criteria?", answer: "The platform is open to anyone with experience in childcare or a related degree. The most important thing is to have a passion for the job and love what you do, so you can provide quality care for children." },
        { question: "What process should I follow?", answer: "Start by creating your profile and then post your advertisement for the services you offer. When parents are interested, they will send you a request for a meet-and-greet appointment, which you can accept or decline. Once you agree to collaborate, the parent will send you the cooperation agreement, which you sign to start your collaboration." },
        { question: "What do I do at the end of the collaboration?", answer: "After the collaboration is completed by the parent, you need to confirm that you have received your payment voucher through the platform. Once this is done, you can proceed with new collaborations with other parents interested in your services." },
        { question: "What features does the platform provide?", answer: "The platform allows you to showcase your profile to hundreds of parents, manage collaboration requests, communicate with parents, and organize your schedule easily. It also provides tools for securely signing agreements and ensuring your payments." }
    ];    

    const faqs = selectedTab === 0 ? faqParents : faqNannies;

    return (
        <>  
            <PageTitle title="CareNest - FAQs" />
            <Breadcrumbs />
            <Box className='faq-container' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Frequently Asked Questions (FAQs)</h1>
                <FaqTab onTabChange={handleTabChange} />
                <Box sx={{ width: '80%', maxWidth: '800px', marginTop: '2rem' }}>
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} /> // pass question and answer as props, based on selected tab
                    ))}
                </Box>
            </Box>
        </>
    );
}