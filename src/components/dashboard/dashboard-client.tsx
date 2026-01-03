'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Classroom } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, CheckCircle2, XCircle, Users, Square } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  total: number;
  available: number;
  occupied: number;
  totalCapacity: number;
  averageSize: number;
}

const StatCard = ({ title, value, icon: Icon, loading }: { title: string; value: string | number; icon: React.ElementType; loading: boolean }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
            <Skeleton className="h-8 w-24" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
};

export function DashboardClient() {
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, occupied: 0, totalCapacity: 0, averageSize: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'classrooms'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classrooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
      const total = classrooms.length;
      const available = classrooms.filter(c => c.status === 'Available').length;
      const occupied = total - available;
      const totalCapacity = classrooms.reduce((sum, c) => sum + (c.capacity || 0), 0);
      const averageSize = total > 0 ? Math.round(classrooms.reduce((sum, c) => sum + (c.size || 0), 0) / total) : 0;
      
      setStats({ total, available, occupied, totalCapacity, averageSize });
      setLoading(false);
    }, (error) => {
      console.error("Error fetching classrooms:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard title="Total Classrooms" value={stats.total} icon={School} loading={loading} />
      <StatCard title="Available" value={stats.available} icon={CheckCircle2} loading={loading} />
      <StatCard title="Occupied" value={stats.occupied} icon={XCircle} loading={loading} />
      <StatCard title="Total Capacity" value={stats.totalCapacity.toLocaleString()} icon={Users} loading={loading} />
      <StatCard title="Avg. Size (sq. ft)" value={stats.averageSize.toLocaleString()} icon={Square} loading={loading} />
    </div>
  );
}
