import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Clock, Edit, Home, Layers, TrendingUp, User } from 'lucide-react';
import { useGetPracticeByIdQuery } from '@/hooks/usePracticeApi';
import { format } from 'date-fns';

const ViewPracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: practice, isLoading } = useGetPracticeByIdQuery(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Practice not found</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard" className="flex items-center gap-1">
                  <Home className="h-4 w-4" /> Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/admin/practices">Practices</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{practice.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{practice.title}</h1>
            <p className="text-muted-foreground mt-1">{practice.description}</p>
          </div>
          <Button asChild><Link to={`/admin/practices/${practice._id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card><CardContent className="pt-6 flex items-center gap-4"><Layers className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{practice.totalItems}</p></div></CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-accent" /><div><p className="text-sm text-muted-foreground">Usage Count</p><p className="text-2xl font-bold">{practice.usageCount}</p></div></CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4"><Clock className="h-8 w-8 text-warning" /><div><p className="text-sm text-muted-foreground">Est. Time</p><p className="text-2xl font-bold">{practice.estimatedTime || 'N/A'}</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Practice Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {practice.items.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border bg-muted/30">
                <p className="font-medium">{item.content}</p>
                {item.pronunciation && <p className="text-sm text-muted-foreground">/{item.pronunciation}/</p>}
                {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Badge>{practice.type}</Badge>
          <Badge variant="outline">{practice.difficulty}</Badge>
          {practice.category && <Badge variant="secondary">{practice.category.name}</Badge>}
          <Badge variant={practice.isActive ? 'default' : 'destructive'}>{practice.isActive ? 'Active' : 'Inactive'}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">Created: {format(new Date(practice.createdAt), 'PPP')}</p>
      </div>
    </motion.div>
  );
};

export default ViewPracticePage;
