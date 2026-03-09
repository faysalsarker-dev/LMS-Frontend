import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Settings,
    Plus,
    Trash2,
    Pencil,
    Headphones,
    BookOpen,
    PenLine,
    Mic,
    Clock,
    FileQuestion,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
    useGetSectionByIdQuery,
    useUpdateSectionMutation,
} from "@/redux/features/mockTest/mockTestSection.api";
import {
    QuestionFormDialog,
    UpdateSectionDialog,
} from "@/components/modules/mockTest";
import {
    type IMockQuestion,
    type IMockTestSection,
    QUESTION_TYPE_LABELS,
} from "@/interface/mockTest.types";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const SECTION_META: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; border: string }
> = {
    listening: {
        label: "Listening",
        icon: <Headphones className="h-6 w-6 text-blue-600" />,
        color: "bg-blue-50 text-blue-700",
        border: "border-blue-200",
    },
    reading: {
        label: "Reading",
        icon: <BookOpen className="h-6 w-6 text-green-600" />,
        color: "bg-green-50 text-green-700",
        border: "border-green-200",
    },
    writing: {
        label: "Writing",
        icon: <PenLine className="h-6 w-6 text-orange-600" />,
        color: "bg-orange-50 text-orange-700",
        border: "border-orange-200",
    },
    speaking: {
        label: "Speaking",
        icon: <Mic className="h-6 w-6 text-purple-600" />,
        color: "bg-purple-50 text-purple-700",
        border: "border-purple-200",
    },
};

const MockTestSectionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetSectionByIdQuery(id!, { skip: !id });
    const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();

    const [addOpen, setAddOpen] = useState(false);
    const [editQ, setEditQ] = useState<IMockQuestion | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [deleteQ, setDeleteQ] = useState<IMockQuestion | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const section: IMockTestSection | undefined = data?.data;
    const meta = section ? (SECTION_META[section.name] ?? SECTION_META.listening) : null;
    const questions = section?.questions ?? [];

    const handleDeleteQuestion = async () => {
        if (!deleteQ || !section) return;
        try {
            const updated = questions.filter((q) => q._id !== deleteQ._id);
            await updateSection({ id: section._id, data: { questions: updated } }).unwrap();
            toast.success("Question deleted");
            setDeleteOpen(false);
            setDeleteQ(null);
            refetch();
        } catch {
            toast.error("Failed to delete question");
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
                <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
        );
    }

    if (!section) {
        return (
            <div className="p-6 py-24 text-center">
                <h2 className="text-2xl font-bold">Section not found</h2>
                <Button onClick={() => navigate(-1)} className="mt-4 rounded-xl">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background pb-12"
        >
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="rounded-xl gap-1 mb-1"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Mock Test
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${meta?.color}`}>
                                {meta?.icon}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight capitalize">
                                    {section.name} Section
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Part of {section.mockTest && typeof section.mockTest === "object" ? section.mockTest.title : "Mock Test"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 self-start">
                        <Button
                            variant="outline"
                            onClick={() => setSettingsOpen(true)}
                            className="rounded-xl gap-2"
                        >
                            <Settings className="h-4 w-4" /> Settings
                        </Button>
                        <Button
                            onClick={() => setAddOpen(true)}
                            className="rounded-xl gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Question
                        </Button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-2xl group">
                        <CardContent className="pt-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-orange-50">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Time Limit</p>
                                    <p className="text-xl font-bold">{section.timeLimit} Minutes</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSettingsOpen(true)}
                                className="rounded-lg h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                        <CardContent className="pt-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-50">
                                <FileQuestion className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Questions</p>
                                <p className="text-xl font-bold">{questions.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Questions List
                    </h2>

                    <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                        {questions.length === 0 ? (
                            <div className="py-24 text-center text-muted-foreground">
                                <div className="p-6 rounded-full bg-muted w-fit mx-auto mb-4">
                                    <Plus className="w-10 h-10 opacity-40" />
                                </div>
                                <p className="text-lg font-medium">No questions yet</p>
                                <Button onClick={() => setAddOpen(true)} variant="link" className="mt-2">
                                    Add your first question
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {questions.map((q, i) => (
                                    <div key={q._id || i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                                        <span className="text-sm font-bold text-muted-foreground w-8 text-center bg-slate-100/50 rounded-lg py-1">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate leading-none">
                                                {q.instruction || q.questionText || q.topic || "No text provided"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 uppercase font-bold">
                                                    {QUESTION_TYPE_LABELS[q.type]}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {q.marks} {q.marks === 1 ? 'Point' : 'Points'}
                                                </span>
                                                {q.isAutoMarked !== undefined && (
                                                    <Badge variant={q.isAutoMarked ? "default" : "outline"} className="text-[10px] h-4 px-1.5">
                                                        {q.isAutoMarked ? "Auto" : "Manual"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => { setEditQ(q); setEditOpen(true); }} className="gap-2">
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => { setDeleteQ(q); setDeleteOpen(true); }}>
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <UpdateSectionDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                section={section}
                onSuccess={refetch}
            />

            <QuestionFormDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                sectionId={section._id}
                sectionName={section.name}
                existingQuestions={questions}
                onSuccess={refetch}
            />

            <QuestionFormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                sectionId={section._id}
                sectionName={section.name}
                existingQuestions={questions}
                editQuestion={editQ}
                onSuccess={() => {
                    setEditQ(null);
                    refetch();
                }}
            />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="space-y-2 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <Trash2 className="h-8 w-8 text-destructive" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold">Delete Question?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground px-4">
                                This action cannot be undone. This question will be permanently removed from this section.
                            </AlertDialogDescription>
                        </div>
                    </div>
                    <AlertDialogFooter className="p-4 bg-muted/30 gap-2 border-t mt-0">
                        <AlertDialogCancel asChild>
                            <Button variant="ghost" className="rounded-xl flex-1 hover:bg-slate-200">Cancel</Button>
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteQuestion}
                            disabled={isUpdating}
                            className="rounded-xl flex-1 shadow-lg shadow-destructive/20"
                        >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default MockTestSectionPage;
