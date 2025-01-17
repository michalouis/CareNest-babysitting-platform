import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import FilterBox from '../meetings/FilterBox';
import GenericContainer from '../meetings/GenericContainer';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TodayIcon from '@mui/icons-material/Today';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';

const checkboxOptions = [
    { label: "Πρόχειρο", value: "draft" },
    { label: "Υποβλήθηκε", value: "submitted" }
];

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

const LastModification = ({ timestamp }) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('el-GR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <p style={{ fontSize: '1.3rem' }}><strong>Τελευταία ενημέρωση:</strong> {formattedDate}</p>
    );
};

function ApplicationItem({ application }) {
    const navigate = useNavigate();

    const getApplicationStateColor = (submitted) => {
        return submitted ? 'var(--clr-darker-green)' : 'var(--clr-orange)';
    };

    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/applications/view-application?applicationId=${application.applicationId}`)}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Κατάσταση:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: getApplicationStateColor(application.submitted),
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {application.submitted ? 'Υποβλήθηκε' : 'Πρόχειρο'}
                        </h2>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <h2 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Νταντά:</h2>
                        <p style={{ fontSize: '1.3rem' }}>{application.nannyName}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>Από:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[application.fromDate.month]} ${application.fromDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InsertInvitationIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>Μέχρι:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[application.toDate.month]} ${application.toDate.year}`}</p>
                    </Box>
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
    
                        const isWithinDateRange = (!filters.fromDate.year || applicationDate >= fromDate) &&
                                                  (!filters.toDate.year || applicationDate <= toDate);
    
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
    
    if (loading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - Αιτήσεις" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Αιτήσεις</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                Εδώ μπορείτε να δείτε όλες τις αιτήσεις που έχετε υποβάλει για τη συνεργασία με νταντάδες.
                Μπορείτε να επεξεργαστείτε και να ενημερώσετε τις προσωρινά αποθηκευμένες αιτήσεις σας ή να δείτε τις
                οριστικοποιημένες αιτήσεις σας.
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
                    <GenericContainer userData={userData} items={applications} itemFunction={(item) => <ApplicationItem application={item} />} loading={loading} />
                </Box>
            </>
        )}
        </>
    );
}

export default Applications;