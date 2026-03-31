import { motion } from "framer-motion";
import { Link } from "react-router";
import { format } from "date-fns";
import { Eye, MoreVertical, Pencil, Trash2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IMockTest } from "@/interface/mockTest.types";
import NoDataFound from "@/components/shared/NoDataFound";

const SECTION_COLORS: Record<string, string> = {
    listening: "bg-blue-100 text-blue-700",
    reading: "bg-green-100 text-green-700",
    writing: "bg-orange-100 text-orange-700",
    speaking: "bg-purple-100 text-purple-700",
};

interface MockTestTableProps {
    data: IMockTest[];
    isLoading: boolean;
    onEdit: (item: IMockTest) => void;
    onDelete: (item: IMockTest) => void;
}

export const MockTestTable = ({
    data,
    isLoading,
    onEdit,
    onDelete,
}: MockTestTableProps) => {




    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!data.length) {
        return (
            <NoDataFound 
                message="No mock tests found" 
                icon={
                    <div className="p-6 rounded-full bg-muted shadow-sm mb-2">
                        <BookOpen className="w-10 h-10 opacity-40" />
                    </div>
                }
            >
                <p className="text-sm text-muted-foreground">Create your first mock test to get started.</p>
            </NoDataFound>
        );
    }

    const SECTIONS = ["listening", "reading", "writing", "speaking"] as const;

    return (
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/80">
                        <TableHead className="w-14" />
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Sections</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, i) => (
                        <motion.tr
                            key={item._id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="group hover:bg-slate-50/60 transition-colors"
                        >
                            {/* Thumbnail */}
                            <TableCell>
                                <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted shrink-0">
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </TableCell>

                            {/* Title */}
                            <TableCell>
                                <p className="font-semibold text-sm leading-tight line-clamp-1">
                                    {item.title}
                                </p>
                                <Badge
                                    variant={item.isActive ? "default" : "destructive"}
                                    className="mt-1 text-[10px] h-4 px-1.5"
                                >
                                    {item.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>

                            {/* Course */}
                            <TableCell className="text-sm text-muted-foreground">
                                {item.course?.title || "—"}
                            </TableCell>

                            {/* Sections */}
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {SECTIONS.map((s) => (
                                        <span
                                            key={s}
                                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${item[s] ? SECTION_COLORS[s] : "bg-slate-100 text-slate-400"
                                                }`}
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </TableCell>

                            {/* Created */}
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(item.createdAt), "dd MMM yyyy")}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl">
                                        <DropdownMenuItem asChild>
                                            <Link to={`/dashboard/mock-tests/${item._id}`} className="flex items-center gap-2">
                                                <Eye className="h-4 w-4" /> Manage
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onEdit(item)}
                                            className="flex items-center gap-2"
                                        >
                                            <Pencil className="h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(item)}
                                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
