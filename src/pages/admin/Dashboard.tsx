import { RecentEnrollmentsTable, StatCard } from "@/components/dashboard/OverViewCard";
import { BookOpen, DollarSign, GraduationCap, Users } from "lucide-react";



export default function AdminDashboard() {




  return (
    <div className="p-6 space-y-6 animate-fade-in">
  

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={15678}
          growth={56}
          icon={Users}
          description="Active learners and instructors"
        />
        <StatCard
          title="Total Courses"
          value={8}
          growth={12}
          icon={BookOpen}
          description="Published learning content"
        />
        <StatCard
          title="Total Enrollments"
          value={97}
          growth={76}
          icon={GraduationCap}
          description="Active course enrollments"
        />
        <StatCard
          title="Total Revenue"
          value={89000}
          growth={45}
          icon={DollarSign}
          description="Monthly recurring revenue"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentEnrollmentsTable />
        {/* <RecentActivitiesCard /> */}
      </div>
    </div>
  );
}