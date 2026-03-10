import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { IMockTest } from "@/interface/mockTest.types";

interface MockTestCardProps {
    test: IMockTest;
}

export const MockTestCard = ({ test }: MockTestCardProps) => {
    return (
        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm">
            <div className="relative aspect-video overflow-hidden">
                {test.thumbnail ? (
                    <img
                        src={test.thumbnail}
                        alt={test.title}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Badge className="bg-primary text-white border-none">
                        {test.course?.title || "Course Mock Test"}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5">
                <h3 className="text-xl font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {test.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    This mock test is designed to evaluate your skills in all 4 sections based on the {test.course?.title} curriculum.
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button asChild className="w-full rounded-xl group/btn" variant="outline">
                    <Link to={`/practice/mock-test/${test.slug}`} className="flex items-center justify-center gap-2">
                        Start Mock Test
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
