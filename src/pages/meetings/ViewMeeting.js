import React, { useState, useEffect } from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { Box, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

import NavigationIcon from '@mui/icons-material/Navigation';
import VideocamIcon from '@mui/icons-material/Videocam';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ViewMeeting() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the meeting ID from the URL
    const meetingId = id;
    const [meetingData, setMeetingData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    // Fetch meeting data
    useEffect(() => {
        const fetchMeetingData = async () => {
            try {
                const meetingDoc = await getDoc(doc(FIREBASE_DB, 'meetings', meetingId));
                if (meetingDoc.exists()) {
                    const data = meetingDoc.data();
                    setMeetingData(data);

                    // Fetch other person's data
                    const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userData.role === 'parent' ? data.nannyId : data.parentId));
                    if (userDoc.exists()) {
                        if (userData.role === 'parent') {
                            setNannyData(userDoc.data());
                        } else {
                            setParentData(userDoc.data());
                        }
                    } else {
                        console.error('No such user:', userData.role === 'parent' ? data.nannyId : data.parentId);
                    }
                } else {
                    console.error('No such meeting:', meetingId);
                }
            } catch (error) {
                console.error('Error fetching meeting data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (meetingId && userData) {
            fetchMeetingData();
        }
    }, [meetingId, userData]);

    const handleAccept = () => {
        setActionType('accept');
        setDialogOpen(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirm = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(FIREBASE_DB, 'meetings', meetingId), {
                meetingState: actionType === 'accept' ? 'accepted' : 'rejected'
            });
            setMeetingData(prevData => ({ ...prevData, meetingState: actionType === 'accept' ? 'accepted' : 'rejected' }));
        } catch (error) {
            console.error(`Error ${actionType === 'accept' ? 'accepting' : 'rejecting'} meeting:`, error);
        } finally {
            setLoading(false);
            handleDialogClose();
        }
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - View Meeting" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>View Meeting</h1>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {/* Warning Alert */}
                    {userData.role === 'parent' && meetingData.meetingState === 'pending' && (
                        <>
                            <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                                Your meeting is pending approval from the nanny.
                            </Alert>
                        </>
                    )}

                    {/* If user is nanny, show accept or decline buttons */}
                    {userData.role === 'nanny' && meetingData.meetingState === 'pending' && (
                        <>
                        <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                            Please accept or reject the meeting request sent by the parent. <br />
                            You can find their information below.
                        </Alert>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', margin: '1rem' }}>
                            <Button variant="contained" sx={{ backgroundColor: "var(--clr-darker-green)" }} onClick={handleAccept}>
                                <p className='big-button-text'>Accept</p>
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: "var(--clr-error-main)" }} onClick={handleReject}>
                                <p className='big-button-text'>Reject</p>
                            </Button>
                        </Box>
                        </>
                    )}
                    {/* Meeting data */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        margin: '1rem',
                        padding: '1rem',
                        width: 'fit-content',
                        borderRadius: '1rem',
                        backgroundColor: 'var(--clr-white)',
                        boxShadow: '3',
                        gap: '0.5rem',
                    }}>
                        {/* status */}
                        <p style={{ fontSize: '2.2rem', lineHeight: '2.5rem', alignItems: 'center' }}>
                            <strong>Meeting Status: </strong>
                            <span style={{
                                fontWeight: 'bold',
                                padding: '0.3rem 0.7rem',
                                backgroundColor: meetingData.meetingState === 'pending' ? 'var(--clr-orange)'
                                : meetingData.meetingState === 'accepted' ? 'var(--clr-darker-green)' : 'var(--clr-error-main)',
                                color: 'var(--clr-white)',
                                borderRadius: '1rem',
                                display: 'inline-block',
                                alignSelf: 'center',
                            }}>
                                {meetingData.meetingState === 'pending' ? 'Pending' 
                                    : meetingData.meetingState === 'accepted' ? 'Accepted' 
                                    : 'Rejected'}
                            </span>
                        </p>
                        <h1 style={{ margin: '1rem 0'}}>Meeting Type</h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '2rem',
                        }}>
                            {/* Type of meeting */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Meeting Type: </strong>{meetingData.meetingType === 'online' ? 'Online' : 'In-person'}
                                </p>
                                {meetingData.meetingType === 'in-person' && <p style={{ fontSize: '1.3rem' }}><strong>Meeting Address: </strong>{meetingData.address}</p>}
                            </Box>
                            {meetingData.meetingType === 'online' ? (
                                <Button
                                    variant="contained"
                                    startIcon={<VideocamIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem'}}
                                    disabled={meetingData.meetingState !== 'accepted'}
                                >
                                    <p className='small-button-text'>Join Meeting</p>
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<NavigationIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }}
                                    disabled={meetingData.meetingState !== 'accepted'}
                                >
                                    <p className='small-button-text'>Open Address in Maps</p>
                                </Button>
                            )}
                        </Box>
                        {/* Meeting Date */}
                        <h1 style={{ margin: '1rem 0'}}>Date and Time</h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '2rem',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Date: </strong>{meetingData.dateTime.day} {months[meetingData.dateTime.month]} {meetingData.dateTime.year}
                                </p>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Time: </strong>{meetingData.dateTime.hour}:{meetingData.dateTime.minute}
                                </p>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<EventIcon />}
                                sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem'}}
                                disabled={meetingData.meetingState !== 'accepted'}
                            >
                                <p className='small-button-text'>Add to Calendar</p>
                            </Button>
                        </Box>
                        <h1 style={{ margin: '1rem 0' }}>
                            {userData.role === 'parent' ? 'Nanny Information' : 'Parent Information'}
                        </h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '4rem',
                        }}>
                            {/* Show other person's data - hide sensitive data if meeting is not accepted */}
                            {nannyData && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Nanny Name: </strong>{nannyData.firstName} {nannyData.lastName}</p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Nanny Phone: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            nannyData.phoneNumber
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Meeting approval required</span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Nanny Email: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            nannyData.email
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Meeting approval required</span>
                                        )}
                                    </p>
                                </Box>
                            )}
                            {parentData && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Parent Name: </strong>{parentData.firstName} {parentData.lastName}</p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Parent Phone: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            parentData.phoneNumber
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Meeting approval required</span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Parent Email: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            parentData.email
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Meeting approval required</span>
                                        )}
                                    </p>
                                </Box>
                            )}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: '1rem',
                            }}>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }}
                                    onClick={() => navigate(`/meetings/view-meeting/${meetingId}/view-profile/${userData.role === 'parent' ? meetingData.nannyId : meetingData.parentId}`)}
                                >
                                    <p className='small-button-text'>View Profile</p>
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<MessageIcon />}
                                    onClick={() => navigate('/messages')}
                                    sx={{
                                        backgroundColor: 'var(--clr-violet)',
                                        padding: '0.5rem 1rem'
                                }}>
                                    <p className='small-button-text'>Send Message</p>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* Confirm dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle><strong>Warning!</strong></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to {actionType === 'accept' ? 'accept' : 'reject'} this meeting?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} sx={{ color: 'var(--clr-black)' }}>
                            <p className='button-text'>Cancel</p>
                        </Button>
                        <Button variant="contained" onClick={handleDialogConfirm} sx={{ backgroundColor: actionType === 'accept' ? 'var(--clr-darker-green)' : 'var(--clr-error-main)' }}>
                            <p className='button-text'>{actionType === 'accept' ? 'Accept' : 'Reject'}</p>
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )}
        </>
    );
}