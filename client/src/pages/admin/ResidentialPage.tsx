import React from 'react';

const ResidentialPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Residential Properties
          </h1>
          <p className="text-blue-200/80 mb-8">
            Manage residential properties including apartments, villas, and housing complexes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Apartments</h3>
              <div className="space-y-3">
                <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-3">
                  <h4 className="text-pink-200 font-medium">Apartment A-101</h4>
                  <p className="text-pink-200/70 text-sm">2BHK | 1200 sq ft | Tower A</p>
                </div>
                <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-3">
                  <h4 className="text-pink-200 font-medium">Apartment B-205</h4>
                  <p className="text-pink-200/70 text-sm">3BHK | 1500 sq ft | Tower B</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Villas</h3>
              <div className="space-y-3">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                  <h4 className="text-emerald-200 font-medium">Villa #V01</h4>
                  <p className="text-emerald-200/70 text-sm">4BHK | 2500 sq ft | Premium Zone</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Housing Complex</h3>
              <div className="space-y-3">
                <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-3">
                  <h4 className="text-teal-200 font-medium">Complex #HC01</h4>
                  <p className="text-teal-200/70 text-sm">50 Units | Family Housing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentialPage;