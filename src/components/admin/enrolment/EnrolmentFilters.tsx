import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EnrolmentFiltersState } from '@/interface/enrolment.types';

interface EnrolmentFiltersProps {
  filters: EnrolmentFiltersState;
  onFilterChange: (key: keyof EnrolmentFiltersState, value: string | number) => void;
}

export const EnrolmentFilters = ({ filters, onFilterChange }: EnrolmentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user or transaction..."
          className="pl-9"
          defaultValue={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Payment Status */}
        <Select
          value={filters.paymentStatus}
          onValueChange={(value) => onFilterChange('paymentStatus', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Input
          placeholder="Course title..."
          className="w-[180px]"
          value={filters.course}
          onChange={(e) => onFilterChange('course', e.target.value)}
        />
      </div>
    </div>
  );
};
