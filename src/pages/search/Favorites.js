import React from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import PageTitle from '../../PageTitle';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading'

export default function Favorites() {
    const { isLoading } = AuthCheck(true, false, false, 'parent');

    // const navigate = useNavigate();
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Αγαπημένα" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αγαπημένα</h1>
        </>
    );
}