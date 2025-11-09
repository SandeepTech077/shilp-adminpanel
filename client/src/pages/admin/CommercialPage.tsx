import React from 'react';

const CommercialPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Commercial Properties
          </h1>
          <p className="text-blue-200/80 mb-8">
            Manage commercial properties including offices, shops, and business complexes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Office Spaces</h3>
              <div className="space-y-3">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                  <h4 className="text-blue-200 font-medium">Office Complex A</h4>
                  <p className="text-blue-200/70 text-sm">Area: 5000 sq ft | Floor: 3rd</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Retail Shops</h3>
              <div className="space-y-3">
                <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3">
                  <h4 className="text-indigo-200 font-medium">Shop #101</h4>
                  <p className="text-indigo-200/70 text-sm">Area: 800 sq ft | Ground Floor</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Warehouses</h3>
              <div className="space-y-3">
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                  <h4 className="text-purple-200 font-medium">Warehouse #W01</h4>
                  <p className="text-purple-200/70 text-sm">Area: 15000 sq ft | Industrial Zone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;