import React, { useState, useEffect } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import FilterBox from '../meetings/FilterBox';
import GenericContainer from '../meetings/GenericContainer';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TodayIcon from '@mui/icons-material/Today';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';

const checkboxOptions = [
    { label: "Απαιτεί Υπογραφή", value: "needSignature" },
    { label: "Απαιτεί Υπογραφή Συνεργάτη", value: "needSignaturePartner" },
    { label: "Υπογεγραμμένο", value: "signed" }
];

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

function ContractItem({ contract, userData }) {
    const navigate = useNavigate();

    const getContractStateColor = (signedDocParent, signedDocNanny) => {
        if (signedDocParent && signedDocNanny) return 'var(--clr-darker-green)';
        return 'var(--clr-orange)';
    };

    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardActionArea onClick={() => navigate(`/contracts/view-contract?contractId=${contract.contractId}`)}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Κατάσταση:</h1>
                        <h2 style={{
                            fontWeight: 'bold',
                            padding: '0.3rem 0.7rem',
                            backgroundColor: getContractStateColor(contract.signedDocParent, contract.signedDocNanny),
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block'
                        }}>
                            {contract.signedDocParent && contract.signedDocNanny ? 'Υπογεγραμμένο' :
                            (userData.role === 'parent' && contract.signedDocParent) || (userData.role === 'nanny' && contract.signedDocNanny) ? 
                            'Απαιτεί Υπογραφή Συνεργάτη' : 'Απαιτεί Υπογραφή'}
                        </h2>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <PersonIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <h2 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                            {userData.role === 'parent' ? 'Νταντά:' : 'Γονέας:'}
                        </h2>
                        <p style={{ fontSize: '1.3rem' }}>
                            {userData.role === 'parent' ? contract.nannyName : contract.parentName}
                        </p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>Από:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[contract.fromDate.month]} ${contract.fromDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InsertInvitationIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginRight: '0.5rem' }}>Μέχρι:</p>
                        <p style={{ fontSize: '1.3rem' }}>{`${months[contract.toDate.month]} ${contract.toDate.year}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <UpdateIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Τελευταία ενημέρωση:</strong> {new Date(contract.timestamp).toLocaleDateString('el-GR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                setLoading(true);
                const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const contractIds = userData.contracts || [];
                    const contractsData = [];

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
                
                    const filteredContracts = contractsData.filter(contract => {
                        const contractDate = new Date(contract.timestamp);
                        const fromDate = new Date(filters.fromDate.year, filters.fromDate.month, filters.fromDate.day);
                        const toDate = new Date(filters.toDate.year, filters.toDate.month, filters.toDate.day);

                        const isWithinDateRange = (!filters.fromDate.year || contractDate >= fromDate) &&
                                                  (!filters.toDate.year || contractDate <= toDate);

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

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {userData && (
                <>
                    <PageTitle title="CareNest - Συμφωνητικά" />
                    <Breadcrumbs />
                    <h1 style={{ marginLeft: '1rem' }}>Συμφωνητικά</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                        Εδώ μπορείτε να δείτε όλα τα συμφωνητικά που έχετε υπογράψει με τους συνεργάτες σας.
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
                        <GenericContainer userData={userData} items={contracts} itemFunction={(item) => <ContractItem contract={item} userData={userData} />} loading={loading} />
                    </Box>
                </>
            )}
        </>
    );
}

export default Contracts;