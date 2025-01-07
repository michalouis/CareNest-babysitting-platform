import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Box, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import './layout.css';
import '../style.css';

// Implementation similar to the on on Material-UI's website (https://mui.com/material-ui/react-drawer/)

// DrawerItem component
function DrawerItem({ to, icon: Icon, title }) {
    return (
        <ListItem button component={Link} to={to}>
            <ListItemIcon>
                <Icon sx={{ color: 'var(--clr-purple-main)', fontSize: '2rem' }} />
            </ListItemIcon>
            <ListItemText>
                <p style={{
                    fontSize: '1.25rem',
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: 'var(--clr-purple-main)'
                }}>
                    {title}
                </p>
            </ListItemText>
        </ListItem>
    );
}

function AppDrawer({ open, onClose }) {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserRole(userData.role);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(FIREBASE_AUTH);
        navigate('/');
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const DrawerList = (
        <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} role="presentation" onClick={onClose}>
            <>
                {/* Close Drawer button */}
                <div className="drawer-header">
                    <IconButton onClick={onClose}>
                        <CancelRoundedIcon sx={{ color: 'var(--clr-purple-main)', fontSize: '2rem' }} />
                    </IconButton>
                </div>

                {/* Takes you to the following pages */}
                <List>
                    <DrawerItem to="/profile" icon={AccountCircleIcon} title="Προφίλ" />
                    <Divider sx={{ width: '80%', margin: '0 auto' }} />
                    {userRole === 'parent' ? (
                        <DrawerItem to="/search" icon={SearchIcon} title="Αναζήτηση Νταντάς" />
                    ) : (
                        <DrawerItem to="/job-posting" icon={WorkIcon} title="Αγγελία Εργασίας" />
                    )}
                    <Divider sx={{ width: '80%', margin: '0 auto' }} />
                    <DrawerItem to="/meetings" icon={EventIcon} title="Ραντεβού Γνωριμίας" />
                    <Divider sx={{ width: '80%', margin: '0 auto' }} />
                    {userRole === 'parent' && (
                        <>
                        <DrawerItem to="/applications" icon={AssignmentIcon} title="Αιτήσεις" />
                        <Divider sx={{ width: '80%', margin: '0 auto' }} />
                        </>
                    )}
                    <DrawerItem to="/contracts" icon={DrawRoundedIcon} title="Συμφωνητικά" />
                    <Divider sx={{ width: '80%', margin: '0 auto' }} />
                    <DrawerItem to="/partnerships" icon={GroupIcon} title="Συνεργασίες" />
                </List>
            </>
            {/* Logout button */}
            <ListItem button onClick={handleDialogOpen} sx={{ justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
                <ListItemIcon>
                    <LogoutIcon sx={{ color: 'var(--clr-error-main)', fontSize: '2rem' }} />
                </ListItemIcon>
                <ListItemText>
                    <p style={{
                        fontSize: '1.25rem',
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        color: 'var(--clr-error-main)'
                    }}>
                        Αποσύνδεση
                    </p>
                </ListItemText>
            </ListItem>
        </Box>
    );

    return (
        <>
            <Drawer anchor="right" open={open} onClose={onClose}>
                {DrawerList}
            </Drawer>

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle><strong>Επιβεβαίωση Αποσύνδεσης</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουρος ότι θέλετε να αποσυνδεθείτε;
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button onClick={handleLogout} sx={{ backgroundColor: 'var(--clr-error-main)', color: 'var(--clr-white)' }}>
                        <p className='button-text'>Αποσύνδεση</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AppDrawer;