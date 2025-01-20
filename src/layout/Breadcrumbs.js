import React, { useState } from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style.css";

const pathLabels = {
    '/': 'Αρχική Σελίδα',
    'contact': 'Επικοινωνία',
    'faq': 'Συχνές Ερωτήσεις',
    'messages': 'Μηνύματα',
    'login': 'Σύνδεση',
    'signup': 'Εγγραφή',
    'create-profile': 'Δημιουργία Προφίλ',
    'signup-complete': 'Ολοκλήρωση Εγγραφής',
    'profile': 'Προφίλ',
    'edit-profile': 'Επεξεργασία Προφίλ',
    'search': 'Αναζήτηση Νταντάς',
    'results': 'Αποτελέσματα Αναζήτησης',
    'view-profile': 'Προβολή Προφίλ',
    'create-application': 'Δημιουργία Αίτησης',
    'favorites': 'Αγαπημένα',
    'meetings': 'Ραντεβού Γνωριμίας',
    'view-meeting': 'Προβολή Ραντεβού',
    'applications': 'Αιτήσεις',
    'view-application': 'Προβολή Αίτησης',
    'contracts': 'Συμφωνητικά',
    'view-contract': 'Προβολή Συμφωνητικού',
    'partnerships': 'Συνεργασίες',
    'view-partnership': 'Προβολή Συνεργασίας',
    'job-posting': 'Αγγελία Εργασίας',
    'edit-job-posting': 'Δημιουργία Αγγελίας',
    'error404': 'Σφάλμα 404',
};

const hasParams = ['create-application', 'view-profile', 'view-application', 'view-contract', 'view-partnership', 'view-meeting'];

// Match the path to the corresponding label
const getPageLabel = (path) => {
    const key = path === '/' ? '/' : path.split('/').pop();
    return pathLabels[key] || key;
};

// Breadcrumbs component
function Breadcrumbs({ showPopup = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [openNavigateAwayDialog, setOpenNavigateAwayDialog] = useState(false);
    const [navigateTo, setNavigateTo] = useState(null); // store the path to navigate before asking the user to confirm

    /////////////// BACK BUTTON ///////////////

    // Handle the back button
    const handleBackButton = () => {
        if (showPopup) {    // show warning dialog before navigating away
            setNavigateTo('previous');  // navigate to the previous page (back button)
            setOpenNavigateAwayDialog(true);
        } else {
            navigateToPrevious();
        }
    };

    // Navigate to the previous page
    const navigateToPrevious = () => {
        const pathArray = location.pathname.split('/').filter(Boolean);
        let previousPathArray = pathArray.slice(0, -1);     // remove the current page
        let previousPath = `/${previousPathArray.join('/')}`;   
    
        // Check if the current or previous path is a parameter
        if (!pathLabels[pathArray[pathArray.length - 1]] || !pathLabels[previousPathArray[previousPathArray.length - 1]]) {
            previousPathArray = pathArray.slice(0, -2);
            previousPath = `/${previousPathArray.join('/')}`;
        }
    
        navigate(previousPath);
    };

    /////////////// POPUP ///////////////
    
    // Handle when the user confirms the navigation
    const handleNavigateConfirm = () => {
        setOpenNavigateAwayDialog(false);
        if (navigateTo === 'previous') {    // for back button
            navigateToPrevious();
        } else {
            navigate(navigateTo);
        }
    };
    
    
    // Handle when the user cancels the navigation
    const handleNavigateCancel = () => {
        setOpenNavigateAwayDialog(false);
        setNavigateTo(null);    // reset the path to navigate
    };
    
    /////////////// BREADCRUMB CLICK ///////////////

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

    // Get the path array from the current location, page -> { pagename: '...', param: '...' }
    const pathArray = location.pathname.split('/').filter(Boolean);
    const pages = [];
    for (let i = 0; i < pathArray.length; i++) {
        const page = pathArray[i];
        if (hasParams.includes(page)) {
            pages.push({ pagename: page, param: pathArray[i + 1] || '' });
            i++; // skip the next element as it is a parameter
        } else {
            pages.push({ pagename: page, param: '' });
        }
    }

    // Create the breadcrumbs
    const breadcrumbs = [
        { label: pathLabels['/'], path: '/' },  // add landing page as the first breadcrumb
        ...pages.map((page, index) => ({        // add the rest of the pages
            label: getPageLabel(page.pagename),
            path: `/${pages.slice(0, index + 1).map(p => p.pagename + (p.param ? `/${p.param}` : '')).join('/')}`
        }))
    ];

    return (
        <>
            {/* Breadcrumbs */}
            <MUIBreadcrumbs sx={{ marginTop: '1rem', marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleBackButton}> {/* back button */}
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
                <p style={{ color: 'var(--clr-black)', }}>  {/* current page, not interactable */}
                    {breadcrumbs[breadcrumbs.length - 1].label}
                </p>
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
                    <Button variant='contained' onClick={handleNavigateConfirm} sx={{ backgroundColor: 'var(--clr-error-main)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Αποχώρηση</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Breadcrumbs;