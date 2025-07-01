import { Suspense } from 'react';
import ProjectsGrid from '@/components/dashboards/ProjectsGrid';
import { AuthGuard } from '@/components/common/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectsGrid />
        </Suspense>
      </div>
    </AuthGuard>
  );
}