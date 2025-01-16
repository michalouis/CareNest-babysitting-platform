import React, { useState, useEffect } from 'react';
import { Box, Pagination, Skeleton } from '@mui/material';

function GenericContainer({ userData, items, itemFunction, itemsPerPage = 4 }) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [items]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <Box sx={{ flexGrow: 1, margin: '1rem' }}>
            <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                {loading ? (
                    Array.from(new Array(itemsPerPage)).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width="100%" height={130} />
                    ))
                ) : (
                    paginatedItems.length > 0 ? (
                        paginatedItems.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {itemFunction(item, userData)}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Δεν βρέθηκαν αποτελέσματα!
                            </p>
                        </Box>
                    )
                )}
            </Box>
            {!loading && paginatedItems.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Pagination count={totalPages} page={page} onChange={handleChange} />
                </Box>
            )}
        </Box>
    );
}

export default GenericContainer;