import { MainLayout } from '@/components/layout/main-layout';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground mb-6">
          Dashboard
        </h1>
        <DashboardClient />
      </div>
    </MainLayout>
  );
}
