import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6247AA', // var(--clr-purple-main)
            hover: '#EDE7F6', // var(--clr-purple-hover)
        },
        secondary: {
            main: '#A06CD5', // var(--clr-purple-light)
        },
        background: {
            default: '#e9e9e9', // var(--light-grey)
            paper: '#FFFFFF', // var(--white)
        },
    },
});

export default theme;