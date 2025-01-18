import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Rating, Divider } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';

import GradeIcon from '@mui/icons-material/Grade';

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

    const renderParentRating = () => (
        <>
            <Button 
                variant="contained" 
                sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem', width: 'fit-content' }} 
                disabled={lastPaymentStatus !== 'verified'}
                startIcon={<GradeIcon style={{ fontSize: '2.2rem'}} />}
                onClick={handleRatingDialogOpen}
            >
                <p className='big-button-text'>Προσθήκη Αξιολόγησης</p>
            </Button>
            <p style={{ fontSize: '1.3rem' }}>
                {lastPaymentStatus === 'verified' 
                    ? 'Για να ολοκληρώσετε την συνεργασία σας αξιολογήστε πως ήταν η εμπειρία σας με τη νταντά.' 
                    : 'Ολοκληρώστε τις πληρωμές σας για να να μπορέσετε να αξιολογήστε τη συνεργασία σας.'}
            </p>
        </>
    );

    const renderNannyRating = () => (
        <p style={{ fontSize: '1.3rem' }}>
            Η αξιολογηση του γονέα θα εμφανιστεί εδω πέρα στο τέλος της συνεργασίας σας.
        </p>
    );

    return (
        <Box sx={{
            width: '90%',
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '2',
            margin: '1rem auto'
        }}>
            <h1>Αξιολόγηση</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                {rating ? (
                    <>
                        <Rating value={rating.score} precision={0.5} style={{ fontSize: '3rem'}} readOnly />
                        <h3 style={{ alignSelf: 'flex-start', margin: '0 0 0.5rem 1rem', color: 'var(--clr-grey)' }}>Σχόλιο</h3>
                        <Box sx={{ display: 'flex', margin: '0 1rem', padding: '0.5rem', border: '2px solid var(--clr-light-grey)', borderRadius: '1rem', width: '100%'}} >
                            <p style={{ fontSize: '1.3rem', color: rating.comment ? 'var(--clr-black)' : 'var(--clr-grey)' }}>
                                {rating.comment || 'Δεν υπάρχει σχόλιο...'}
                            </p>
                        </Box>
                    </>
                ) : (
                    userData.role === 'parent' ? renderParentRating() : renderNannyRating()
                )}
            </Box>
            <Dialog open={ratingDialogOpen} onClose={handleRatingDialogClose} PaperProps={{ style: { resize: 'none' } }}>
                <DialogTitle><strong>Προσθήκη Αξιολόγησης</strong></DialogTitle>
                <DialogContent>
                    {ratingError && <p style={{ color: 'red' }}>Εισάγετε μια βαθμολογία για να συνεχίσετε</p>}
                    <Rating
                        value={newRating}
                        precision={0.5}
                        onChange={(event, newValue) => { setNewRating(newValue); setRatingError(false); }}
                        sx={{ fontSize: '3rem'}}
                    />
                    <TextField
                        label="Σχόλιο"
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
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmDialogOpen} sx={{ backgroundColor: 'var(--clr-violet)' }}>
                        <p className='button-text'>Υποβολή</p>
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Προσοχή!</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουροι πως θέλετε να υποβάλετε την αξιολόγηση; <strong>Δεν θα μπορείτε να την επεξεργαστείτε μετά την υποβολή.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-black)'}}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleSubmitRating} sx={{ backgroundColor: 'var(--clr-violet)' }} disabled={loading}>
                        <p className='button-text'>Επιβεβαίωση</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RatingBox;