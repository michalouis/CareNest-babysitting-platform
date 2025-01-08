import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Contracts() {
    const { isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Συμφωνητικά" />
            <h1>Contracts</h1>
        </>
    );
}

export default Contracts;