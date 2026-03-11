import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import _ from "lodash";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Activity,
} from "lucide-react";
import CreatePromoModal from "@/components/modules/promo/CreatePromoForm";
import { useGetAllPromosQuery } from "@/redux/features/promo/promo.api";
import PromosTable from "@/components/modules/promo/PromosTable";
import StateAndChart from "@/components/modules/promo/StateAndChart";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Sort options mapping
const SORT_OPTIONS = {
  recent: { sortBy: "createdAt", sortOrder: "desc" },
  oldest: { sortBy: "createdAt", sortOrder: "asc" },
  "usage-high": { sortBy: "usage", sortOrder: "desc" },
  "usage-low": { sortBy: "usage", sortOrder: "asc" },
  "alpha-asc": { sortBy: "code", sortOrder: "asc" },
  "alpha-desc": { sortBy: "code", sortOrder: "desc" },
} as const;

type SortOptionKey = keyof typeof SORT_OPTIONS;

export default function AdminPromoPage() {
  // Modal state
  const [open, setOpen] = useState(false);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOptionKey>("recent");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounced search with lodash
  const debouncedSetSearch = useMemo(
    () =>
      _.debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1); // Reset to first page on search
      }, 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  // Get API query parameters
  const queryParams = useMemo(() => {
    const { sortBy, sortOrder } = SORT_OPTIONS[sortOption];
    
    return {
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
      isActive: filterStatus === "all" ? undefined : filterStatus === "active",
    };
  }, [page, limit, debouncedSearch, sortOption, filterStatus]);

  // Fetch promos from API
  const { data, isLoading, isFetching, isError } = useGetAllPromosQuery(queryParams);

  // Safe data extraction with fallbacks
  const promos = useMemo(() => data?.data ?? [], [data]);
  const meta = useMemo(
    () =>
      data?.meta ?? {
        page,
        limit,
        total: 0,
        totalPages: Math.ceil(0 / limit),
      },
    [data, page, limit]
  );

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value as SortOptionKey);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterStatus(value as "all" | "active" | "inactive");
    setPage(1);
  }, []);

  const openCreateModal = useCallback(() => setOpen(true), []);

  // Calculate display range
  const displayRange = useMemo(() => {
    if (meta.total === 0) return null;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, meta.total);
    return { start, end };
  }, [page, limit, meta.total]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-sm">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Promo Management
              </h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Manage and monitor all promotional codes
              </p>
            </div>
          </div>

          <Button
            onClick={openCreateModal}
            disabled={isLoading || isFetching}
            className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Add New Promo
          </Button>
        </motion.div>

        {/* Analytics Cards */}
        <StateAndChart />

        {/* Promo Codes Table */}
        <motion.div variants={item}>
          <Card className="border-none shadow-xl bg-card backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex flex-col gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    All Promo Codes
                    {(isLoading || isFetching) && (
                      <span className="text-sm font-normal text-muted-foreground">
                        Loading...
                      </span>
                    )}
                    {isError && (
                      <span className="text-sm font-normal text-destructive">
                        Error loading data
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {displayRange
                      ? `Showing ${displayRange.start}-${displayRange.end} of ${meta.total} promo codes`
                      : "No promo codes found"}
                  </CardDescription>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1 lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search by code or owner email..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                      aria-label="Search promo codes"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <Select value={sortOption} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full lg:w-48 bg-background/50 border-border/50 hover:bg-background transition-colors">
                      <ArrowUpDown className="h-4 w-4 mr-2 flex-shrink-0" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="usage-high">Most Used</SelectItem>
                      <SelectItem value="usage-low">Least Used</SelectItem>
                      <SelectItem value="alpha-asc">A to Z</SelectItem>
                      <SelectItem value="alpha-desc">Z to A</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Dropdown */}
                  <Select value={filterStatus} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full lg:w-44 bg-background/50 border-border/50 hover:bg-background transition-colors">
                      <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <PromosTable
                data={promos}
                meta={meta}
                isLoading={isLoading || isFetching}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create Modal */}
      <CreatePromoModal open={open} setOpen={setOpen} />
    </div>
  );
}