import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Meetings() {
    const { isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Ραντεβού" />
            <h1>Meetings</h1>
        </>
    );
}

export default Meetings;