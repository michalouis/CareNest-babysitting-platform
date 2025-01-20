import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, Card, CardActionArea, CardContent } from '@mui/material';
import FilterBox from '../../components/FilterBox';
import GenericContainer from '../../components/GenericContainer';
import { getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled';
import PlaceRounded from '@mui/icons-material/PlaceRounded';

// filter options
const checkboxOptions = [
    { label: "Εγκρίθηκε", value: "accepted" },
    { label: "Σε αναμονή", value: "pending" },
    { label: "Απορρίφθηκε", value: "rejected" }
];

// Meeting item component
function MeetingItem({ meeting, userData }) {
    const navigate = useNavigate();
    const months = [
        'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
        'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
    ];

    const getMeetingStateColor = (state) => {
        switch (state) {
            case 'accepted':
                return 'var(--clr-darker-green)';
            case 'pending':
                return 'var(--clr-orange)';
            case 'rejected':
                return 'var(--clr-error-main)';
            default:
                return 'var(--clr-black)';
        }
    };

    // show meeting details
    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/meetings/view-meeting/${meeting.meetingId}`)}>
                <CardContent>
                    {/* status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Κατάσταση:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: getMeetingStateColor(meeting.meetingState),
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {meeting.meetingState === 'pending' ? 'Σε αναμονή' 
                                : meeting.meetingState === 'accepted' ? 'Εγκρίθηκε' 
                                : 'Απορρίφθηκε'}
                        </h2>
                    </Box>
                    {/* partner name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                        <p style={{ fontSize: '1.3rem' }}>
                            <strong>{userData.role === 'parent' ? 'Νταντά: ' : 'Γονέας: '}</strong> 
                            {userData.role === 'parent' ? `${meeting.nannyFirstName} ${meeting.nannyLastName}` : `${meeting.parentFirstName} ${meeting.parentLastName}`}
                        </p>
                    </Box>
                    {/* meeting date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <EventRoundedIcon style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Ημερομηνία: </strong> {meeting.dateTime.day} {months[meeting.dateTime.month]} {meeting.dateTime.year}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <AccessTimeFilled style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Ώρα: </strong> {meeting.dateTime.hour}:{meeting.dateTime.minute}</p>
                    </Box>
                    {/* Type of meeting */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PlaceRounded style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Τύπος Ραντεβού: </strong> {meeting.meetingType === 'in-person' ? 'Δια ζώσης' : 'Διαδικτυακό'}</p>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function Meetings() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const [filters, setFilters] = useState({
        accepted: true,
        pending: true,
        rejected: true,
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
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                // Fetch all meetings
                const meetingsCollection = await getDocs(collection(FIREBASE_DB, 'meetings'));
                const meetingsData = meetingsCollection.docs.map(doc => doc.data());

                // Filter meetings based on the user's id & role
                const filteredMeetings = meetingsData.filter(meeting => {
                    if (userData.role === 'parent') {
                        return meeting.parentId === userData.uid;
                    } else if (userData.role === 'nanny') {
                        return meeting.nannyId === userData.uid;
                    }
                    return false;
                }).filter(meeting => {
                    const meetingDate = new Date(meeting.dateTime.year, meeting.dateTime.month, meeting.dateTime.day);
                    const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                    const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);

                    // Check if the meeting is within the date range
                    const isWithinDateRange = (!filters.fromDate.year || meetingDate >= fromDate) &&
                                              (!filters.toDate.year || meetingDate <= toDate);

                    // Check if the meeting status matches the filters
                    const isStatusMatch = (filters.accepted && meeting.meetingState === 'accepted') ||
                                          (filters.pending && meeting.meetingState === 'pending') ||
                                          (filters.rejected && meeting.meetingState === 'rejected');

                    return isWithinDateRange && isStatusMatch;
                });

                // Sort meetings based on the date
                const sortedMeetings = filteredMeetings.sort((a, b) => {
                    const dateA = new Date(a.dateTime.year, a.dateTime.month, a.dateTime.day);
                    const dateB = new Date(b.dateTime.year, b.dateTime.month, b.dateTime.day);
                    return filters.newerFirst ? dateB - dateA : dateA - dateB;
                });

                setMeetings(sortedMeetings);
            } catch (error) {
                console.error("Error fetching meetings:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchMeetings();
        }
    }, [userData, filters]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - Ραντεβού" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Ραντεβού Γνωριμίας</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                Διαχειριστείτε τα ραντεβού γνωριμίας σας!
                Χρησιμοποιήστε τα φίλτρα για να βρείτε εύκολα ραντεβού με βάση την κατάστασή τους ή την ημερομηνία.
                Μπορείτε να παρακολουθείτε την τρέχουσα κατάσταση κάθε ραντεβού και να δείτε τις λεπτομέρειες τους.
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
                    <GenericContainer userData={userData} items={meetings} itemFunction={(item, userData) => <MeetingItem meeting={item} userData={userData} />} loading={loading} />
                </Box>
            </>
        )}
        </>
    );
}

export default Meetings;