import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Messages() {
    const { isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Μηνύματα" />
            <h1>Messages</h1>
        </>
    );
}

export default Messages;