import React from "react";
import { useFinishProfileRedirect, useLoginRequiredRedirect } from '../../AuthChecks';

function Contracts() {

    useFinishProfileRedirect();
    useLoginRequiredRedirect();

    return (
        <div>
            <h1>Contracts</h1>
        </div>
    );
}

export default Contracts;