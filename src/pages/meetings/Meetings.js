import React from "react";
import { useFinishProfileRedirect, useLoginRequiredRedirect } from '../../AuthChecks';

function Meetings() {

    useFinishProfileRedirect();
    useLoginRequiredRedirect();

    return (
        <div>
            <h1>Meetings</h1>
        </div>
    );
}

export default Meetings;