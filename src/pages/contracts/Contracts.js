import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import FilterBox from '../../components/FilterBox';
import GenericContainer from '../../components/GenericContainer';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TodayIcon from '@mui/icons-material/Today';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';

// filter options
const checkboxOptions = [
    { label: "Requires Signature", value: "needSignature" },
    { label: "Requires Partner's Signature", value: "needSignaturePartner" },
    { label: "Signed", value: "signed" }
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Contract item component
function ContractItem({ contract, userData }) {
    const navigate = useNavigate();

    const getContractStateColor = (signedDocParent, signedDocNanny) => {    // returns the color of the contract state
        if (signedDocParent && signedDocNanny) return 'var(--clr-darker-green)';
        return 'var(--clr-orange)';
    };

    // show some info about the contract
    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/CareNest-babysitting-platform/contracts/view-contract/${contract.contractId}`)}>
                <CardContent>
                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Status:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: getContractStateColor(contract.signedDocParent, contract.signedDocNanny),
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {contract.signedDocParent && contract.signedDocNanny ? 'Signed' :
                            (userData.role === 'parent' && contract.signedDocParent) || (userData.role === 'nanny' && contract.signedDocNanny) ? 
                            'Requires Partner\'s Signature' : 'Requires Signature'}
                        </h2>
                    </Box>
                    {/* Partner name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <h2 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                            {userData.role === 'parent' ? 'Nanny: ' : 'Parent:'}
                        </h2>
                        <p style={{ fontSize: '1.3rem' }}>
                            {userData.role === 'parent' ? contract.nannyName : contract.parentName}
                        </p>
                    </Box>
                    {/* Duration Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>From: </p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[contract.fromDate.month]} ${contract.fromDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InsertInvitationIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>To: </p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[contract.toDate.month]} ${contract.toDate.year}`}</p>
                    </Box>
                    {/* Timestamp */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <ReceiptLongIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Issue Date: </strong> {new Date(contract.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function Contracts() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const [filters, setFilters] = useState({
        needSignature: true,
        needSignaturePartner: true,
        signed: true,
        fromDate: {
            day: '',
            month: '',
            year: ''
        },
        toDate: {
            day: '',
            month: '',
            year: ''
        },
        newerFirst: true,
    });
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                // Fetch contracts
                setLoading(true);
                const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const contractIds = userData.contracts || [];
                    const contractsData = [];

                    // Fetch contracts user is related to
                    for (const contractId of contractIds) {
                        const contractDocRef = doc(FIREBASE_DB, 'contracts', contractId);
                        const contractDoc = await getDoc(contractDocRef);
                        if (contractDoc.exists()) {
                            const contractData = contractDoc.data();
                            if (contractData.nannyId === userData.uid || contractData.parentId === userData.uid) {
                                contractsData.push(contractData);
                            }
                        } else {
                            console.log('No such contract:', contractId);
                        }
                    }
                
                
                    console.log('Contracts data:', contractsData);
                

                    console.log('Contracts data:', contractsData);
                
                    // Filter contracts based on the filters
                    const filteredContracts = contractsData.filter(contract => {
                        const contractDate = new Date(contract.timestamp);
                        const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                        const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);

                        // Check if the contract is within the date range
                        const isWithinDateRange = (!filters.fromDate.year || contractDate >= fromDate) &&
                                                  (!filters.toDate.year || contractDate <= toDate);

                        // Check if the contract status matches the filters
                        let isStatusMatch = false;
                        if (userData.role === 'parent') {
                            isStatusMatch = (filters.needSignature && !contract.signedDocParent) ||
                                            (filters.needSignaturePartner && !contract.signedDocNanny) ||
                                            (filters.signed && contract.signedDocParent && contract.signedDocNanny);
                        } else if (userData.role === 'nanny') {
                            isStatusMatch = (filters.needSignature && !contract.signedDocNanny) ||
                                            (filters.needSignaturePartner && !contract.signedDocParent) ||
                                            (filters.signed && contract.signedDocParent && contract.signedDocNanny);
                        }

                        // for special case where both user and parent haven't signed  
                        if (!contract.signedDocParent && !contract.signedDocNanny && !filters.needSignature) {
                            isStatusMatch = false;
                        }

                        return isWithinDateRange && isStatusMatch;
                    });
                
                
                    console.log('Filtered contracts:', filteredContracts);
                
                    // Sort contracts based on the timestamp

                    console.log('Filtered contracts:', filteredContracts);
                
                    // Sort contracts based on the timestamp
                    const sortedContracts = filteredContracts.sort((a, b) => {
                        const dateA = new Date(a.timestamp);
                        const dateB = new Date(b.timestamp);
                        return filters.newerFirst ? dateB - dateA : dateA - dateB;
                    });
                
                
                    console.log('Sorted contracts:', sortedContracts);
                

                    console.log('Sorted contracts:', sortedContracts);
                
                    setContracts(sortedContracts);
                } else {
                    console.error('No such user:', userData.uid);
                }
            } catch (error) {
                console.error("Error fetching contracts:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchContracts();
        }
    }, [userData, filters]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {userData && (
                <>
                    <PageTitle title="CareNest - Contracts" />
                    <Breadcrumbs />
                    <h1 style={{ marginLeft: '1rem' }}>Contracts</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                        Here you can see all the contracts you have signed with your partners.
                    </p>
                    
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flexWrap: { xs: 'nowrap', md: 'wrap' },
                        justifyContent: 'space-between',
                        gap: '1rem',
                        margin: '1rem'
                    }}>
                        <FilterBox
                            filters={filters}
                            setFilters={setFilters}
                            checkboxOptions={checkboxOptions}
                        />
                        {/* Container to show contracts in pages */}
                        <GenericContainer userData={userData} items={contracts} itemFunction={(item) => <ContractItem contract={item} userData={userData} />} loading={loading} />
                    </Box>
                </>
            )}
        </>
    );
}

export default Contracts;