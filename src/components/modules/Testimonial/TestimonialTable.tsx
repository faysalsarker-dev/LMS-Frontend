import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { ITestimonial } from "@/interface";
import { Star, Trash2, PencilLine, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import _Rating from "react-rating";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRating = _Rating as unknown as React.FC<any>;

type Props = {
  response: { data?: ITestimonial[] | undefined };
  onEdit: (t: ITestimonial) => void;
  onDelete: (id: string) => void;
};

export default function TestimonialTable({
  response,
  onEdit,
  onDelete,
}: Props) {
  const { data } = response;

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold text-muted-foreground">
              User
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Course
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Review
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {data && data.length > 0 ? (
              data.map((t: ITestimonial, index: number) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  {/* User Info */}
                  <TableCell className="py-3 font-medium flex flex-col gap-1">
                    <span className="truncate">
                      {t.user?.name || t.user?.email || "Unknown"}
                    </span>
                    <ReactRating
                      readonly
                      initialRating={t.rating}
                      emptySymbol={
                        <Star className="w-4 h-4 text-gray-300" />
                      }
                      fullSymbol={
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      }
                      fractions={2}
                    />
                  </TableCell>

                  {/* Course Title */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableCell className="max-w-[200px] truncate cursor-pointer text-muted-foreground">
                        {t.course?.title
                          ? `${t.course.title.slice(0, 25)}${
                              t.course.title.length > 25 ? "..." : ""
                            }`
                          : "-"}
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent>{t.course?.title}</TooltipContent>
                  </Tooltip>

                  {/* Review Content */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableCell className="max-w-[260px] truncate cursor-pointer text-muted-foreground">
                        {t.review.length > 40
                          ? `${t.review.slice(0, 40)}...`
                          : t.review}
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-sm">
                      {t.review}
                    </TooltipContent>
                  </Tooltip>

                  {/* Date */}
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => onEdit(t)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <PencilLine className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="hover:opacity-90"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this
                              testimonial and remove the data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(t._id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-24"
              >
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No testimonials found.
                </TableCell>
              </motion.tr>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}