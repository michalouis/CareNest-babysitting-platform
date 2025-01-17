import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import FilterBox from '../meetings/FilterBox';
import GenericContainer from '../meetings/GenericContainer';

const checkboxOptions = [
    { label: "Πρόχειρη", value: "draft" },
    { label: "Υποβλήθηκε", value: "submitted" }
];

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
    });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const applicationsCollection = await getDocs(collection(FIREBASE_DB, 'applications'));
                const applicationsData = applicationsCollection.docs.map(doc => doc.data());

                const filteredApplications = applicationsData.filter(application => {
                    if (userData.role === 'parent') {
                        return application.parentId === userData.uid;
                    } else if (userData.role === 'nanny') {
                        return application.nannyId === userData.uid;
                    }
                    return false;
                }).filter(application => {
                    const applicationDate = new Date(application.dateTime.year, application.dateTime.month, application.dateTime.day);
                    const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                    const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);

                    const isWithinDateRange = (!filters.fromDate.year || applicationDate >= fromDate) &&
                                              (!filters.toDate.year || applicationDate <= toDate);

                    const isStatusMatch = (filters.draft && application.applicationState === 'draft') ||
                                          (filters.submitted && application.applicationState === 'submitted');

                    return isWithinDateRange && isStatusMatch;
                });

                setApplications(filteredApplications);
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
                    {/* <GenericContainer userData={userData} items={applications} itemFunction={(item, userData) => <ApplicationItem application={item} userData={userData} />} loading={loading} /> */}
                </Box>
            </>
        )}
        </>
    );
}

export default Applications;