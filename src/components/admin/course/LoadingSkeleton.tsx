import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const LoadingSkeleton = () => {
  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        ease: "linear" as const,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Hero Skeleton */}
          <Card className="overflow-hidden bg-gradient-card border-glass">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-8 lg:p-12 space-y-6">
                  <motion.div
                    className="h-6 w-32 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                    variants={shimmer}
                    animate="animate"
                  />
                  <motion.div
                    className="h-12 w-3/4 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                    variants={shimmer}
                    animate="animate"
                  />
                  <motion.div
                    className="h-24 w-full rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                    variants={shimmer}
                    animate="animate"
                  />
                  <div className="flex gap-4">
                    <motion.div
                      className="h-10 w-32 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      variants={shimmer}
                      animate="animate"
                    />
                    <motion.div
                      className="h-10 w-32 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      variants={shimmer}
                      animate="animate"
                    />
                  </div>
                </div>
                <motion.div
                  className="lg:col-span-2 h-96 lg:h-auto bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                  variants={shimmer}
                  animate="animate"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gradient-card border-glass">
                  <CardContent className="p-6 space-y-4">
                    <motion.div
                      className="h-6 w-48 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      variants={shimmer}
                      animate="animate"
                    />
                    <motion.div
                      className="h-32 w-full rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      variants={shimmer}
                      animate="animate"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-glass">
                <CardContent className="p-0">
                  <motion.div
                    className="h-48 w-full bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                    variants={shimmer}
                    animate="animate"
                  />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="h-12 w-full rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      variants={shimmer}
                      animate="animate"
                    />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        className="h-6 w-full rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
                        style={{
                          backgroundSize: "200% 100%",
                        }}
                        variants={shimmer}
                        animate="animate"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
