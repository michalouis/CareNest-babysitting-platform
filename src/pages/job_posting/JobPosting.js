import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

function JobPosting() {
    const { isLoading } = AuthCheck( true, false, false, 'nanny' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1>Job Posting</h1>
        </div>
    );
}

export default JobPosting;