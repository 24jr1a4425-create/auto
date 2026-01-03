'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Classroom } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassroomCard } from './classroom-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Building, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ClassroomListClient() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ building: string; status: string; capacity: string }>({
    building: 'all',
    status: 'all',
    capacity: 'all',
  });

  useEffect(() => {
    const q = query(collection(db, 'classrooms'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classroomsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Classroom));
      setClassrooms(classroomsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching classrooms:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const buildings = useMemo(() => ['all', ...Array.from(new Set(classrooms.map(c => c.building)))], [classrooms]);

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(classroom => {
      const searchMatch = classroom.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          classroom.building.toLowerCase().includes(searchTerm.toLowerCase());
      const buildingMatch = filters.building === 'all' || classroom.building === filters.building;
      const statusMatch = filters.status === 'all' || classroom.status === filters.status;
      const capacityMatch = filters.capacity === 'all' || classroom.capacity >= parseInt(filters.capacity, 10);

      return searchMatch && buildingMatch && statusMatch && capacityMatch;
    });
  }, [classrooms, searchTerm, filters]);
  
  const handleFilterChange = (filterName: 'building' | 'status' | 'capacity', value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by room or building..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        <Select value={filters.building} onValueChange={(value) => handleFilterChange('building', value)}>
            <SelectTrigger>
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by building..." />
                </div>
            </SelectTrigger>
            <SelectContent>
                {buildings.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'All Buildings' : b}</SelectItem>)}
            </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-4">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Status" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                </SelectContent>
            </Select>
            <Select value={filters.capacity} onValueChange={(value) => handleFilterChange('capacity', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Capacity</SelectItem>
                    <SelectItem value="20">20+</SelectItem>
                    <SelectItem value="50">50+</SelectItem>
                    <SelectItem value="100">100+</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : filteredClassrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClassrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No classrooms found</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
