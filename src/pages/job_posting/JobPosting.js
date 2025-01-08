import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function JobPosting() {
    const { isLoading } = AuthCheck( true, false, false, 'nanny' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>  
            <PageTitle title="CareNest - Αγγελία" />
            <h1>Job Posting</h1>
        </>
    );
}

export default JobPosting;