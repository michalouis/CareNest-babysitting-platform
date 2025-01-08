import React from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

function Search() {
    const { isLoading } = AuthCheck( true, false, false, 'parent' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1>Search</h1>
        </div>
    );
}

export default Search;