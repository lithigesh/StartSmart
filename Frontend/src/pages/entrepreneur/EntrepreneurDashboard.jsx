import React from 'react';
import MyRegisteredIdeathons from '../../components/MyRegisteredIdeathons';

const EntrepreneurDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Entrepreneur Dashboard</h1>
            
            <div className="grid gap-8">
                {/* My Registered Ideathons Section */}
                <section>
                    <MyRegisteredIdeathons />
                </section>

                {/* Add other sections here as needed */}
            </div>
        </div>
    );
};

export default EntrepreneurDashboard;