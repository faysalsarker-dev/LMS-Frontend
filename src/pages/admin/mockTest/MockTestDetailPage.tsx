import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    ArrowLeft,
    BookOpen,
    ClipboardList,
    FileQuestion,
    Pencil,
    Trash2,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { SectionManager } from "@/components/modules/mockTest/SectionManager";
import { UpdateMockTestDialog } from "@/components/modules/mockTest/UpdateMockTestDialog";
import { DeleteMockTestDialog } from "@/components/modules/mockTest/DeleteMockTestDialog";
import {
    useGetMockTestByIdQuery,
    useDeleteMockTestMutation,
} from "@/redux/features/mockTest/mockTest.api";
import { useGetSectionByIdQuery } from "@/redux/features/mockTest/mockTestSection.api";
import type { IMockTest, IMockTestSection } from "@/interface/mockTest.types";
import { toast } from "sonner";

// ─── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}
const StatCard = ({ icon, label, value }: StatCardProps) => (
    <Card>
        <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-muted">{icon}</div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

// ─── Section loader (fetches one section by ID) ──────────────────────────────
const SectionBlock = ({
    sectionId,
    onRefetch,
}: {
    sectionId: string;
    onRefetch: () => void;
}) => {
    const { data, isLoading, refetch } = useGetSectionByIdQuery(sectionId, {
        skip: !sectionId,
    });

    const section: IMockTestSection | undefined = data?.data;

    const handleRefetch = () => {
        refetch();
        onRefetch();
    };

    if (isLoading) return <Skeleton className="h-16 w-full rounded-2xl" />;
    if (!section) return null;
    return <SectionManager section={section} onRefetch={handleRefetch} />;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const SECTION_KEYS = ["listening", "reading", "writing", "speaking"] as const;

const MockTestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetMockTestByIdQuery(id!, { skip: !id });
    const [deleteMockTest, { isLoading: isDeleting }] = useDeleteMockTestMutation();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const mockTest: IMockTest | undefined = data?.data;

    // ── Loading skeleton ───────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    // ── Not found ──────────────────────────────────────────────────
    if (!mockTest) {
        return (
            <div className="p-6 py-24 text-center">
                <h2 className="text-2xl font-bold">Mock Test not found</h2>
                <Button asChild className="mt-4 rounded-xl">
                    <Link to="/dashboard/mock-tests">Back to list</Link>
                </Button>
            </div>
        );
    }

    // ── Helpers ────────────────────────────────────────────────────
    const getSectionId = (key: typeof SECTION_KEYS[number]): string | null => {
        const val = mockTest[key];
        if (!val) return null;
        return typeof val === "string" ? val : val._id;
    };

    const handleDelete = async () => {
        try {
            await deleteMockTest(mockTest._id).unwrap();
            toast.success("Mock test deleted");
            navigate("/dashboard/mock-tests");
        } catch {
            toast.error("Failed to delete mock test");
        }
    };

    const totalQuestions = SECTION_KEYS.reduce((acc, key) => {
        const val = mockTest[key];
        if (val && typeof val === "object" && "questions" in val) {
            return acc + ((val as IMockTestSection).questions?.length ?? 0);
        }
        return acc;
    }, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background pb-12"
        >
            <div className="p-6 space-y-6">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row justify-between gap-4"
                >
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard/mock-tests")}
                            className="rounded-xl gap-1 mb-1"
                        >
                            <ArrowLeft className="h-4 w-4" /> All Mock Tests
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ClipboardList className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    {mockTest.title}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={mockTest.isActive ? "default" : "destructive"}>
                                        {mockTest.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Updated {format(new Date(mockTest.updatedAt), "dd MMM yyyy")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 self-start">
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                            className="rounded-xl gap-2"
                        >
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteOpen(true)}
                            className="rounded-xl gap-2"
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </motion.div>

                {/* ── Stat cards ── */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        icon={<BookOpen className="text-primary" />}
                        label="Course"
                        value={mockTest.course?.title ?? "—"}
                    />
                    <StatCard
                        icon={<ClipboardList className="text-blue-500" />}
                        label="Sections"
                        value={SECTION_KEYS.filter((k) => getSectionId(k)).length}
                    />
                    <StatCard
                        icon={<FileQuestion className="text-orange-500" />}
                        label="Total Questions"
                        value={totalQuestions}
                    />
                </div>

                {/* ── Sections ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Sections & Questions</h2>
                    </div>

                    {SECTION_KEYS.map((key) => {
                        const sectionId = getSectionId(key);
                        if (!sectionId) return null;
                        return (
                            <SectionBlock key={key} sectionId={sectionId} onRefetch={refetch} />
                        );
                    })}
                </div>
            </div>

            {/* ── Dialogs ── */}
            <UpdateMockTestDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                mockTest={mockTest}
                onSuccess={refetch}
            />
            <DeleteMockTestDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                mockTest={mockTest}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </motion.div>
    );
};

export default MockTestDetailPage;
