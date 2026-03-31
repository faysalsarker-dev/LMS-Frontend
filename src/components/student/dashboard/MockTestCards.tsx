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

const getIconForSection = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("listening")) return Headphones;
  if (n.includes("reading")) return ClipboardList;
  if (n.includes("writing")) return PenTool;
  if (n.includes("speaking")) return Mic;
  return Target;
};

const getScore = (section?: IMockTestSection) => {
  if (!section) return "Not Attempted";

  if (section.isAutoGraded) {
    return section.autoGradedScore ?? "Under Review";
  }

  if (typeof section.adminScore === "number" && section.adminScore > 0) {
    return section.adminScore;
  }

  return "Under Review";
};

const MockTestCards = ({ progress, isLoading }: MockTestCardsProps) => {
  if (isLoading) return null;

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

          return (
            <motion.div
              key={sectionName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full hover:shadow-md transition">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {sectionName}
                    </p>
                    <p className="text-xl font-semibold mt-1">
                      {score}
                    </p>
                  </div>
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