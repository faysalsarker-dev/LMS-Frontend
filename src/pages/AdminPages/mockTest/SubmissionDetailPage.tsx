import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Save,
  Loader2,
  AlertCircle,
  Award,
  PenTool,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetMockTestSubmissionByIdQuery,
  useGradeSubmissionMutation,
} from "@/redux/features/mockTestSubmission/mockTestSubmission.api";
import { toast } from "sonner";
import QuestionReviewCard from "@/components/admin/mocktest/QuestionReviewCard";
import ManualGradingDialog from "@/components/admin/mocktest/ManualGradingDialog";

const SubmissionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useGetMockTestSubmissionByIdQuery(id as string);
  const [gradeSubmission, { isLoading: isUpdating }] = useGradeSubmissionMutation();

  const submission = response?.data;
  const [grades, setGrades] = useState<Record<string, { score: number; feedback: string }>>({});
  const [activeGradingSection, setActiveGradingSection] = useState<{
    id: string;
    name: string;
    maxMarks: number;
    type: "section" | "question";
    questionId?: string;
    isQuestion?: boolean;
  } | null>(null);
  const [questionGrades, setQuestionGrades] = useState<Record<string, { score: number; feedback: string }>>({});

  // Initialize grades state when data is loaded
  useEffect(() => {
    if (submission?.sections) {
      const initialGrades: Record<string, { score: number; feedback: string }> = {};
      submission.sections.forEach((sec: any) => {
        if (!sec.isAutoGraded) {
          const sectionId = typeof sec.sectionId === 'string' ? sec.sectionId : sec.sectionId?._id;
          if (sectionId) {
            initialGrades[sectionId] = {
              score: sec.adminScore || 0,
              feedback: sec.adminFeedback || "",
            };
          }
        }
      });
      setGrades(initialGrades);
    }
  }, [submission]);

  const handleOpenGrading = (section: any) => {
    const sectionId = typeof section.sectionId === "string" ? section.sectionId : section.sectionId?._id;
    const maxMarks = section.questionsWithAnswers?.reduce((sum: number, q: any) => sum + (q.marks || 0), 0) || 0;
    
    setActiveGradingSection({
      id: sectionId,
      name: section.sectionId?.name || "Section",
      maxMarks,
      type: "section",
    });
  };

  const handleOpenQuestionGrading = (question: any) => {
    setActiveGradingSection({
      id: question._id,
      name: `Question (${question.type.replace(/_/g, " ")})`,
      maxMarks: question.marks || 0,
      type: "question",
      questionId: question._id,
      isQuestion:true
    });
  };

  const handleSaveGrade = (score: number, feedback: string) => {
    if (!activeGradingSection) return;

    if (activeGradingSection.type === "question") {
      const qId = activeGradingSection.id;
      setQuestionGrades(prev => ({
        ...prev,
        [qId]: { score, feedback }
      }));

      // Find which section this question belongs to and update its total score
      if (submission?.sections) {
        const section = submission.sections.find((sec: any) => 
          sec.questionsWithAnswers?.some((q: any) => q._id === qId)
        );
        
        if (section) {
          const sectionId = typeof section.sectionId === 'string' ? section.sectionId : section.sectionId?._id;
          
          // Calculate new total for this section
          // We need current questionGrades + the new one
          const updatedQuestionGrades = { ...questionGrades, [qId]: { score, feedback } };
          const newSectionScore = section.questionsWithAnswers.reduce((sum: number, q: any) => {
            if (!q.isAutoMarked) {
              return sum + (updatedQuestionGrades[q._id]?.score || 0);
            }
            return sum; // Auto-marked questions use autoGradedScore which is handled by backend differently? 
            // Actually, adminScore should be the total for non-auto-marked questions in the section.
          }, 0);

          setGrades(prev => ({
            ...prev,
            [sectionId]: { 
              score: newSectionScore, 
              feedback: prev[sectionId]?.feedback || `` 
            }
          }));
        }
      }
      toast.success("Question grade updated locally.");
    } else {
      setGrades((prev) => ({
        ...prev,
        [activeGradingSection.id]: { score, feedback },
      }));
      toast.success(`${activeGradingSection.name} grade updated locally.`);
    }
  };

  const handleSubmitGrades = async () => {
    try {
      const payload = {
        submissionId: id as string,
        data: {
          grades: Object.entries(grades).map(([sectionId, data]) => ({
            sectionId,
            score: data.score,
            feedback: data.feedback,
          })),
        },
      };

      await gradeSubmission(payload).unwrap();
      toast.success("Submission graded successfully!");
      navigate("/dashboard/mock-tests/pending-submissions");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit grades");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold">Error Loading Submission</h2>
        <p className="text-muted-foreground mt-2">Could not find or load the requested submission.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/dashboard/mock-tests/pending-submissions">Back to List</Link>
        </Button>
      </div>
    );
  }

  const sections = submission.sections || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
        <div className="space-y-4">
          <Button variant="ghost" asChild className="gap-2 -ml-2 text-muted-foreground hover:text-primary">
            <Link to="/dashboard/mock-tests/pending-submissions">
              <ChevronLeft className="w-4 h-4" />
              Back to Submissions
            </Link>
          </Button>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary/10 rounded-2xl">
               <Award className="w-8 h-8 text-primary" />
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tight">{submission.mockTest?.title}</h1>
               <p className="text-muted-foreground font-medium flex items-center gap-2">
                 Submission Review &middot; <span className="text-primary">{submission.student?.name}</span>
               </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 text-right">
            <span className="text-[10px] font-black uppercase text-primary/60 block mb-1">Current Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-primary">{submission.totalScore}</span>
              <span className="text-sm font-bold text-muted-foreground">pts</span>
            </div>
          </div>
          <Badge
            className={`px-4 py-1.5 capitalize font-black rounded-full text-xs tracking-widest shadow-sm ${
              submission.status === "pending_review" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700"
            }`}
          >
            {submission.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <User className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Student Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-1">
                <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-wider">Full Name</p>
                <p className="font-bold text-xl">{submission.student?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-wider">Email Address</p>
                <p className="text-sm flex items-center gap-2 opacity-90 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {submission.student?.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-wider">Phone</p>
                <p className="text-sm flex items-center gap-2 opacity-90">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {submission.student?.phone || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Exam Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Course</p>
                <p className="text-sm font-bold leading-tight">{submission.course?.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Submission Date</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {new Date(submission.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Section Scores</p>
                 {sections.map((sec: any) => (
                   <div key={sec._id} className="flex items-center justify-between">
                     <span className="text-xs font-medium capitalize">{sec.sectionId?.name}</span>
                     <Badge variant="outline" className="text-[10px] font-black">
                       {sec.isAutoGraded ? sec.autoGradedScore : (grades[typeof sec.sectionId === "string" ? sec.sectionId : sec.sectionId?._id]?.score || 0)} pts
                     </Badge>
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Tabs for sections */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue={sections[0]?.sectionId?.name || "listening"} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-muted/50 p-1 rounded-2xl h-12">
                {sections.map((sec: any) => (
                  <TabsTrigger 
                    key={sec._id} 
                    value={sec.sectionId?.name}
                    className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold capitalize transition-all"
                  >
                    {sec.sectionId?.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {sections.map((section: any) => (
                <TabsContent 
                  key={section._id} 
                  value={section.sectionId?.name} 
                  className="mt-0 focus-visible:ring-0"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Section Header Card */}
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-r from-muted/30 to-background">
                      <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-background shadow-inner flex items-center justify-center text-primary">
                            {section.sectionId?.name === "listening" ? <Headphones className="w-6 h-6" /> : 
                             section.sectionId?.name === "reading" ? <BookOpen className="w-6 h-6" /> :
                             section.sectionId?.name === "writing" ? <PenTool className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-black capitalize tracking-tight">{section.sectionId?.name} Performance</h3>
                            <p className="text-sm text-muted-foreground max-w-md italic">{section.sectionId?.instruction}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                           {section.isAutoGraded ? (
                             <div className="text-right">
                               <p className="text-[10px] font-black uppercase text-green-600">Auto Scored</p>
                               <p className="text-2xl font-black text-green-700">{section.autoGradedScore} / {section.questionsWithAnswers?.reduce((sum: number, q: any) => sum + (q.marks || 0), 0)}</p>
                             </div>
                           ) : (
                             <div className="flex flex-col items-end gap-2">
                               <div className="text-right">
                                 <p className="text-[10px] font-black uppercase text-blue-600">Manual Marking</p>
                                 <p className="text-2xl font-black text-blue-700">
                                   {grades[typeof section.sectionId === "string" ? section.sectionId : section.sectionId?._id]?.score || 0} / {section.questionsWithAnswers?.reduce((sum: number, q: any) => sum + (q.marks || 0), 0)}
                                 </p>
                               </div>
                               <Button size="sm" onClick={() => handleOpenGrading(section)} className="h-8 font-bold gap-2">
                                 <PenTool className="w-3.5 h-3.5" />
                                 Grade Section
                               </Button>
                             </div>
                           )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      {section.questionsWithAnswers?.map((q: any, idx: number) => {
                        // Merge local question grade into the question object for display
                        const enrichedQuestion = {
                          ...q,
                          adminScore: questionGrades[q._id]?.score ?? q.adminScore,
                          adminFeedback: questionGrades[q._id]?.feedback ?? q.adminFeedback,
                        };
                        return (
                          <QuestionReviewCard 
                            key={enrichedQuestion._id || idx} 
                            question={enrichedQuestion} 
                            index={idx} 
                            onGrade={handleOpenQuestionGrading}
                          />
                        );
                      })}
                    </div>

                    {/* Feedback Display (if manual) */}
                    {!section.isAutoGraded && grades[typeof section.sectionId === "string" ? section.sectionId : section.sectionId?._id]?.feedback && (
                      <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                        <CardContent className="p-6 space-y-2">
                          <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <PenTool className="w-4 h-4" />
                            Instructor Feedback
                          </h4>
                          <p className="text-sm leading-relaxed italic text-muted-foreground p-4 bg-background rounded-xl">
                            "{grades[typeof section.sectionId === "string" ? section.sectionId : section.sectionId?._id]?.feedback}"
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>

          <Separator className="opacity-50" />

          {/* Action Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/30 p-8 rounded-3xl border border-muted">
            <div className="space-y-1">
              <h3 className="font-black text-lg">Finalize Submission</h3>
              <p className="text-sm text-muted-foreground">Ensure all non-auto-graded sections have been reviewed before saving.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button variant="outline" asChild className="flex-1 md:flex-none h-12 px-8 font-bold rounded-xl border-2">
                <Link to="/dashboard/mock-tests/pending-submissions">Discard Changes</Link>
              </Button>
              <Button 
                className="flex-1 md:flex-none h-12 px-10 font-bold rounded-xl shadow-lg shadow-primary/20 gap-2 border-2 border-primary" 
                onClick={handleSubmitGrades}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Final Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeGradingSection && (
        <ManualGradingDialog
          isOpen={!!activeGradingSection}
          onClose={() => setActiveGradingSection(null)}
          onSave={handleSaveGrade}
          isQuestion={activeGradingSection.isQuestion}
          title={activeGradingSection.name}
          maxMarks={activeGradingSection.maxMarks}
          currentScore={activeGradingSection.type === "question" 
            ? questionGrades[activeGradingSection.id]?.score 
            : grades[activeGradingSection.id]?.score}
          currentFeedback={activeGradingSection.type === "question" 
            ? questionGrades[activeGradingSection.id]?.feedback 
            : grades[activeGradingSection.id]?.feedback}
        />
      )}
    </motion.div>
  );
};

const Headphones = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

export default SubmissionDetailPage;
