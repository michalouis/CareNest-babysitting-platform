import React from "react";
import Breadcrumbs from '../../layout/Breadcrumbs';
import PageTitle from '../../PageTitle';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

export default function ViewSearchResult() {
    const { isLoading } = AuthCheck(true, false, false, 'parent');
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Αγγελία Νταντάς" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αγγελία Νταντάς</h1>
        </>
    );
}