import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="card p-4 shadow-sm w-100 max-w-3xl mx-auto mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4">Privacy Policy</h2>
            <p className="text-muted">Effective Date: [Insert Date]</p>

            <div className="content text-start mt-4">
                <h5>1. Information Collection</h5>
                <p>We collect information including but not limited to your name, contact details, vehicle information (for drivers), and route preferences. This information ensures safe and reliable ride-matching operations.</p>

                <h5>2. Data Security</h5>
                <p>We ensure that all sensitive data is handled with care using necessary standards to prevent unauthorized access. Note that chat messages are only used for ride coordination and not stored indefinitely.</p>

                <h5>3. Usage of Information</h5>
                <p>The collected data is exclusively used to facilitate carpooling connections between the ICBT users. We do not sell or rent data to third parties.</p>

                <h5>4. User Rights</h5>
                <p>You reserve the right to delete or modify your information via the dashboard settings at any given time. If any discrepancies occur, contact support immediately.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
