import React, { useState } from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style.css";

function Breadcrumbs({ current, showPopup = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [openNavigateAwayDialog, setOpenNavigateAwayDialog] = useState(false);
    const [navigateTo, setNavigateTo] = useState(null); // store the path to navigate before asking the user to confirm

    /////////////// BACK BUTTON ///////////////

    // Handle the back button
    const handleBackButton = () => {
        if (showPopup) {    // show warning dialog before navigating away
            setNavigateTo('previous');  // navigate to the previous page
            setOpenNavigateAwayDialog(true);
        } else {
            navigateToPrevious();
        }
    };

    // Navigate to the previous page
    const navigateToPrevious = () => {
        const pathArray = location.pathname.split('/').filter(Boolean);
        if (pathArray.length > 1) {     // if we are not at the root page (home page), navigate to the previous page
            const previousPath = `/${pathArray.slice(0, -1).join('/')}`;
            navigate(previousPath);
        } else {    // if we are at the root page (home page), navigate to the home page
            navigate('/');
        }
    };

    /////////////// BREADCRUMBS ///////////////

    // Handle when the user confirms the navigation
    const handleNavigateConfirm = () => {
        setOpenNavigateAwayDialog(false);
        if (navigateTo === 'previous') {    // for back button
            navigateToPrevious();
        } else {
            navigate(navigateTo);
        }
    };

    /////////////// POPUP ///////////////

    // Handle when the user cancels the navigation
    const handleNavigateCancel = () => {
        setOpenNavigateAwayDialog(false);
        setNavigateTo(null);    // reset the path to navigate
    };

    // Handle when one of the breadcrumbs is clicked
    const handleBreadcrumbClick = (event, path) => {
        event.preventDefault();
        if (showPopup) {
            setNavigateTo(path);
            setOpenNavigateAwayDialog(true);
        } else {
            navigate(path);
        }
    };

    // Get the path array from the current location
    const pathArray = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
        { label: 'Αρχική Σελίδα', path: '/' },
        ...pathArray.map((path, index) => ({    // create an array of objects with the label and path for each breadcrumb
            label: path,
            path: `/${pathArray.slice(0, index + 1).join('/')}`
        }))
    ];

    return (
        <>
            {/* Breadcrumbs */}
            <MUIBreadcrumbs sx={{ marginTop: '1rem', marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleBackButton}>
                    <NavigateBeforeIcon />
                </IconButton>
                {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (  // exclude the current page
                    <Link
                        key={index}
                        underline="hover"
                        color="var(--clr-grey)"
                        href={breadcrumb.path}
                        onClick={(event) => handleBreadcrumbClick(event, breadcrumb.path)}
                    >
                        {breadcrumb.label}
                    </Link>
                ))}
                <Typography color="var(--clr-black)">{current}</Typography>
            </MUIBreadcrumbs>

            {/* Warning dialog */}
            <Dialog
                open={openNavigateAwayDialog}
                onClose={handleNavigateCancel}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Προσοχή!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Η πρόοδος σας θα χαθεί! Είστε σίγουρος πως θέλετε να αποχωρήσετε;
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button variant='text' onClick={handleNavigateCancel} sx={{ color: 'var(--clr-black)' }}>
                    <p className='button-text'>Παραμονή</p>
                </Button>
                <Button variant='contained' onClick={handleNavigateConfirm} sx={{ backgroundColor: 'var(--clr-error-main)', '&:hover': { opacity: 0.8 } }} autoFocus>
                    <p className='button-text'>Αποχώρηση</p>
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Breadcrumbs;