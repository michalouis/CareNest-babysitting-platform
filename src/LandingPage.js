import React from 'react';
import Header from './components/Header';
import './style.css';     
import './LandingPage.css';
import LearnMoreButtons from './components/LearnMoreButttons';
import SignupButton from './components/SignupButton';

function LandingPage() {
    return (
        <>
            <Header />
            <div className="welcome-box">
                <img className="welcome-logo" src="logo1.png" alt="CareNest Logo" />
                <h2>Η φωλιά της φροντίδας</h2>
                <p>Η πλατφόρμα που παρέχει το gov.gr, συνδέει οικογένειες με έμπειρες νταντάδες στη γειτονιά σας. Είτε αναζητάτε αξιόπιστη φροντίδα παιδιών είτε ψάχνετε για ευκαιρίες εργασίας, είμαστε εδώ για να σας βοηθήσουμε!</p>
                <h1>Μάθετε πως λειτουργεί!</h1>
                <p>Ανακαλύψτε πώς η πλατφόρμα CareNest μπορεί να σας βοηθήσει! Μάθετε περισσότερα για το πώς μπορείτε να συνδέσετε την οικογένειά σας με έμπειρες νταντάδες ή να βρείτε την ιδανική ευκαιρία εργασίας στον χώρο της φροντίδας.</p>
                <LearnMoreButtons />
                <h1>Εγγραφή</h1>
                <p>Η εγγραφή σας στην πλατφόρμα γίνεται εύκολα και γρήγορα μέσω του TaxisNet και διαρκεί λιγότερο από 10 λεπτά! Είτε είστε γονέας είτε νταντά, αποκτήστε πρόσβαση στις υπηρεσίες μας άμεσα και με ασφάλεια.</p>
                <SignupButton />
                <img className="right-aligned-image" src="mom.png" alt="Right Aligned Image" />
                <img className="left-aligned-image" src="mom2.png" alt="Right Aligned Image" />
            </div>
        </>
    );
}

export default LandingPage;