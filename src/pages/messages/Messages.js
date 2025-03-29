import React from "react";
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, TextField, Button, List, ListItem, Divider } from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// chat list dummy data
const conversations = [
    { name: "George Papadopoulos", message: "Good evening, how are you?" },
    { name: "Maria Papakonstantinou", message: "I would like to arrange a meeting." },
    { name: "Nikolaos Dimitriou", message: "Thank you for the reply." },
    { name: "Eleni Karagianni", message: "We will speak soon." },
    { name: "Konstantinos Papageorgiou", message: "Good morning, how are you?" },
    { name: "Anastasia Papadopoulou", message: "I am available for a meeting." },
    { name: "Dimitrios Papadimitriou", message: "I would like to discuss further." },
    { name: "Aikaterini Papadopoulou", message: "Thank you for the update." },
    { name: "Ioannis Papadopoulos", message: "I will contact you soon." },
    { name: "Sophia Papakonstantinou", message: "Good evening, how are you?" }
];

// Messages page (static - to make it dynamic, we need to fetch data from a database with isn't the focus of this project)
function Messages() {
    return (
        <>
            <PageTitle title="CareNest - Messages" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Messages</h1>
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
                                    <p style={{ fontSize: '0.8rem' }}><strong>Last Message:</strong> {msg.message}</p>
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
                        <h1>Christina Karkani</h1>
                        <Button variant="contained" sx={{ backgroundColor: 'var(--clr-violet)' }}>
                           <p className="button-text">View Profile</p>
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
                            <p><strong>Good evening, I saw your profile and would like to arrange a meeting if you're available!</strong></p>
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
                            <p><strong>Of course! I can tomorrow morning if you want, but only online.</strong></p>
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
                            <p><strong>Great! How about 9 AM?</strong></p>
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
                            <p><strong>Yes, that works fine.</strong></p>
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
                            <p><strong>Perfect! I have sent you the meeting invite, please accept it when you have time!</strong></p>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <TextField
                            variant="outlined"
                            placeholder="Message..."
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
