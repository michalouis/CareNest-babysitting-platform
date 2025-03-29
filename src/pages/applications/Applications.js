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
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';

// filter options
const checkboxOptions = [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" }
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Last modification of application
const LastModification = ({ timestamp }) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <p style={{ fontSize: '1.3rem' }}><strong>Last Edited:</strong> {formattedDate}</p>
    );
};

// Application item component
function ApplicationItem({ application }) {
    const navigate = useNavigate();

    const getApplicationStateColor = (submitted) => {   // Get color based on application state
        return submitted ? 'var(--clr-darker-green)' : 'var(--clr-orange)';
    };

    // show application details
    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/applications/view-application/${application.applicationId}`)}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Status:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: getApplicationStateColor(application.submitted),
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {application.submitted ? 'Submitted' : 'Draft'}
                        </h2>
                    </Box>
                    {/* Nanny Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <h2 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Nanny:</h2>
                        <p style={{ fontSize: '1.3rem' }}>{application.nannyName}</p>
                    </Box>
                    {/* Dates of potential partnership */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>From:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[application.fromDate.month]} ${application.fromDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InsertInvitationIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>To:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[application.toDate.month]} ${application.toDate.year}`}</p>
                    </Box>
                    {/* Last modification */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <UpdateIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <LastModification timestamp={application.timestamp} />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function Applications() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const [filters, setFilters] = useState({
        draft: true,
        submitted: true,
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
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch applications and filter them based on the filters
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const applicationsData = userData.applications || [];
    
                    const filteredApplications = applicationsData.filter(application => {
                        const applicationDate = new Date(application.timestamp);
                        const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                        const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);
    
                        // Check if the application is within the date range and matches the status
                        const isWithinDateRange = (!filters.fromDate.year || applicationDate >= fromDate) &&
                                                  (!filters.toDate.year || applicationDate <= toDate);
    
                        // Check if the application status matches the filters
                        const isStatusMatch = (filters.draft && !application.submitted) ||
                                                (filters.submitted && application.submitted);
    
                        return isWithinDateRange && isStatusMatch;
                    });
    
                    // Sort applications based on the timestamp
                    const sortedApplications = filteredApplications.sort((a, b) => {
                        const dateA = new Date(a.timestamp);
                        const dateB = new Date(b.timestamp);
                        return filters.newerFirst ? dateB - dateA : dateA - dateB;
                    });
    
                    setApplications(sortedApplications);
                } else {
                    console.error('No such user:', userData.uid);
                }
            } catch (error) {
                console.error("Error fetching applications:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };
    
        if (userData) {
            fetchApplications();
        }
    }, [userData, filters]);
    
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - Applications" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Applications</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                    Here you can view all the applications you have submitted for nanny collaborations.
                    You can edit and update your temporarily saved applications or view your finalized applications.
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
                    <GenericContainer userData={userData} items={applications} itemFunction={(item) => <ApplicationItem application={item} />} loading={loading} />
                </Box>
            </>
        )}
        </>
    );
}

export default Applications;