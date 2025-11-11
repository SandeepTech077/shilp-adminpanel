import React from 'react';

const BlogsPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Blogs Management
          </h1>
          <p className="text-blue-200/80 mb-8">
            Create and manage blog posts for your real estate website.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Blogs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Blogs</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Top 10 Investment Tips for Real Estate</h4>
                  <p className="text-blue-200/70 text-sm mb-2">
                    Learn the best strategies for real estate investment in 2025...
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-200/60">
                    <span>Published: Nov 5, 2025</span>
                    <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded">Published</span>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Commercial Property Market Trends</h4>
                  <p className="text-blue-200/70 text-sm mb-2">
                    Analysis of current commercial property market trends...
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-200/60">
                    <span>Published: Nov 3, 2025</span>
                    <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded">Published</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Draft Blogs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Draft Blogs</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Residential Property Buying Guide</h4>
                  <p className="text-blue-200/70 text-sm mb-2">
                    Complete guide for first-time home buyers...
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-200/60">
                    <span>Last edited: Nov 7, 2025</span>
                    <span className="bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded">Draft</span>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Plot Development Process</h4>
                  <p className="text-blue-200/70 text-sm mb-2">
                    Step-by-step guide to plot development...
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-200/60">
                    <span>Last edited: Nov 6, 2025</span>
                    <span className="bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add New Blog Button */}
          <div className="mt-8 text-center">
            <button className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Create New Blog Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
