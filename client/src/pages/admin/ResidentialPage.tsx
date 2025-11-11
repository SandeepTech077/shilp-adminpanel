import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject, type Project } from '../../api/project/projectApi';
import { getImageUrl } from '../../api/imageUtils';
import { Eye, Edit, Trash2, MapPin, Calendar, Home } from 'lucide-react';

const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResidentialProjects();
  }, []);

  const fetchResidentialProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects('residential');
      
      if (response.success && response.data && response.data.projects) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
        setError(response.message || 'Failed to fetch residential projects');
      }
    } catch (err) {
      setProjects([]);
      setError('Error loading projects');
      console.error('Error fetching residential projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectId: string) => {
    navigate(`/admin/projects/edit/${projectId}`);
  };

  const handleView = (projectId: string) => {
    navigate(`/admin/projects/view/${projectId}`);
  };

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?\n\nThis will permanently delete all project files and data.`)) {
      try {
        const response = await deleteProject(projectId);
        if (response.success) {
          await fetchResidentialProjects();
          alert(`Project "${projectTitle}" deleted successfully!`);
        } else {
          alert(`Failed to delete project: ${response.message}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading residential projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchResidentialProjects}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Residential Projects</h1>
        </div>
        <p className="text-gray-600">
          Manage residential apartment complexes, villas, and housing projects.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-semibold text-blue-700">Total Projects:</span>
          <span className="text-sm font-bold text-blue-900">{projects?.length || 0}</span>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No residential projects found</p>
          <p className="text-gray-400 text-sm mt-2">Create residential projects from the Projects page</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.cardImage && (
                          <img
                            src={getImageUrl(project.cardImage)}
                            alt={project.projectTitle}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              console.error('Failed to load image:', project.cardImage);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3C/svg%3E';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.projectTitle}</div>
                          <div className="text-sm text-gray-500">{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin size={16} className="text-blue-500 mr-2 shrink-0" />
                        <span className="truncate max-w-[200px]">{project.cardLocation || project.shortAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.cardAreaFt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.projectState === 'on-going' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.projectState === 'on-going' ? 'On-Going' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2 shrink-0" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(project._id)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(project._id)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id, project.projectTitle)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentialPage;
