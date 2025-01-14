import React from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import PageTitle from '../../PageTitle';

export default function Favorites() {
    return (
        <>
            <PageTitle title="CareNest - Αγαπημένα" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αγαπημένα</h1>
        </>
    );
}