import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllEnrolmentsQuery } from '@/redux/features/enrollment/enrollment.api';
import { EnrollmentTable } from "@/components/modules/Enrolment/EnrollmentTable";

const EnrolmentPage: FC = () => {

      const { data, isLoading, isError } = useGetAllEnrolmentsQuery(undefined);


  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <EnrollmentTable data={data?.data} isLoading={isLoading} isError={isError} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrolmentPage;
