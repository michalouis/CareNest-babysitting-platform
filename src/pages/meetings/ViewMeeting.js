import React, { useState, useEffect } from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';

export default function ViewMeeting() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const meetingId = queryParams.get('meetingId');
    const [meetingData, setMeetingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeetingData = async () => {
            try {
                const meetingDoc = await getDoc(doc(FIREBASE_DB, 'meetings', meetingId));
                if (meetingDoc.exists()) {
                    setMeetingData(meetingDoc.data());
                } else {
                    console.error('No such meeting:', meetingId);
                }
            } catch (error) {
                console.error('Error fetching meeting data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (meetingId) {
            fetchMeetingData();
        } else {
            setLoading(false);
        }
    }, [meetingId]);

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Ραντεβού" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Ραντεβού</h1>
            {meetingData && (
                <div style={{ marginLeft: '1rem' }}>
                    <p><strong>Parent ID:</strong> {meetingData.parentId}</p>
                    <p><strong>Nanny ID:</strong> {meetingData.nannyId}</p>
                    <p><strong>Date:</strong> {`${meetingData.dateTime.day}/${meetingData.dateTime.month + 1}`}</p>
                    <p><strong>Time:</strong> {`${meetingData.dateTime.hour}:${meetingData.dateTime.minute}`}</p>
                    <p><strong>Meeting Type:</strong> {meetingData.meetingType}</p>
                    {meetingData.meetingType === 'in-person' && (
                        <p><strong>Address:</strong> {meetingData.address}</p>
                    )}
                    <p><strong>Meeting State:</strong> {meetingData.meetingState}</p>
                </div>
            )}
        </>
    );
}