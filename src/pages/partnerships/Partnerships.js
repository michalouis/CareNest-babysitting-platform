import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Partnerships() {
    const { isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Συνεργασίες" />
            <h1>Partnerships</h1>
        </>
    );
}

export default Partnerships;