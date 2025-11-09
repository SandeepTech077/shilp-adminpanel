import React from 'react';

const ProjectTreePage: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Project Tree Structure
          </h1>
          <p className="text-blue-200/80 mb-8">
            Hierarchical view of all projects and their relationships.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              {/* Main Project Node */}
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-white font-semibold text-lg">Shilp Admin Projects</span>
              </div>
              
              {/* Project Categories */}
              <div className="ml-6 space-y-3">
                {/* Plots Branch */}
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-200 font-medium">Plots</span>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-200/80 text-sm">Plot #001 - Sector A</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-200/80 text-sm">Plot #002 - Sector B</span>
                  </div>
                </div>
                
                {/* Commercial Branch */}
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-200 font-medium">Commercial</span>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-200/80 text-sm">Office Complex A</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-200/80 text-sm">Retail Shop #101</span>
                  </div>
                </div>
                
                {/* Residential Branch */}
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-200 font-medium">Residential</span>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200/80 text-sm">Apartment A-101</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200/80 text-sm">Villa #V01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTreePage;