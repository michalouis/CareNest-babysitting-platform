import React from "react";
import { useFinishProfileRedirect, useLoginRequiredRedirect } from '../../AuthChecks';

function Applications() {

    useFinishProfileRedirect();
    useLoginRequiredRedirect();

    return (
        <div>
            <h1>Applications</h1>
        </div>
    );
}

export default Applications;