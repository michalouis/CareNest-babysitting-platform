import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import FilterBox from '../../components/FilterBox';
import GenericContainer from '../../components/GenericContainer';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TodayIcon from '@mui/icons-material/Today';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';

// filter options
const checkboxOptions = [
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" }
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// PartnershipItem component
function PartnershipItem({ partnership, userData }) {
    const navigate = useNavigate();

    // show partnership info
    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/partnerships/view-partnership/${partnership.partnershipId}`)}>
                <CardContent>
                    {/* status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Status:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: partnership.active ? 'var(--clr-darker-green)' : 'var(--clr-grey)',
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {partnership.active ? 'Active' : 'Completed'}
                        </h2>
                    </Box>
                    {/* partner name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <h2 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                            {userData.role === 'parent' ? 'Nanny: ' : 'Parent: '}
                        </h2>
                        <p style={{ fontSize: '1.3rem' }}>
                            {userData.role === 'parent' ? partnership.nannyName : partnership.parentName}
                        </p>
                    </Box>
                    {/* Duration */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>From: </p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[partnership.fromDate.month]} ${partnership.fromDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InsertInvitationIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>Until: </p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[partnership.toDate.month]} ${partnership.toDate.year}`}</p>
                    </Box>
                    {/* timestamp */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <ReceiptLongIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Issued Date: </strong> {new Date(partnership.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function Partnerships() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const [filters, setFilters] = useState({
        active: true,
        completed: true,
        fromDate: {
            day: '',
            month: '',
            year: ''
        },
        toDate: {
            day: '',
            month: '',
            year: ''
        },
        newerFirst: true,
    });
    const [partnerships, setPartnerships] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch partnerships
    useEffect(() => {
        const fetchPartnerships = async () => {
            try {
                setLoading(true);
                const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const partnershipIds = userData.partnerships || [];
                    const partnershipsData = [];

                    // fetch user's partnerships
                    for (const partnershipId of partnershipIds) {
                        const partnershipDocRef = doc(FIREBASE_DB, 'partnerships', partnershipId);
                        const partnershipDoc = await getDoc(partnershipDocRef);
                        if (partnershipDoc.exists()) {
                            const partnershipData = partnershipDoc.data();
                            if (partnershipData.nannyId === userData.uid || partnershipData.parentId === userData.uid) {
                                partnershipsData.push(partnershipData);
                            }
                        } else {
                            console.log('No such partnership:', partnershipId);
                        }
                    }

                    // filter partnerships
                    const filteredPartnerships = partnershipsData.filter(partnership => {
                        const partnershipDate = new Date(partnership.timestamp);
                        const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                        const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);

                        // check if partnership is within date range
                        const isWithinDateRange = (!filters.fromDate.year || partnershipDate >= fromDate) &&
                                                  (!filters.toDate.year || partnershipDate <= toDate);

                        // check if partnership status matches filter
                        let isStatusMatch = false;
                        isStatusMatch = (filters.active && partnership.active) ||
                                        (filters.completed && !partnership.active);

                        return isWithinDateRange && isStatusMatch;
                    });

                    const sortedPartnerships = filteredPartnerships.sort((a, b) => {
                        const dateA = new Date(a.timestamp);
                        const dateB = new Date(b.timestamp);
                        return filters.newerFirst ? dateB - dateA : dateA - dateB;
                    });

                    setPartnerships(sortedPartnerships);
                } else {
                    console.error('No such user:', userData.uid);
                }
            } catch (error) {
                console.error("Error fetching partnerships:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchPartnerships();
        }
    }, [userData, filters]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {userData && (
                <>
                    <PageTitle title="CareNest - Partnerships" />
                    <Breadcrumbs />
                    <h1 style={{ marginLeft: '1rem' }}>Partnerships</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                        Here you can find your active partnership or review a previous one.
                    </p>
                    
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flexWrap: { xs: 'nowrap', md: 'wrap' },
                        justifyContent: 'space-between',
                        gap: '1rem',
                        margin: '1rem'
                    }}>
                        <FilterBox
                            filters={filters}
                            setFilters={setFilters}
                            checkboxOptions={checkboxOptions}
                        />
                        {/* Container to show results in pages */}
                        <GenericContainer userData={userData} items={partnerships} itemFunction={(item) => <PartnershipItem partnership={item} userData={userData} />} loading={loading} />
                    </Box>
                </>
            )}
        </>
    );
}

export default Partnerships;