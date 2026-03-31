import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ArrowRight,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Clock,
  FileQuestion,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetSectionsQuery,
  useDeleteSectionMutation,
} from "@/redux/features/mockTest/mockTestSection.api";
import {
  CreateSectionDialog,
  UpdateSectionDialog,
} from "@/components/admin/mocktest";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NoDataFound from "@/components/shared/NoDataFound";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  listening: <Headphones className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  writing: <PenLine className="h-4 w-4" />,
  speaking: <Mic className="h-4 w-4" />,
};

const MockTestSectionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editSection, setEditSection] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useGetSectionsQuery({
    search: searchTerm,
    limit: 100,
  });

  const [deleteSection] = useDeleteSectionMutation();

  const sections = data?.data ?? [];

  const handleDelete = async (id: string, mockTestId: string) => {
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    try {
      await deleteSection({ id, mockTest: mockTestId }).unwrap();
      toast.success("Section deleted");
    } catch {
      toast.error("Failed to delete section");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Section Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all individual test sections across all mock tests.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      <Card className="rounded-3xl border-none shadow-sm bg-slate-50/50 p-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments by name (e.g. listening)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-white rounded-2xl border-none shadow-sm focus-visible:ring-primary"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-3xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section: any) => (
            <Card
              key={section._id}
              className="group rounded-3xl border-slate-200/60 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 bg-white overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-5 flex justify-between items-start">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/5 rounded-xl text-primary">
                        {SECTION_ICONS[section.name] || (
                          <FileQuestion className="h-4 w-4" />
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] h-5 px-1.5 font-bold border-primary/20 text-primary"
                      >
                        {section.name}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight truncate">
                        {section.mockTest?.title || "Test Untethered"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        ID: {section._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl w-40"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setEditSection(section);
                          setEditOpen(true);
                        }}
                        className="gap-2"
                      >
                        <Pencil className="h-4 w-4" /> Edit Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleDelete(
                            section._id,
                            section.mockTest?._id || section.mockTest,
                          )
                        }
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="px-5 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Questions
                      </span>
                      <span className="text-sm font-bold">
                        {section.questions?.length || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Time
                      </span>
                      <span className="text-sm font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {section.timeLimit}m
                      </span>
                    </div>
                  </div>
                  <Link to={`/dashboard/mock-test-sections/${section._id}`}>
                    <Button
                      size="sm"
                      className="rounded-xl gap-2 font-bold px-4 hover-lift"
                    >
                      Manage <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sections.length === 0 && !isLoading && (
        <NoDataFound 
          message="No sections found" 
          icon={<Search className="h-12 w-12 text-slate-300" />}
        >
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Try adjusting your search or add a manual section if one is missing.
          </p>
        </NoDataFound>
      )}

      <CreateSectionDialog open={createOpen} onOpenChange={setCreateOpen} />

      <UpdateSectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        section={editSection}
      />
    </motion.div>
  );
};

export default MockTestSectionsPage;
