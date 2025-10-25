import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { IEnrollment } from "@/interface";

interface EnrollmentTableProps {
  data: IEnrollment[];
  isLoading: boolean;
  isError: boolean;
}

export const EnrollmentTable = ({ data, isLoading, isError }: EnrollmentTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center mt-4">Failed to load enrollments.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No enrollments found.</p>;
  }

  const getStatusColor = (status: IEnrollment["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (payment: IEnrollment["paymentStatus"]) => {
    switch (payment) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table className="min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Enrolled At</TableHead>
            <TableHead>Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((enrollment) => (
            <motion.tr
              key={enrollment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">
                {typeof enrollment.user === "string" ? enrollment.user : enrollment.user?.name}
              </TableCell>
              <TableCell>
                {typeof enrollment.course === "string" ? enrollment.course : enrollment.course?.title}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(enrollment.status)}>{enrollment.status?.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPaymentColor(enrollment.paymentStatus)}>
                  {enrollment.paymentStatus.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{enrollment.method || "-"}</TableCell>
              <TableCell>
                {enrollment.enrolledAt
                  ? new Date(enrollment.enrolledAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {enrollment.completedAt
                  ? new Date(enrollment.completedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-"}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
