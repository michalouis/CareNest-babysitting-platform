import { useEffect } from 'react';

// Set the page title
function PageTitle({ title }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}

export default PageTitle;