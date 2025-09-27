

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Users as UsersIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IUser, UserFilters } from "@/interface";
import { UserStats } from "@/components/dashboard/UserStats";
import { UserTable } from "@/components/dashboard/UserTable";
import UserDialog from "@/components/dashboard/dialogs/UserDialog";
import Filters from "@/components/dashboard/UserFilters";
import { useGetAllQuery, useUpdateMutation } from '@/redux/features/auth/auth.api';



export default function UserManagement() {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    isActive: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
   const { data, isLoading, isError } = useGetAllQuery(filters);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
const [update]=useUpdateMutation();

  const users = data?.data?.data || [] as IUser[];
  const meta = data?.data?.meta;

  const handleUserAction = useCallback(async (action: string, user: IUser) => {
    switch (action) {
      case "edit":
        setEditingUser(user);
        break;
      case "view":
        // Handle view profile
        console.log("View profile:", user);
        break;
      case "block":
              await update({id:user?._id||"",payload:{isActive:false}}).unwrap();
break;
      case "unblock":
              await update({id:user?._id||"",payload:{isActive:true}}).unwrap();
              break;
      case "delete":

      break;
    }
  }, []);



  const handleFilterChange = useCallback((key: keyof UserFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) 
    }));
  }, []);

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "",
      isActive: "",
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const activeFiltersCount = [filters.search, filters.role, filters.isActive].filter(Boolean).length;
  const totalUsers = meta?.total || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dashboard-background p-6 space-y-6"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
                Manage users, roles, and permissions across your platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1.5 font-medium">
            {totalUsers} Total Users
          </Badge>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              className="bg-gradient-primary hover:opacity-90 shadow-elegant"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </motion.div>

      {/* User Stats */}
      <UserStats users={users} />


      {/* Filters Section */}
      <Filters
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Users Table */}
      <UserTable
        data={users}
        meta={meta}
        isLoading={isLoading}
        isError={isError}
        onUserAction={handleUserAction}
        filters={filters}
        onFiltersChange={setFilters}
        selectedUsers={selectedUsers}
        onSelectedUsersChange={setSelectedUsers}
      />

      {/* User Dialog */}
      <UserDialog
        open={showCreateDialog || !!editingUser}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingUser(null);
          }
        }}
        user={editingUser}
        mode={editingUser ? "update" : "create"}
        onSuccess={() => {
          setShowCreateDialog(false);
          setEditingUser(null);
        }}
      />
    </motion.div>
  );
}