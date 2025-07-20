import React, { useState } from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style.css";

const pathLabels = {
    '/': 'Home',
    'contact': 'Contact',
    'faq': 'FAQs',
    'messages': 'Messages',
    'login': 'Login',
    'signup': 'Sign Up',
    'create-profile': 'Create Profile',
    'signup-complete': 'Signup Complete',
    'profile': 'Profile',
    'edit-profile': 'Edit Profile',
    'search': 'Search',
    'results': 'Results',
    'view-profile': 'View Profile',
    'create-application': 'Create Application',
    'favorites': 'Favorites',
    'meetings': 'Meetings',
    'view-meeting': 'View Meeting',
    'applications': 'Applications',
    'view-application': 'View Application',
    'contracts': 'Contracts',
    'view-contract': 'View Contract',
    'partnerships': 'Partnerships',
    'view-partnership': 'View Partnership',
    'job-posting': 'Job Posting',
    'edit-job-posting': 'Create Job Posting',
    'error404': 'Error 404',
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
        const repoName = 'CareNest-babysitting-platform';
        const pathArray = location.pathname.split('/').filter(Boolean);
        
        // If we're at /repoName/faq, we should go back to /repoName/
        if (pathArray.length === 2 && pathArray[0] === repoName) {
            navigate(`/${repoName}/`);
            return;
        }
        
        let previousPathArray = pathArray.slice(0, -1);     // remove the current page
        let previousPath = `/${previousPathArray.join('/')}`;   

        // Check if the current or previous path is a parameter
        if (!pathLabels[pathArray[pathArray.length - 1]] || !pathLabels[previousPathArray[previousPathArray.length - 1]]) {
            previousPathArray = pathArray.slice(0, -2);
            previousPath = `/${previousPathArray.join('/')}`;
        }

        // Make sure we don't navigate outside the repo
        if (previousPathArray.length === 0 || (previousPathArray.length === 1 && previousPathArray[0] !== repoName)) {
            navigate(`/${repoName}/`);
        } else {
            navigate(previousPath);
        }
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

    // In Breadcrumbs component, filter out the repo name from the path array:
    const repoName = 'CareNest-babysitting-platform';
    const pathArray = location.pathname.split('/').filter(Boolean).filter(p => p !== repoName);

    // Get the path array from the current location, page -> { pagename: '...', param: '...' }
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
        { label: 'Home', path: `/${repoName}/` },  // always show "Home" and link to /CareNest-babysitting-platform/
        ...pages.map((page, index) => ({
            label: getPageLabel(page.pagename),
            path: `/${repoName}/${pages.slice(0, index + 1).map(p => p.pagename + (p.param ? `/${p.param}` : '')).join('/')}`
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