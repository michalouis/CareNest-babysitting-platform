import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Applications() {
    const { isLoading } = AuthCheck( true, false, false, 'parent' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Αιτήσεις" />
            <h1>Applications</h1>
        </>
    );
}

export default Applications;