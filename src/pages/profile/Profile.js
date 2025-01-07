import React from "react";
import { useFinishProfileRedirect, useLoginRequiredRedirect } from '../../AuthChecks';

function Profile() {

    useFinishProfileRedirect();
    useLoginRequiredRedirect();

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}

export default Profile;