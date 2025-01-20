import React from "react";
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, TextField, Button, List, ListItem, ListItemText, Divider } from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


// chat list dummy data
const conversations = [
    { name: "Γεώργιος Παπαδόπουλος", message: "Καλησπέρα, πώς είσαι;" },
    { name: "Μαρία Παπακωνσταντίνου", message: "Θα ήθελα να κανονίσουμε μια συνάντηση." },
    { name: "Νικόλαος Δημητρίου", message: "Ευχαριστώ για την απάντηση." },
    { name: "Ελένη Καραγιάννη", message: "Θα μιλήσουμε σύντομα." },
    { name: "Κωνσταντίνος Παπαγεωργίου", message: "Καλημέρα, τι κάνεις;" },
    { name: "Αναστασία Παπαδοπούλου", message: "Είμαι διαθέσιμη για συνάντηση." },
    { name: "Δημήτριος Παπαδημητρίου", message: "Θα ήθελα να συζητήσουμε περαιτέρω." },
    { name: "Αικατερίνη Παπαδοπούλου", message: "Ευχαριστώ για την ενημέρωση." },
    { name: "Ιωάννης Παπαδόπουλος", message: "Θα επικοινωνήσω σύντομα." },
    { name: "Σοφία Παπακωνσταντίνου", message: "Καλησπέρα, πώς είσαι;" }
];


// Messages page (static - to make it dynamic, we need to fetch data from a database with isn't the focus of this project)
function Messages() {
    return (
        <>
            <PageTitle title="CareNest - Μηνύματα" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Μηνύματα</h1>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                width: '100%-2rem',
                minHeight: '500px',
                margin: '1rem',
                borderRadius: '1rem',
                justifyContent: 'space-between',
                gap: '1rem'
            }}>
                {/* Chats List */}
                <Box sx={{
                    width: { xs: '100%', md: '25%' },
                    maxHeight: { xs: '300px', md: '600px' },
                    overflowY: 'auto',
                    backgroundColor: 'var(--clr-white)',
                    borderRadius: '1rem',
                    boxShadow: 4,
                }}>
                    <List>
                        {conversations.map((msg, index) => (
                            <React.Fragment key={index}>
                                <ListItem button sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <AccountCircleIcon sx={{ fontSize: '3rem', marginRight: '1rem' }} />
                                        <h2>{msg.name}</h2>
                                    </Box>
                                    <p style={{ fontSize: '0.8rem' }}><strong>Τελευταίο Μήνυμα:</strong> {msg.message}</p>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Box>

                {/* Chat Box */}
                <Box sx={{
                    width: { xs: '100%', md: '75%' },
                    height: 'fit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--clr-white)',
                    borderRadius: '1rem',
                    boxShadow: 4,
                }}>
                    {/* Chat header */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        gap: '1rem',
                    }}>
                        <AccountCircleIcon sx={{ fontSize: '5rem' }} />
                        <h1>Χριστίνα Καρκάνη</h1>
                        <Button variant="contained" sx={{ backgroundColor: 'var(--clr-violet)' }}>
                           <p className="button-text">Προβολή Προφίλ</p>
                        </Button>
                    </Box>
                    <Divider sx={{ width: '100%', backgroundColor: 'var(--clr-black)', borderRadius: '1rem', marginBottom: '0.5rem' }}/>
                    {/* Conversation */}
                    <Box sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        marginBottom: '1rem',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Box sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            width: 'fit-content',
                            alignSelf: 'flex-end',
                            marginLeft: '5rem'
                        }}>
                            <p><strong>Καλησπέρα, είδα το προφίλ σας και θα ήθελα να κανονίσουμε ένα ραντεβού γνωριμίας αν είστε διαθέσιμη!</strong></p>
                        </Box>
                        <Box sx={{
                            backgroundColor: 'var(--clr-blue-light)',
                            color: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            width: 'fit-content',
                            alignSelf: 'flex-start',
                            marginRight: '5rem'
                        }}>
                            <p><strong>Εννοείται! Μπορώ αύριο το πρωί αν θέλετε, αλλά μόνο διαδυκτιακά.</strong></p>
                        </Box>
                        <Box sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            width: 'fit-content',
                            alignSelf: 'flex-end',
                            marginLeft: '5rem'
                        }}>
                            <p><strong>Ωραία! Να πούμε 9;</strong></p>
                        </Box>
                        <Box sx={{
                            backgroundColor: 'var(--clr-blue-light)',
                            color: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            width: 'fit-content',
                            alignSelf: 'flex-start',
                            marginRight: '5rem'
                        }}>
                            <p><strong>Ναι μια χαρά είναι.</strong></p>
                        </Box>
                        <Box sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            width: 'fit-content',
                            alignSelf: 'flex-end',
                            marginLeft: '5rem'
                        }}>
                            <p><strong>Τέλεια! Σας έχω στείλει ραντεβού γνωριμίας, όποτε έχετε χρόνο αποδεχθείτε το!</strong></p>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <TextField
                            variant="outlined"
                            placeholder="Μήνυμα..."
                            fullWidth
                            sx={{ marginRight: '1rem', backgroundColor: 'var(--clr-grey-light)', boxShadow: 2 }}
                        />
                        <Button variant="contained" sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                            <SendIcon />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Messages;