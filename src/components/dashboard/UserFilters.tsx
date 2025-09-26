import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserFilters } from "@/interface";

interface UserFiltersProps {
  filters: UserFilters;
  activeFiltersCount: number;
  onFilterChange: (key: keyof UserFilters, value: string | number) => void;
  onClearFilters: () => void;
}

export default function Filters({ 
  filters, 
  activeFiltersCount, 
  onFilterChange, 
  onClearFilters 
}: UserFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2 animate-pulse">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <motion.div 
              className="lg:col-span-2 space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-sm font-medium text-foreground">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-10 bg-background border-border transition-all duration-300 focus:shadow-elegant"
                  value={filters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                />
              </div>
            </motion.div>

            {/* Role Filter */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select
                value={filters.role || "all"}
                onValueChange={(value) => onFilterChange('role', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border-border transition-all duration-300 hover:shadow-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="instructor">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Instructor
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Student
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Status Filter */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select
                value={filters.isActive || "all"}
                onValueChange={(value) => onFilterChange('isActive', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border-border transition-all duration-300 hover:shadow-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="true">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Quick filters:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('role', 'student');
                onFilterChange('isActive', 'true');
              }}
              className="h-8"
            >
              Active Students
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('role', 'instructor');
                onFilterChange('isActive', 'true');
              }}
              className="h-8"
            >
              Active Instructors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFilterChange('isActive', 'false')}
              className="h-8"
            >
              Inactive Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}