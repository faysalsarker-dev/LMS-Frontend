import { motion } from 'framer-motion';
import { Card, } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useGetAllCategorysQuery } from '@/redux/features/category/category.api';
import type { ICategory } from '@/interface';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton Card
const LearningPathCardSkeleton = () => {
  return (
    <Card className="p-6 h-full animate-pulse border-2 ">
      <Skeleton className="w-14 h-14 rounded-xl  mb-4" />
      <Skeleton className="h-6 w-3/4  rounded mb-2" />
      <Skeleton className="h-4 w-full  rounded mb-4" />
      <Skeleton className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-4 w-1/4  rounded" />
        <Skeleton className="w-5 h-5  rounded" />
      </Skeleton>
    </Card>
  );
};

const LearningPaths = () => {
  const { data, isLoading } = useGetAllCategorysQuery({});
  const categories = data?.data as ICategory[];


  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're advancing your career or exploring the world, we have the perfect path for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LearningPathCardSkeleton />
                </motion.div>
              ))
            : categories?.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/courses?category=${path._id}`}>
                  <Card className="p-6 h-full hover-lift cursor-pointer group border-2 hover:border-primary/50">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <img className="w-12 h-12" src={path.thumbnail!} alt={path.title} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">{path.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">{path.totalCourse} courses</span>
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                  </Link>
                  
                </motion.div>
              ))}
        </div>

     
      </div>
    </section>
  );
};

export default LearningPaths;
