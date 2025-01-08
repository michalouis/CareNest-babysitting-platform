import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

function Applications() {
    const { isLoading } = AuthCheck( true, false, false, 'parent' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1>Applications</h1>
        </div>
    );
}

export default Applications;