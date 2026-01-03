
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ClassroomStatus, ClassroomType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const classroomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  building: z.string().min(1, 'Building is required'),
  floor: z.coerce.number().int().min(0, 'Floor must be a positive number'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  size: z.coerce.number().int().min(1, 'Size must be a positive number'),
  type: z.enum(['Lecture Hall', 'Lab', 'Seminar Room']),
  status: z.enum(['Available', 'Occupied']),
  imageUrl: z.string().optional(),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

function AdminPageClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ClassroomFormValues>({
        resolver: zodResolver(classroomSchema),
        defaultValues: {
            roomNumber: '',
            building: '',
            floor: 1,
            capacity: 20,
            size: 500,
            type: 'Lecture Hall',
            status: 'Available',
            imageUrl: PlaceHolderImages[0].id,
        },
    });

    const onSubmit = async (data: ClassroomFormValues) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'classrooms'), {
                ...data,
                lastUpdated: serverTimestamp(),
            });
            toast({
                title: 'Classroom Added',
                description: `Classroom ${data.building} ${data.roomNumber} has been successfully added.`,
            });
            form.reset();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Could not add classroom.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground mb-6">
          Admin Panel
        </h1>
        <Card>
            <CardHeader>
                <CardTitle>Add New Classroom</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField control={form.control} name="building" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Building</FormLabel>
                                <FormControl><Input placeholder="e.g. Science Complex" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="roomNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Number</FormLabel>
                                <FormControl><Input placeholder="e.g. 101" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="floor" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Floor</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="size" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size (sq. ft)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select classroom type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                                            <SelectItem value="Lab">Lab</SelectItem>
                                            <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Occupied">Occupied</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select an image" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {PlaceHolderImages.map(image => (
                                        <SelectItem key={image.id} value={image.id}>
                                        {image.description}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="md:col-span-2 lg:col-span-3">
                            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Classroom
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    );
}

export default function AdminPage() {
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && userProfile?.role !== 'admin') {
            router.replace('/dashboard');
        }
    }, [userProfile, loading, router]);

    if (loading || !userProfile) {
        return (
            <MainLayout>
                <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }
    
    if (userProfile.role !== 'admin') {
        return (
            <MainLayout>
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center text-center py-20">
                         <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                        <h1 className="text-3xl font-bold">Access Denied</h1>
                        <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
                        <Button onClick={() => router.push('/dashboard')} className="mt-6">Go to Dashboard</Button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <AdminPageClient />
        </MainLayout>
    );
}
