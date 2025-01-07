import React from "react";
import { useFinishProfileRedirect, useLoginRequiredRedirect } from '../../AuthChecks';

function Search() {

    useFinishProfileRedirect();
    useLoginRequiredRedirect();

    return (
        <div>
            <h1>Search</h1>
        </div>
    );
}

export default Search;