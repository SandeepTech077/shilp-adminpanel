import type { RouteObject } from 'react-router';
import BannerPage from '../pages/admin/BannerPage';
import ProjectsPage from '../pages/admin/ProjectsPage';
import PlotsPage from '../pages/admin/PlotsPage';
import CommercialPage from '../pages/admin/CommercialPage';
import ResidentialPage from '../pages/admin/ResidentialPage';
import EditProjectPage from '../pages/admin/EditProjectPage';
import ViewProjectPage from '../pages/admin/ViewProjectPage';
import ProjectTreePage from '../pages/admin/ProjectTreePage';
import BlogsPage from '../pages/admin/BlogsPage';
import RouteGuard from '../components/RouteGuard';
import Layout from '../components/Layout';

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Banner Management">
          <BannerPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Projects">
          <ProjectsPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/view/:id",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="View Project">
          <ViewProjectPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/edit/:id",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Edit Project">
          <EditProjectPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/plots",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Plots">
          <PlotsPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/commercial",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Commercial Projects">
          <CommercialPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/residential",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Residential Projects">
          <ResidentialPage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/project-tree",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Project Tree">
          <ProjectTreePage />
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/blogs",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Blogs">
          <BlogsPage />
        </Layout>
      </RouteGuard>
    ),
  },
];

export default adminRoutes;