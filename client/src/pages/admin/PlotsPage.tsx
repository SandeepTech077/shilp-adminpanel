import React from 'react';

const PlotsPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Plots Management
          </h1>
          <p className="text-blue-200/80 mb-8">
            Manage land plots, their sizes, locations, and availability status.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Available Plots</h3>
              <div className="space-y-3">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium">Plot #001</h4>
                  <p className="text-green-200/70 text-sm">Size: 1200 sq ft | Location: Sector A</p>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium">Plot #002</h4>
                  <p className="text-green-200/70 text-sm">Size: 1500 sq ft | Location: Sector B</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Sold Plots</h3>
              <div className="space-y-3">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-200 font-medium">Plot #003</h4>
                  <p className="text-red-200/70 text-sm">Size: 1000 sq ft | Location: Sector C</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotsPage;