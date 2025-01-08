import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Search() {
    const { isLoading } = AuthCheck( true, false, false, 'parent' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Αναζήτηση Νταντάς" />
            <h1>Search</h1>
        </>
    );
}

export default Search;