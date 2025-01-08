import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

function Contracts() {
    const { isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1>Contracts</h1>
        </div>
    );
}

export default Contracts;