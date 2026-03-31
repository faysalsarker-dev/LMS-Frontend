import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import {
    ChevronDown,
    Plus,
    Pencil,
    Trash2,
    Clock,
    FileQuestion,
    MoreVertical,
    Mic,
    BookOpen,
    PenLine,
    Headphones,
    Settings,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { IMockTestSection, IMockQuestion } from "@/interface/mockTest.types";
import { QUESTION_TYPE_LABELS } from "@/interface/mockTest.types";
import { QuestionFormDialog, UpdateSectionDialog } from "./";
import { useUpdateSectionMutation } from "@/redux/features/mockTest/mockTestSection.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import NoDataFound from "@/components/shared/NoDataFound";

const SECTION_META: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; border: string }
> = {
    listening: {
        label: "Listening",
        icon: <Headphones className="h-4 w-4" />,
        color: "bg-blue-50 text-blue-700",
        border: "border-blue-200",
    },
    reading: {
        label: "Reading",
        icon: <BookOpen className="h-4 w-4" />,
        color: "bg-green-50 text-green-700",
        border: "border-green-200",
    },
    writing: {
        label: "Writing",
        icon: <PenLine className="h-4 w-4" />,
        color: "bg-orange-50 text-orange-700",
        border: "border-orange-200",
    },
    speaking: {
        label: "Speaking",
        icon: <Mic className="h-4 w-4" />,
        color: "bg-purple-50 text-purple-700",
        border: "border-purple-200",
    },
};

interface SectionManagerProps {
    section: IMockTestSection;
    onRefetch: () => void;
}

export const SectionManager = ({ section, onRefetch }: SectionManagerProps) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [editQ, setEditQ] = useState<IMockQuestion | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteQ, setDeleteQ] = useState<IMockQuestion | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [updateSection, { isLoading: isDeleting }] = useUpdateSectionMutation();

    const meta = SECTION_META[section.name] ?? SECTION_META.listening;
    const questions = section.questions ?? [];

    const handleDeleteQuestion = async () => {
        if (!deleteQ) return;
        try {
            const updated = questions.filter((q) => q._id !== deleteQ._id);
            await updateSection({ id: section._id, data: { questions: updated } }).unwrap();
            toast.success("Question deleted");
            setDeleteOpen(false);
            setDeleteQ(null);
            onRefetch();
        } catch {
            toast.error("Failed to delete question");
        }
    };

    return (
        <div className={`rounded-2xl border-2 ${meta.border} overflow-hidden shadow-sm`}>
            {/* Section header — clickable accordion toggle */}
            <div
                className={`w-full flex items-center justify-between p-4 ${meta.color} transition-colors border-b-2 ${meta.border}`}
            >
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen((v) => !v)}>
                    <span className="p-2 bg-white/60 rounded-xl shadow-sm">{meta.icon}</span>
                    <div className="text-left">
                        <p className="font-bold text-base leading-none">{meta.label}</p>
                        <p className="text-[11px] opacity-70 flex items-center gap-1 mt-1.5">
                            <FileQuestion className="h-3 w-3" />
                            {questions.length} question{questions.length !== 1 ? "s" : ""}
                            <span className="mx-1">·</span>
                            <Clock className="h-3 w-3" />
                            {section.timeLimit} min
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-xl h-8 w-8 p-0 hover:bg-white/40"
                        onClick={() => setSettingsOpen(true)}
                        title="Section Settings"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="rounded-xl gap-1 bg-white/70 hover:bg-white shadow-sm h-8"
                        onClick={() => navigate(`/dashboard/mock-test-sections/${section._id}`)}
                    >
                        <ExternalLink className="h-3.5 w-3.5" /> Manage
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        className="rounded-xl gap-1 shadow-sm h-8"
                        onClick={() => setAddOpen(true)}
                    >
                        <Plus className="h-3.5 w-3.5" /> Add
                    </Button>

                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        className="p-1 hover:bg-white/40 rounded-full transition-colors ml-1"
                    >
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-5 w-5 opacity-60" />
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Question list */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="questions"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="p-4 space-y-2 bg-slate-50/50">
                            {questions.length === 0 && (
                                <div className="bg-white/50 rounded-xl border border-dashed">
                                    <NoDataFound 
                                        message="No questions yet." 
                                        icon={<FileQuestion className="h-8 w-8 text-muted-foreground" />} 
                                        className="min-h-[150px] p-4"
                                    />
                                </div>
                            )}
                            {questions.slice(0, 10).map((q, i) => (
                                <motion.div
                                    key={q._id ?? i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm group"
                                >
                                    <span className="text-[10px] font-bold text-muted-foreground/60 w-5 text-center">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate text-slate-700">
                                            {q.instruction || q.questionText || q.topic || q.type}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <Badge variant="secondary" className="text-[9px] h-3.5 px-1 bg-slate-100 font-bold uppercase">
                                                {QUESTION_TYPE_LABELS[q.type]}
                                            </Badge>
                                            <span className="text-[9px] text-muted-foreground font-medium">
                                                {q.marks} pts
                                            </span>
                                        </div>
                                    </div>

                                    {/* Question actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditQ(q);
                                                    setEditOpen(true);
                                                }}
                                                className="gap-2 text-xs"
                                            >
                                                <Pencil className="h-3.5 w-3.5" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="gap-2 text-xs text-destructive focus:text-destructive"
                                                onClick={() => {
                                                    setDeleteQ(q);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>
                            ))}

                            {questions.length > 10 && (
                                <Link
                                    to={`/dashboard/mock-test-sections/${section._id}`}
                                    className="block py-2 text-center text-[11px] font-bold text-primary hover:underline"
                                >
                                    View all {questions.length} questions in detail →
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add question dialog */}
            <QuestionFormDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                sectionId={section._id}
                sectionName={section.name as any}
                existingQuestions={questions}
                onSuccess={() => {
                    setAddOpen(false);
                    onRefetch();
                }}
            />

            {/* Edit question dialog */}
            <QuestionFormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                sectionId={section._id}
                sectionName={section.name as any}
                existingQuestions={questions}
                editQuestion={editQ}
                onSuccess={() => {
                    setEditOpen(false);
                    setEditQ(null);
                    onRefetch();
                }}
            />

            {/* Settings dialog */}
            <UpdateSectionDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                section={section}
                onSuccess={onRefetch}
            />

            {/* Delete question confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-2xl max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            This will permanently remove question #{" "}
                            {(questions.findIndex((q) => q._id === deleteQ?._id) ?? 0) + 1} from this section.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline" className="rounded-xl h-9 text-xs">Cancel</Button>
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteQuestion}
                            disabled={isDeleting}
                            className="rounded-xl h-9 text-xs"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
