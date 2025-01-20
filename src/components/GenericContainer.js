import React, { useState } from 'react';
import { Box, Pagination, Skeleton } from '@mui/material';

// Component that displays a list of items in a grid layout with pagination
function GenericContainer({ userData, items, itemFunction, itemsPerPage = 4, loading }) {
    const [page, setPage] = useState(1); // Current page of the pagination

    // Handle page change
    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage); // Items to display on the current page
    const totalPages = Math.ceil(items.length / itemsPerPage);  // Total number of pages

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                {/* if loading results show skeleton, else show 4 results per page */}
                {loading ? (
                    Array.from(new Array(itemsPerPage)).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width="100%" height={250} />
                    ))
                ) : (
                    paginatedItems.length > 0 ? ( // If there are items to display, show them
                        paginatedItems.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {itemFunction(item, userData)}
                            </Box>
                        ))
                    ) : (   // If there are no items to display, show message
                        <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Δεν βρέθηκαν αποτελέσματα!
                            </p>
                        </Box>
                    )
                )}
            </Box>
            {/* Change page */}
            {!loading && paginatedItems.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Pagination count={totalPages} page={page} onChange={handleChange} />
                </Box>
            )}
        </Box>
    );
}

export default GenericContainer;