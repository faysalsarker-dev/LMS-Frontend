import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RotateCcw, Search, SortAsc } from "lucide-react";
import type { MockTestFilters } from "./mockTest.types";

interface MockTestFiltersProps {
    filters: MockTestFilters;
    onFiltersChange: (filters: MockTestFilters) => void;
}

export const MockTestFiltersBar = ({
    filters,
    onFiltersChange,
}: MockTestFiltersProps) => {
    const handleReset = () => {
        onFiltersChange({
            page: 1,
            limit: 10,
            search: "",
            sortBy: "createdAt",
            sortOrder: "desc",
        });
    };

    return (
        <Card className="p-6 rounded-3xl shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                {/* Search */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Search className="w-3 h-3" /> Search
                    </Label>
                    <Input
                        placeholder="Search mock tests…"
                        value={filters.search ?? ""}
                        onChange={(e) =>
                            onFiltersChange({ ...filters, page: 1, search: e.target.value })
                        }
                        className="rounded-xl border-slate-200 bg-slate-50/50"
                    />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <SortAsc className="w-3 h-3" /> Sort By
                    </Label>
                    <Select
                        value={filters.sortBy ?? "createdAt"}
                        onValueChange={(v) => onFiltersChange({ ...filters, sortBy: v })}
                    >
                        <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Order
                    </Label>
                    <Select
                        value={filters.sortOrder ?? "desc"}
                        onValueChange={(v) =>
                            onFiltersChange({ ...filters, sortOrder: v as "asc" | "desc" })
                        }
                    >
                        <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="desc">Newest First</SelectItem>
                            <SelectItem value="asc">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Reset */}
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        className="w-full rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group gap-2"
                        onClick={handleReset}
                    >
                        <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                        Reset
                    </Button>
                </div>
            </div>
        </Card>
    );
};
