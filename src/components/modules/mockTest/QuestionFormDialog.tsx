import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useUpdateSectionMutation } from "@/redux/features/mockTest/mockTestSection.api";
import {
    type QuestionType,
    type IMockQuestion,
    type IMockOption,
    type IMockSegment,
    type SectionName,
    QUESTION_TYPE_LABELS,
} from "@/interface/mockTest.types";

const ALL_TYPES = Object.keys(QUESTION_TYPE_LABELS) as QuestionType[];

const SECTION_BADGE_COLORS: Record<string, string> = {
    L: "bg-blue-100 text-blue-700",
    R: "bg-green-100 text-green-700",
    W: "bg-orange-100 text-orange-700",
    S: "bg-purple-100 text-purple-700",
};

// ─── Helper: blank option / segment ────────────────────────────────────────
const blankOption = (): IMockOption => ({
    optionId: crypto.randomUUID().slice(0, 6),
    text: "",
    imageUrl: "",
});

const blankSegment = (): IMockSegment => ({
    segmentId: crypto.randomUUID().slice(0, 6),
    text: "",
    correctPosition: 0,
});

// ─── Default blank question ─────────────────────────────────────────────────
const blankQuestion = (type: QuestionType): IMockQuestion => ({
    type,
    marks: 1,
    instruction: "",
    audioUrl: "",
    questionText: "",
    passageText: "",
    topic: "",
    pinyin: "",
    passage: "",
    images: [],
    options: [blankOption(), blankOption()],
    correctOptionId: "",
    wordPool: [""],
    correctGaps: [],
    segments: [blankSegment(), blankSegment()],
    wordTokens: [""],
    correctSentence: "",
    minWordCount: 80,
    subQuestions: [],
    allowedRecordingTime: 60,
});

interface QuestionFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionId: string;
    sectionName: SectionName;
    existingQuestions: IMockQuestion[];
    editQuestion?: IMockQuestion | null; // if editing
    onSuccess?: () => void;
}

export const QuestionFormDialog = ({
    open,
    onOpenChange,
    sectionId,
    sectionName,
    existingQuestions,
    editQuestion,
    onSuccess,
}: QuestionFormDialogProps) => {
    const typePrefix = sectionName.charAt(0).toUpperCase();
    const filteredTypes = ALL_TYPES.filter(t => t.startsWith(typePrefix));
    const defaultType = filteredTypes[0] || "L_AUDIO_MCQ";

    const [q, setQ] = useState<IMockQuestion>(
        editQuestion ?? blankQuestion(defaultType)
    );

    const [updateSection, { isLoading }] = useUpdateSectionMutation();

    // Re-init when editQuestion changes (open from different question)
    const handleTypeChange = (type: QuestionType) => {
        setQ((prev) => ({ ...blankQuestion(type), marks: prev.marks, instruction: prev.instruction }));
    };

    const patch = (val: Partial<IMockQuestion>) => setQ((prev) => ({ ...prev, ...val }));

    // ─── Option helpers ───────────────────────────────────────────
    const setOption = (idx: number, field: keyof IMockOption, value: string) => {
        const opts = [...(q.options ?? [])];
        opts[idx] = { ...opts[idx], [field]: value };
        patch({ options: opts });
    };
    const addOption = () => patch({ options: [...(q.options ?? []), blankOption()] });
    const removeOption = (idx: number) =>
        patch({ options: (q.options ?? []).filter((_, i) => i !== idx) });

    // ─── Segment helpers ──────────────────────────────────────────
    const setSegment = (idx: number, field: keyof IMockSegment, value: string | number) => {
        const segs = [...(q.segments ?? [])];
        segs[idx] = { ...segs[idx], [field]: value };
        patch({ segments: segs });
    };
    const addSegment = () => patch({ segments: [...(q.segments ?? []), blankSegment()] });
    const removeSegment = (idx: number) =>
        patch({ segments: (q.segments ?? []).filter((_, i) => i !== idx) });

    // ─── Word pool helpers ────────────────────────────────────────
    const setWord = (idx: number, val: string) => {
        const pool = [...(q.wordPool ?? [])];
        pool[idx] = val;
        patch({ wordPool: pool });
    };
    const addWord = () => patch({ wordPool: [...(q.wordPool ?? []), ""] });
    const removeWord = (idx: number) =>
        patch({ wordPool: (q.wordPool ?? []).filter((_, i) => i !== idx) });

    // ─── Word tokens helpers ──────────────────────────────────────
    const setToken = (idx: number, val: string) => {
        const tokens = [...(q.wordTokens ?? [])];
        tokens[idx] = val;
        patch({ wordTokens: tokens });
    };
    const addToken = () => patch({ wordTokens: [...(q.wordTokens ?? []), ""] });
    const removeToken = (idx: number) =>
        patch({ wordTokens: (q.wordTokens ?? []).filter((_, i) => i !== idx) });

    // ─── Submit ───────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!q.type) return toast.error("Please select a question type");

        try {
            let questions: IMockQuestion[];
            if (editQuestion?._id) {
                questions = existingQuestions.map((eq) =>
                    eq._id === editQuestion._id ? q : eq
                );
            } else {
                questions = [...existingQuestions, q];
            }

            await updateSection({ id: sectionId, data: { questions } }).unwrap();
            toast.success(editQuestion ? "Question updated!" : "Question added!");
            setQ(blankQuestion(defaultType));
            onOpenChange(false);
            onSuccess?.();
        } catch {
            toast.error("Failed to save question. Please try again.");
        }
    };

    const typeLetter = q.type?.charAt(0) ?? "L";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b shrink-0">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded-md ${SECTION_BADGE_COLORS[typeLetter] ?? "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                {typeLetter}
                            </span>
                            <DialogTitle className="text-xl font-bold">
                                {editQuestion ? "Edit Question" : "Add Question"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                </div>

                {/* Scrollable Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
                    {/* Type Selector */}
                    <div className="space-y-2">
                        <Label>Question Type <span className="text-destructive">*</span></Label>
                        <Select value={q.type} onValueChange={(v) => handleTypeChange(v as QuestionType)}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-72">
                                {filteredTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`text-[10px] h-4 px-1 ${SECTION_BADGE_COLORS[t.charAt(0)]}`}
                                                variant="secondary"
                                            >
                                                {t.charAt(0)}
                                            </Badge>
                                            {QUESTION_TYPE_LABELS[t]}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Marks + Instruction (always shown) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Marks</Label>
                            <Input
                                type="number"
                                min={0}
                                value={q.marks}
                                onChange={(e) => patch({ marks: Number(e.target.value) })}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Instruction</Label>
                            <Input
                                placeholder="e.g. Listen and choose…"
                                value={q.instruction ?? ""}
                                onChange={(e) => patch({ instruction: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* ── LISTENING TYPES ──────────────────────────────────────── */}
                    {(q.type === "L_PICTURE_MATCHING" ||
                        q.type === "L_AUDIO_MCQ" ||
                        q.type === "L_LONG_DIALOGUE_MATCHING") && (
                            <>
                                <FieldRow label="Audio URL *">
                                    <Input
                                        placeholder="https://…"
                                        value={q.audioUrl ?? ""}
                                        onChange={(e) => patch({ audioUrl: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </FieldRow>
                                <OptionsEditor
                                    options={q.options ?? []}
                                    correctOptionId={q.correctOptionId ?? ""}
                                    showImageUrl={q.type === "L_PICTURE_MATCHING"}
                                    onSetOption={setOption}
                                    onAddOption={addOption}
                                    onRemoveOption={removeOption}
                                    onCorrectChange={(id) => patch({ correctOptionId: id })}
                                />
                            </>
                        )}

                    {/* ── READING – MCQ & Sentence to Picture ─────────────────── */}
                    {(q.type === "R_SENTENCE_TO_PICTURE" || q.type === "R_PASSAGE_MCQ") && (
                        <>
                            {q.type === "R_SENTENCE_TO_PICTURE" && (
                                <FieldRow label="Question Text *">
                                    <Textarea
                                        placeholder="Enter the sentence…"
                                        value={q.questionText ?? ""}
                                        onChange={(e) => patch({ questionText: e.target.value })}
                                        className="rounded-xl min-h-[80px]"
                                    />
                                </FieldRow>
                            )}
                            {q.type === "R_PASSAGE_MCQ" && (
                                <FieldRow label="Passage *">
                                    <Textarea
                                        placeholder="Enter the passage text…"
                                        value={q.passage ?? ""}
                                        onChange={(e) => patch({ passage: e.target.value })}
                                        className="rounded-xl min-h-[120px]"
                                    />
                                </FieldRow>
                            )}
                            <OptionsEditor
                                options={q.options ?? []}
                                correctOptionId={q.correctOptionId ?? ""}
                                showImageUrl={q.type === "R_SENTENCE_TO_PICTURE"}
                                onSetOption={setOption}
                                onAddOption={addOption}
                                onRemoveOption={removeOption}
                                onCorrectChange={(id) => patch({ correctOptionId: id })}
                            />
                        </>
                    )}

                    {/* ── READING – Fill in the Gap ────────────────────────────── */}
                    {q.type === "R_FILL_IN_THE_GAP" && (
                        <>
                            <FieldRow label="Passage Text (use {{gap_1}}, {{gap_2}}…)">
                                <Textarea
                                    placeholder="The cat sat on the {{gap_1}} and looked at the {{gap_2}}."
                                    value={q.passageText ?? ""}
                                    onChange={(e) => patch({ passageText: e.target.value })}
                                    className="rounded-xl min-h-[100px] font-mono text-sm"
                                />
                            </FieldRow>
                            <WordListEditor
                                label="Word Pool"
                                words={q.wordPool ?? []}
                                onSet={setWord}
                                onAdd={addWord}
                                onRemove={removeWord}
                                placeholder="e.g. table"
                            />
                        </>
                    )}

                    {/* ── READING – Rearrange ──────────────────────────────────── */}
                    {q.type === "R_REARRANGE_PASSAGE" && (
                        <SegmentsEditor
                            segments={q.segments ?? []}
                            onSetSegment={setSegment}
                            onAddSegment={addSegment}
                            onRemoveSegment={removeSegment}
                        />
                    )}

                    {/* ── WRITING – Picture to Word ────────────────────────────── */}
                    {q.type === "W_PICTURE_TO_WORD" && (
                        <>
                            <FieldRow label="Image URL *">
                                <Input
                                    placeholder="https://…"
                                    value={q.images?.[0]?.url ?? ""}
                                    onChange={(e) =>
                                        patch({ images: [{ url: e.target.value, alt: "" }] })
                                    }
                                    className="rounded-xl"
                                />
                            </FieldRow>
                            <OptionsEditor
                                options={q.options ?? []}
                                correctOptionId={q.correctOptionId ?? ""}
                                showImageUrl={false}
                                onSetOption={setOption}
                                onAddOption={addOption}
                                onRemoveOption={removeOption}
                                onCorrectChange={(id) => patch({ correctOptionId: id })}
                            />
                        </>
                    )}

                    {/* ── WRITING – Word to Sentence ───────────────────────────── */}
                    {q.type === "W_WORD_TO_SENTENCE" && (
                        <>
                            <WordListEditor
                                label="Word Tokens (shuffled words)"
                                words={q.wordTokens ?? []}
                                onSet={setToken}
                                onAdd={addToken}
                                onRemove={removeToken}
                                placeholder="e.g. 我"
                            />
                            <FieldRow label="Correct Sentence *">
                                <Input
                                    placeholder="我爱你"
                                    value={q.correctSentence ?? ""}
                                    onChange={(e) => patch({ correctSentence: e.target.value })}
                                    className="rounded-xl"
                                />
                            </FieldRow>
                        </>
                    )}

                    {/* ── WRITING – Pinyin to Character ────────────────────────── */}
                    {q.type === "W_PINYIN_TO_CHARACTER" && (
                        <FieldRow label="Pinyin *">
                            <Input
                                placeholder="wǒ ài nǐ"
                                value={q.pinyin ?? ""}
                                onChange={(e) => patch({ pinyin: e.target.value })}
                                className="rounded-xl"
                            />
                        </FieldRow>
                    )}

                    {/* ── WRITING – Composition (Pictures) ─────────────────────── */}
                    {q.type === "W_COMPOSITION_PICTURES" && (
                        <div className="space-y-3">
                            <Label>Image URLs (up to 4)</Label>
                            {[0, 1, 2, 3].map((i) => (
                                <Input
                                    key={i}
                                    placeholder={`Image ${i + 1} URL`}
                                    value={q.images?.[i]?.url ?? ""}
                                    onChange={(e) => {
                                        const imgs = [...(q.images ?? [{ url: "" }, { url: "" }, { url: "" }, { url: "" }])];
                                        while (imgs.length <= i) imgs.push({ url: "" });
                                        imgs[i] = { url: e.target.value };
                                        patch({ images: imgs });
                                    }}
                                    className="rounded-xl"
                                />
                            ))}
                        </div>
                    )}

                    {/* ── WRITING – Composition Topic ──────────────────────────── */}
                    {q.type === "W_COMPOSITION_TOPIC" && (
                        <>
                            <FieldRow label="Topic *">
                                <Input
                                    placeholder="Describe your hometown…"
                                    value={q.topic ?? ""}
                                    onChange={(e) => patch({ topic: e.target.value })}
                                    className="rounded-xl"
                                />
                            </FieldRow>
                            <div className="space-y-2">
                                <Label>Min Word Count</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={q.minWordCount ?? 80}
                                    onChange={(e) => patch({ minWordCount: Number(e.target.value) })}
                                    className="rounded-xl"
                                />
                            </div>
                        </>
                    )}

                    {/* ── SPEAKING TYPES ────────────────────────────────────────── */}
                    {q.type === "S_REPEAT_AFTER_LISTENING" && (
                        <FieldRow label="Audio URL *">
                            <Input
                                placeholder="https://…"
                                value={q.audioUrl ?? ""}
                                onChange={(e) => patch({ audioUrl: e.target.value })}
                                className="rounded-xl"
                            />
                        </FieldRow>
                    )}
                    {q.type === "S_SPEAK_ON_PICTURE" && (
                        <FieldRow label="Image URL *">
                            <Input
                                placeholder="https://…"
                                value={q.images?.[0]?.url ?? ""}
                                onChange={(e) =>
                                    patch({ images: [{ url: e.target.value, alt: "" }] })
                                }
                                className="rounded-xl"
                            />
                        </FieldRow>
                    )}
                    {q.type === "S_ANSWER_QUESTION" && (
                        <>
                            <FieldRow label="Question Text *">
                                <Textarea
                                    placeholder="What is your favourite season?"
                                    value={q.questionText ?? ""}
                                    onChange={(e) => patch({ questionText: e.target.value })}
                                    className="rounded-xl"
                                />
                            </FieldRow>
                            <FieldRow label="Audio URL (optional)">
                                <Input
                                    placeholder="https://…"
                                    value={q.audioUrl ?? ""}
                                    onChange={(e) => patch({ audioUrl: e.target.value })}
                                    className="rounded-xl"
                                />
                            </FieldRow>
                        </>
                    )}

                    {/* Speaking: recording time (all S_ types) */}
                    {q.type?.startsWith("S_") && (
                        <div className="space-y-2">
                            <Label>Allowed Recording Time (seconds)</Label>
                            <Input
                                type="number"
                                min={5}
                                value={q.allowedRecordingTime ?? 60}
                                onChange={(e) =>
                                    patch({ allowedRecordingTime: Number(e.target.value) })
                                }
                                className="rounded-xl"
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : editQuestion ? (
                                "Update Question"
                            ) : (
                                "Add Question"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// ─── Sub-components ─────────────────────────────────────────────────────────
const FieldRow = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        {children}
    </div>
);

interface OptionsEditorProps {
    options: IMockOption[];
    correctOptionId: string;
    showImageUrl: boolean;
    onSetOption: (idx: number, field: keyof IMockOption, value: string) => void;
    onAddOption: () => void;
    onRemoveOption: (idx: number) => void;
    onCorrectChange: (id: string) => void;
}

const OptionsEditor = ({
    options,
    correctOptionId,
    showImageUrl,
    onSetOption,
    onAddOption,
    onRemoveOption,
    onCorrectChange,
}: OptionsEditorProps) => (
    <div className="space-y-3">
        <Label>Options</Label>
        {options.map((opt, i) => (
            <div key={opt.optionId} className="flex gap-2 items-start">
                {/* Correct radio */}
                <input
                    type="radio"
                    name="correctOptionId"
                    className="mt-3 accent-primary cursor-pointer"
                    checked={correctOptionId === opt.optionId}
                    onChange={() => onCorrectChange(opt.optionId)}
                    title="Mark as correct"
                />
                <div className="flex-1 space-y-1">
                    <Input
                        placeholder={`Option ${i + 1} text`}
                        value={opt.text ?? ""}
                        onChange={(e) => onSetOption(i, "text", e.target.value)}
                        className="rounded-xl"
                    />
                    {showImageUrl && (
                        <Input
                            placeholder="Image URL (optional)"
                            value={opt.imageUrl ?? ""}
                            onChange={(e) => onSetOption(i, "imageUrl", e.target.value)}
                            className="rounded-xl text-xs"
                        />
                    )}
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveOption(i)}
                    disabled={options.length <= 2}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ))}
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            className="rounded-xl gap-1"
        >
            <Plus className="h-3 w-3" /> Add Option
        </Button>
        <p className="text-xs text-muted-foreground">
            Click the radio button on the left to mark the correct answer.
        </p>
    </div>
);

interface SegmentsEditorProps {
    segments: IMockSegment[];
    onSetSegment: (idx: number, field: keyof IMockSegment, value: string | number) => void;
    onAddSegment: () => void;
    onRemoveSegment: (idx: number) => void;
}

const SegmentsEditor = ({
    segments,
    onSetSegment,
    onAddSegment,
    onRemoveSegment,
}: SegmentsEditorProps) => (
    <div className="space-y-3">
        <Label>Passage Segments</Label>
        {segments.map((seg, i) => (
            <div key={seg.segmentId} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                    <Input
                        placeholder={`Segment ${i + 1} text`}
                        value={seg.text}
                        onChange={(e) => onSetSegment(i, "text", e.target.value)}
                        className="rounded-xl"
                    />
                    <Input
                        type="number"
                        min={1}
                        placeholder="Correct position (1, 2, 3…)"
                        value={seg.correctPosition || ""}
                        onChange={(e) =>
                            onSetSegment(i, "correctPosition", Number(e.target.value))
                        }
                        className="rounded-xl text-xs"
                    />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveSegment(i)}
                    disabled={segments.length <= 2}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ))}
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddSegment}
            className="rounded-xl gap-1"
        >
            <Plus className="h-3 w-3" /> Add Segment
        </Button>
    </div>
);

interface WordListEditorProps {
    label: string;
    words: string[];
    placeholder: string;
    onSet: (idx: number, val: string) => void;
    onAdd: () => void;
    onRemove: (idx: number) => void;
}

const WordListEditor = ({
    label,
    words,
    placeholder,
    onSet,
    onAdd,
    onRemove,
}: WordListEditorProps) => (
    <div className="space-y-3">
        <Label>{label}</Label>
        {words.map((w, i) => (
            <div key={i} className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={w}
                    onChange={(e) => onSet(i, e.target.value)}
                    className="rounded-xl"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(i)}
                    disabled={words.length <= 1}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ))}
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="rounded-xl gap-1"
        >
            <Plus className="h-3 w-3" /> Add Word
        </Button>
    </div>
);
