import React from "react";
import { useFinishProfileRedirect, useNotNannyRedirect } from '../../AuthChecks';

function JobPosting() {

    useFinishProfileRedirect();
    useNotNannyRedirect();

    return (
        <div>
            <h1>Job Posting</h1>
        </div>
    );
}

export default JobPosting;