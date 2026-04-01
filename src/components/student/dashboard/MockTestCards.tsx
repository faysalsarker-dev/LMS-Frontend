import { motion } from "framer-motion";
import {
  Target,
  ClipboardList,
  PenTool,
  Mic,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type {
  IUserProgressData,
  IMockTestSection,
} from "@/interface/student.types";

interface MockTestCardsProps {
  progress: IUserProgressData | undefined;
  isLoading?: boolean;
}

const SECTIONS = ["listening", "reading", "writing", "speaking"];

/* ---------------- Icons ---------------- */
const getIconForSection = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("listening")) return Headphones;
  if (n.includes("reading")) return ClipboardList;
  if (n.includes("writing")) return PenTool;
  if (n.includes("speaking")) return Mic;
  return Target;
};

/* ---------------- Score Logic ---------------- */
const getScore = (section?: IMockTestSection) => {
  if (!section) return "Not Attempted";

  if (section.isAutoGraded) {
    return section.autoGradedScore ?? "Under Review";
  }

  if (typeof section.adminScore === "number") {
    return section.adminScore;
  }

  return "Under Review";
};

/* ---------------- Color Logic ---------------- */
const getScoreColor = (score: number, total: number) => {
  const percent = (score / total) * 100;

  if (percent >= 75) return "text-green-600";
  if (percent >= 40) return "text-yellow-600";
  return "text-red-600";
};

const getProgressColor = (score: number, total: number) => {
  const percent = (score / total) * 100;

  if (percent >= 75) return "bg-green-500";
  if (percent >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

/* ---------------- Component ---------------- */
const MockTestCards = ({ progress, isLoading }: MockTestCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className="h-[110px] rounded-2xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  const latestSubmission =
    progress?.mockTestStats?.submissions?.[0];

  const sectionMap = new Map(
    latestSubmission?.sections?.map((s) => [
      s.name.toLowerCase(),
      s,
    ]) || []
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Mock Test Scores</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTIONS.map((sectionName, index) => {
          const section = sectionMap.get(sectionName);
          const Icon = getIconForSection(sectionName);
          const score = getScore(section);

          const isNumber = typeof score === "number";
          const total = section?.totalMarks || 0;

          const percent =
            isNumber && total
              ? Math.round((score / total) * 100)
              : 0;

          return (
            <motion.div
              key={sectionName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full rounded-2xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 space-y-4">
                  {/* Top */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {sectionName}
                      </p>

                      <p
                        className={`text-2xl font-semibold tracking-tight ${
                          isNumber
                            ? getScoreColor(score as number, total)
                            : "text-muted-foreground"
                        }`}
                      >
                        {isNumber ? `${score}/${total}` : score}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  {isNumber && total > 0 && (
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`h-full ${getProgressColor(
                            score as number,
                            total
                          )}`}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground text-right">
                        {percent}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MockTestCards;