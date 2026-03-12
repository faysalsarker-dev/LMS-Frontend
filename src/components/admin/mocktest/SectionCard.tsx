import { useNavigate } from "react-router";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Clock,
  FileQuestion,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IMockTestSection } from "@/interface/mockTest.types";
import { useState } from "react";
import { UpdateSectionDialog } from "../../admin/mocktest/UpdateSectionDialog";

const SECTION_META: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    bg: string;
  }
> = {
  listening: {
    label: "Listening",
    icon: <Headphones className="h-6 w-6 text-blue-600" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  reading: {
    label: "Reading",
    icon: <BookOpen className="h-6 w-6 text-green-600" />,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  writing: {
    label: "Writing",
    icon: <PenLine className="h-6 w-6 text-orange-600" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  speaking: {
    label: "Speaking",
    icon: <Mic className="h-6 w-6 text-purple-600" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
};

interface SectionCardProps {
  section: IMockTestSection;
  onRefetch: () => void;
}

export const SectionCard = ({ section, onRefetch }: SectionCardProps) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const meta = SECTION_META[section.name] ?? SECTION_META.listening;

  const handleNavigate = () => {
    navigate(`/dashboard/mock-test-sections/${section._id}`);
  };

  return (
    <Card
      className={`group relative rounded-3xl border-2 ${meta.border} hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white overflow-hidden`}
    >
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-4 rounded-2xl ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform duration-300`}
            >
              {meta.icon}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(true);
              }}
              className="rounded-xl h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={`capitalize text-[10px] h-5 px-2 font-bold ${meta.bg} ${meta.color} border-none`}
            >
              {meta.label} Part
            </Badge>
            <h3 className="text-xl font-bold tracking-tight capitalize">
              {section.name} Section
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Questions
              </p>
              <div className="flex items-center gap-1.5 font-bold">
                <FileQuestion className="h-3.5 w-3.5 text-blue-500" />
                <span>{section.questions?.length || 0}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Time Limit
              </p>
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                <span>{section.timeLimit}m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <Button
            onClick={handleNavigate}
            className="w-full rounded-2xl h-11 font-bold gap-2 shadow-lg shadow-primary/10 hover-lift"
          >
            Manage Questions <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <UpdateSectionDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        section={section}
        onSuccess={onRefetch}
      />
    </Card>
  );
};
