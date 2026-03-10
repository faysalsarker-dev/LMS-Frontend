import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock, Play } from "lucide-react";
import type { SectionName, IMockTestSection } from "@/interface/mockTest.types";
import { useNavigate } from "react-router";

interface MockTestStepperProps {
    sections: {
        listening?: string | IMockTestSection;
        reading?: string | IMockTestSection;
        writing?: string | IMockTestSection;
        speaking?: string | IMockTestSection;
    };
    completedSections: SectionName[];
}

export const MockTestStepper = ({ sections, completedSections }: MockTestStepperProps) => {
    const navigate = useNavigate();

    const steps: { name: SectionName; label: string }[] = [
        { name: "listening", label: "Part 1: Listening" },
        { name: "reading", label: "Part 2: Reading" },
        { name: "writing", label: "Part 3: Writing" },
        { name: "speaking", label: "Part 4: Speaking" },
    ];

    const canStartSection = (index: number) => {
        if (index === 0) return true;
        const previousSection = steps[index - 1].name;
        return completedSections.includes(previousSection);
    };

    const isCompleted = (name: SectionName) => completedSections.includes(name);

    return (
        <div className="space-y-4">
            {steps.map((step, index) => {
                const sectionData = sections[step.name] as IMockTestSection | undefined;
                const isLocked = !canStartSection(index);
                const isDone = isCompleted(step.name);
                const isActive = canStartSection(index) && !isDone;

                return (
                    <div
                        key={step.name}
                        className={`relative flex items-center gap-6 p-6 rounded-3xl border-2 transition-all duration-300 ${isActive
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                            : isDone
                                ? "border-green-500/20 bg-green-500/5"
                                : "border-muted bg-muted/20 opacity-70"
                            }`}
                    >
                        {/* Step Icon */}
                        <div className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center ${isActive ? "bg-primary text-white" : isDone ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                            }`}>
                            {isDone ? (
                                <CheckCircle2 className="h-6 w-6" />
                            ) : isLocked ? (
                                <Lock className="h-6 w-6" />
                            ) : (
                                <span className="text-lg font-bold">{index + 1}</span>
                            )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-lg font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                                    {step.label}
                                </h4>
                                {isDone && (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">
                                        Completed
                                    </Badge>
                                )}
                                {isLocked && (
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
                                        Locked
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                {sectionData?.timeLimit ? `${sectionData.timeLimit} Minutes` : "Time limit not set"} •
                                {sectionData?.questions?.length || 0} Questions
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                            {isActive ? (
                                <Button
                                    onClick={() => navigate(`/practice/mock-test/section/${(sectionData as any)?._id}`)}
                                    className="rounded-xl px-6 group"
                                >
                                    Start Test
                                    <Play className="ml-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                                </Button>
                            ) : isDone ? (
                                <div className="text-green-500 font-medium flex items-center gap-1">
                                    Done
                                </div>
                            ) : (
                                <Circle className="h-6 w-6 text-muted-foreground/30" />
                            )}
                        </div>

                        {/* Connecting Line (except last) */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[39px] top-[72px] bottom-[-24px] w-0.5 bg-muted -z-10" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
