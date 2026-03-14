import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetMockTestBySlugQuery } from "@/redux/features/mockTest/mockTest.api";
import { useGetSectionByIdQuery } from "@/redux/features/mockTest/mockTestSection.api";
import {
  MockTestStepper,
  StartExamModal,
} from "@/components/student/mock-test";
import { Loader2, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type {
  SectionState,
  SectionName,
  IMockTestSection,
} from "@/interface/mockTest.types";
import { 
  useGetMockTestProgressQuery 
} from "@/redux/features/mockTestSubmission/mockTestSubmission.api";
import { useEffect } from "react";

const SECTION_ORDER: SectionName[] = ["listening", "reading", "writing", "speaking"];

const initialSectionState: SectionState = {
  listening: "not_started",
  reading: "locked",
  writing: "locked",
  speaking: "locked",
};

// Tiny helper component that fetches section data for the modal
const SectionFetcher = ({
  sectionId,
  onReady,
}: {
  sectionId: string;
  onReady: (section: IMockTestSection) => void;
}) => {
  const { data, isLoading } = useGetSectionByIdQuery(sectionId);
  if (!isLoading && data?.data) onReady(data.data);
  return null;
};

const MockTestDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMockTestBySlugQuery(slug as string, {
    skip: !slug,
  });
const mockTest = data?.data;

  const { data: progressData } = useGetMockTestProgressQuery(mockTest?._id as string, {
    skip: !mockTest?._id,
  });



  console.log(progressData)
  const [sectionState, setSectionState] = useState<SectionState>(initialSectionState);

  useEffect(() => {
    if (!progressData?.data) return;

    const apiProgress = progressData.data;
    const newState: SectionState = { ...initialSectionState };

    let foundFirstIncomplete = false;
    SECTION_ORDER.forEach((name) => {
      // If API says submitted, it's submitted
      if (apiProgress[name] === "submitted") {
        newState[name] = "submitted";
      }
      // If it's not submitted and we haven't found the first incomplete one yet, this is the one to start
      else if (!foundFirstIncomplete) {
        newState[name] = "not_started";
        foundFirstIncomplete = true;
      }
      // Everything else is locked
      else {
        newState[name] = "locked";
      }
    });

    setSectionState(newState);
  }, [progressData]);
  const [pendingSection, setPendingSection] = useState<SectionName | null>(null);
  const [pendingSectionData, setPendingSectionData] = useState<IMockTestSection | null>(null);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSectionSubmit = (completedSection: SectionName) => {
    const currentIndex = SECTION_ORDER.indexOf(completedSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];
    setSectionState((prev) => ({
      ...prev,
      [completedSection]: "submitted",
      ...(nextSection ? { [nextSection]: "not_started" } : {}),
    }));
  };

  const handleStartClick = (name: SectionName) => {
    setPendingSection(name);
  };

  const handleConfirmStart = () => {
    if (!pendingSection || !pendingSectionData) return;
    const sectionId = pendingSectionData._id;
    const deadline = Date.now() + pendingSectionData.timeLimit * 60 * 1000;
    localStorage.setItem(`exam_deadline_${sectionId}`, String(deadline));
    setPendingSection(null);
    setPendingSectionData(null);
    navigate(`/mock-test/${slug}/${sectionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!mockTest) {
    return (
      <div className="p-8 text-center">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-40" />
        <h2 className="text-xl font-bold">Mock Test not found</h2>
      </div>
    );
  }

  const pendingSectionId =
    pendingSection && typeof mockTest[pendingSection] === "string"
      ? (mockTest[pendingSection] as string)
      : pendingSection && typeof mockTest[pendingSection] === "object"
      ? (mockTest[pendingSection] as IMockTestSection)._id
      : null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/my-dashboard/my-mock-tests")}
        className="rounded-xl gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        GO Back
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {mockTest.thumbnail && (
          <div className="aspect-video rounded-3xl overflow-hidden border shadow-lg">
            <img
              src={mockTest.thumbnail}
              alt={mockTest.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{mockTest.title}</h1>
            <p className="text-muted-foreground mt-1">
              {typeof mockTest.course === "object" ? mockTest.course.title : "Course"}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            4 Sections
          </Badge>
        </div>
      </motion.div>

      {/* Section Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-bold mb-4">Exam Sections</h2>
        <MockTestStepper
          sections={sectionState}
          mockTest={mockTest}
          onStart={handleStartClick}
        />
      </motion.div>

      {/* Fetch section data when pending */}
      {pendingSection && pendingSectionId && (
        <SectionFetcher
          sectionId={pendingSectionId}
          onReady={(s) => setPendingSectionData(s)}
        />
      )}

      {/* Start Exam Modal */}
      {pendingSection && pendingSectionData && (
        <StartExamModal
          section={pendingSectionData}
          open={!!pendingSection}
          onConfirm={handleConfirmStart}
          onCancel={() => {
            setPendingSection(null);
            setPendingSectionData(null);
          }}
        />
      )}
    </div>
  );
};

export default MockTestDetailPage;
