import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Rating } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';

import GradeIcon from '@mui/icons-material/Grade';

// Display the rating of a partnership and allow the parent to rate the nanny
const RatingBox = ({ partnershipData, rating, userData, finishPartnership }) => {
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [ratingError, setRatingError] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastPaymentStatus = partnershipData.payments[partnershipData.payments.length - 1];

    const handleRatingDialogOpen = () => {
        setRatingDialogOpen(true);
    };

    const handleRatingDialogClose = () => {
        setRatingDialogOpen(false);
        setNewRating(0);
        setNewComment('');
        setRatingError(false);
    };

    const handleConfirmDialogOpen = () => {
        if (newRating === 0) {
            setRatingError(true);
        } else {
            setConfirmDialogOpen(true);
        }
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    const handleSubmitRating = async () => {
        try {
            setLoading(true);
            // Update partnership data with rating
            const updatedPartnershipData = {
                ...partnershipData,
                rating: {
                    score: newRating,
                    comment: newComment,
                },
            };
            await updateDoc(doc(FIREBASE_DB, 'partnerships', partnershipData.partnershipId), updatedPartnershipData);
    
            // Update nanny data
            const nannyDocRef = doc(FIREBASE_DB, 'users', partnershipData.nannyId);
            const nannyDoc = await getDoc(nannyDocRef);
            if (nannyDoc.exists()) {
                const nannyData = nannyDoc.data();
                const newRatingsNum = nannyData.ratingsNum + 1;
                const newScore = (((nannyData.score * nannyData.ratingsNum) + newRating) / newRatingsNum).toFixed(2);
    
                await updateDoc(nannyDocRef, {
                    ratingsNum: newRatingsNum,
                    score: newScore,
                });
            }
    
            // Update nanny and parent data
            await finishPartnership();
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    // Render the rating box for the parent (before the partnership is finished)
    const renderParentRating = () => (
        <>
            <Button 
                variant="contained" 
                sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem', width: 'fit-content' }} 
                disabled={lastPaymentStatus !== 'verified'}
                startIcon={<GradeIcon style={{ fontSize: '2.2rem'}} />}
                onClick={handleRatingDialogOpen}
            >
                <p className='big-button-text'>Add Rating</p>
            </Button>
            {/* inform user */}
            <p style={{ fontSize: '1.3rem' }}>
                {lastPaymentStatus === 'verified' 
                    ? 'To complete your partnership, rate your experience with the nanny.' 
                    : 'Complete your payments to be able to rate your partnership.'}
            </p>
        </>
    );

    // Render the rating box for the nanny (before the partnership is finished)
    const renderNannyRating = () => (
        <p style={{ fontSize: '1.3rem' }}>
            The parent's rating will appear here at the end of your partnership.
        </p>
    );

    return (
        <Box sx={{
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '2',
        }}>
            <h1>Rating</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '1rem', maxHeight: '250px' }}>
                {rating ? ( // after rating is submitted
                    <>
                        <Rating value={rating.score} precision={0.5} style={{ fontSize: '3rem'}} readOnly />
                        <h3 style={{ alignSelf: 'flex-start', margin: '0 0 0.5rem 1rem', color: 'var(--clr-grey)' }}>Comment</h3>
                        <Box sx={{ display: 'flex', margin: '0 1rem', padding: '0.5rem', border: '2px solid var(--clr-light-grey)', borderRadius: '1rem', width: '100%', overflow: 'auto'}} >
                            <p style={{ fontSize: '1.3rem', color: rating.comment ? 'var(--clr-black)' : 'var(--clr-grey)' }}>
                                {rating.comment || 'No comment...'}
                            </p>
                        </Box>
                    </>
                ) : (   // before rating is submitted
                    userData.role === 'parent' ? renderParentRating() : renderNannyRating()
                )}
            </Box>

            {/* Rating Dialog Box */}
            <Dialog open={ratingDialogOpen} onClose={handleRatingDialogClose} PaperProps={{ style: { resize: 'none' } }}>
                <DialogTitle><strong>Add Rating</strong></DialogTitle>
                <DialogContent>
                    {ratingError && <p style={{ color: 'var(--clr-error)' }}>Enter a rating to continue</p>}
                    <Rating
                        value={newRating}
                        precision={0.5}
                        onChange={(event, newValue) => { setNewRating(newValue); setRatingError(false); }}
                        sx={{ fontSize: '3rem'}}
                    />
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        fullWidth
                        sx={{ marginTop: '1rem' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRatingDialogClose} sx={{ color: 'var(--clr-black)'}}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmDialogOpen} sx={{ backgroundColor: 'var(--clr-violet)' }}>
                        <p className='button-text'>Submit</p>
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Warning!</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to submit the rating? <strong>You will not be able to edit it after submission.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-black)'}}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant='contained' onClick={handleSubmitRating} sx={{ backgroundColor: 'var(--clr-violet)' }} disabled={loading}>
                        <p className='button-text'>Confirm</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RatingBox;