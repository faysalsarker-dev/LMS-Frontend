import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { EditPromoModal } from "./EditPromoModal";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { IPromo } from "@/interface/promo.interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeletePromoMutation } from "@/redux/features/promo/promo.api";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/errorHandler";
import { getStatusBadge, renderUsage } from "./Progress";



type PromoTableProps = {
  data: IPromo[];
  meta: {
    limit: number;
    page: number;
    total: number;
  };
  isLoading: boolean;

  onPageChange: (page: number) => void; 
};

const PromosTable = ({
  data,
  meta,
  isLoading,
  onPageChange,
}: PromoTableProps) => {
  const [selectedPromo, setSelectedPromo] = useState<IPromo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const promos = data ?? [];

  const [deletePromo] = useDeletePromoMutation()

  // INTERNAL DELETE HANDLER (requested)
  const onDelete = async (id: string) => {
   try {
      await deletePromo(id).unwrap();

      toast.success("Promo Delete successfully!");
    
    } catch (err) {
      handleApiError(err);
    }



  };

  const handleEdit = (promo: IPromo) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };





  return (
    <div className="overflow-hidden px-1.5">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
            <TableHead>Code</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-14" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading &&
            promos?.map((promo) => (
              <TableRow
                key={promo._id}
                className="hover:bg-muted/20 transition-colors border-b border-border/30"
              >
                <TableCell className="font-mono font-semibold text-primary">
                  {promo.code}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {promo.createdBy?.email}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize border-primary/20 bg-primary/5 text-primary"
                  >
                    {promo.discountType}
                  </Badge>
                </TableCell>

                <TableCell className="font-bold text-foreground">
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}%`
                    : `$${promo.discountValue}`}
                </TableCell>

                <TableCell>{renderUsage(promo)}</TableCell>

                <TableCell>
                  {getStatusBadge(promo.isActive, promo.expirationDate)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">

                    {/* EDIT */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(promo)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    {/* DELETE */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Promo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action is permanent. Are you sure?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(promo._id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* EDIT MODAL */}
{
  selectedPromo && (
       <EditPromoModal
        promo={selectedPromo}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
  )
}


   

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  meta.page > 1 && onPageChange(meta.page - 1)
                }
              />
            </PaginationItem>

            {Array.from({
              length: Math.ceil(meta?.total / meta?.limit),
            }).map((_, i) => {
              const page = i + 1;

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === meta.page}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  const totalPages = Math.ceil(meta.total / meta.limit);
                  if (meta.page < totalPages) onPageChange(meta.page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PromosTable