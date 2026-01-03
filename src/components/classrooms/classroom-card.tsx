import Link from 'next/link';
import Image from 'next/image';
import type { Classroom } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Square, Building, Tag } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ClassroomCardProps {
  classroom: Classroom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
    const placeholderImage = PlaceHolderImages.find(img => img.id === classroom.imageUrl) || PlaceHolderImages[0];

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <Link href={`/classrooms/${classroom.id}`} className="block">
                <div className="relative h-48 w-full">
                    <Image
                        src={placeholderImage?.imageUrl || "https://picsum.photos/seed/placeholder/800/600"}
                        alt={placeholderImage?.description || classroom.type}
                        data-ai-hint={placeholderImage?.imageHint || 'classroom interior'}
                        fill
                        className="object-cover"
                    />
                     <div className="absolute top-2 right-2">
                        <StatusBadge status={classroom.status} />
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{classroom.building} - {classroom.roomNumber}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{classroom.capacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        <span>{classroom.size} sq. ft</span>
                    </div>
                     <div className="flex items-center gap-2 col-span-2">
                        <Tag className="h-4 w-4" />
                        <Badge variant="secondary">{classroom.type}</Badge>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
