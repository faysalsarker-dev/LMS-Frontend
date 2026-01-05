import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EnrolmentFiltersState, EnrolmentStatus, PaymentStatus, PaymentMethod } from '@/interface/enrolment.types';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import type { ICourse } from '@/interface';


interface EnrolmentFiltersProps {
  filters: EnrolmentFiltersState;
  onFilterChange: (key: keyof EnrolmentFiltersState, value: string | number) => void;
}

const statusOptions: { value: EnrolmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const paymentStatusOptions: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Payment Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const paymentMethodOptions: { value: PaymentMethod | 'all'; label: string }[] = [
  { value: 'all', label: 'All Methods' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'alipay', label: 'Alipay' },
  { value: 'wechat', label: 'WeChat' },
];

export const EnrolmentFilters = ({ filters, onFilterChange }: EnrolmentFiltersProps) => {
  const { data: coursesData } = useGetAllCoursesQuery({ page: 1, limit: 1000 });
  const courses = coursesData?.data.data || [];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus}
          onValueChange={(value) => onFilterChange('paymentStatus', value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            {paymentStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentMethod}
          onValueChange={(value) => onFilterChange('paymentMethod', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.course || 'all'}
          onValueChange={(value) => onFilterChange('course', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course:ICourse) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
