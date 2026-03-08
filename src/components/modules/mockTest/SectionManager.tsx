import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { QuestionFormDialog } from "./QuestionFormDialog";
import { useUpdateSectionMutation } from "@/redux/features/mockTest/mockTestSection.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    const [isOpen, setIsOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
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
        <div className={`rounded-2xl border-2 ${meta.border} overflow-hidden`}>
            {/* Section header — clickable accordion toggle */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`w-full flex items-center justify-between p-4 ${meta.color} transition-colors hover:opacity-90`}
            >
                <div className="flex items-center gap-3">
                    <span className="p-2 bg-white/60 rounded-xl">{meta.icon}</span>
                    <div className="text-left">
                        <p className="font-bold text-base">{meta.label}</p>
                        <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
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
                        variant="secondary"
                        className="rounded-xl gap-1 bg-white/70 hover:bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddOpen(true);
                        }}
                    >
                        <Plus className="h-3 w-3" /> Add Question
                    </Button>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-5 w-5 opacity-60" />
                    </motion.div>
                </div>
            </button>

            {/* Question list */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="questions"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="p-4 space-y-3 bg-white/50">
                            {questions.length === 0 && (
                                <div className="py-10 text-center text-muted-foreground text-sm">
                                    No questions yet. Click <strong>Add Question</strong> to get started.
                                </div>
                            )}
                            {questions.map((q, i) => (
                                <motion.div
                                    key={q._id ?? i}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm group"
                                >
                                    <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {q.instruction || q.questionText || q.topic || q.type}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                                {QUESTION_TYPE_LABELS[q.type]}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                {q.marks} mark{q.marks !== 1 ? "s" : ""}
                                            </span>
                                            {q.isAutoMarked !== undefined && (
                                                <Badge
                                                    variant={q.isAutoMarked ? "default" : "outline"}
                                                    className="text-[10px] h-4 px-1.5"
                                                >
                                                    {q.isAutoMarked ? "Auto" : "Manual"}
                                                </Badge>
                                            )}
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
                                                className="gap-2"
                                            >
                                                <Pencil className="h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="gap-2 text-destructive focus:text-destructive"
                                                onClick={() => {
                                                    setDeleteQ(q);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add question dialog */}
            <QuestionFormDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                sectionId={section._id}
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
                existingQuestions={questions}
                editQuestion={editQ}
                onSuccess={() => {
                    setEditOpen(false);
                    setEditQ(null);
                    onRefetch();
                }}
            />

            {/* Delete question confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-2xl max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove question #{" "}
                            {(questions.findIndex((q) => q._id === deleteQ?._id) ?? 0) + 1} from this section.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline" className="rounded-xl">Cancel</Button>
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteQuestion}
                            disabled={isDeleting}
                            className="rounded-xl"
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
