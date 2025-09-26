// import { useState, useCallback } from "react";
// import { Plus, Search, Filter, Users as UsersIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import toast from "react-hot-toast";
// import { useGetAllQuery, useUpdateMutation } from "@/redux/features/auth/auth.api";
// import type { IUser, UserFilters } from "@/interface";
// import { UserTable } from "@/components/dashboard/UserTable";
// import  UserDialog  from "@/components/dashboard/dialogs/UserDialog";
// import { handleApiError } from "@/utils/errorHandler";



// export default function Users() {
//   const [filters, setFilters] = useState<UserFilters>({
//     search: "",
//     role: "",
//     isActive: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [editingUser, setEditingUser] = useState<IUser | null>(null);
//   const [updateUser ,{isLoading: isUpdateLoading}] = useUpdateMutation();
//   const { data, isLoading, isError } = useGetAllQuery(filters);


//   const handleUserAction = useCallback(async (action: string, user: IUser) => {
//     switch (action) {
//       case "edit":
//         setEditingUser(user);
//         break;
//       case "block":
//         try {
//           await updateUser({ id: user._id, data: { isActive: false } });
//           toast.success(`${user.name} has been blocked`);
//         } catch (error) {
// handleApiError(error)
//         }
//         break;
//       case "unblock":
//         try {
//           await updateUser({ id: user._id, data: { isActive: true } });
//           toast.success(`${user.name} has been unblocked`);
//         } catch (error) {
// handleApiError(error)

//         }
//         break;
//       case "delete":
//         if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
//           try {
//             await updateUser({ id: user._id, data: { deleted: true } });
//             toast.success(`${user.name} has been deleted`);
//           } catch (error) {
// handleApiError(error)

//           }
//         }
//         break;
//     }
//   }, [updateUser]);

//   const handleFilterChange = useCallback((key: keyof UserFilters, value: string | number) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value,
//       ...(key !== 'page' && { page: 1 }) 
//     }));
//   }, []);

//   const clearFilters = () => {
//     setFilters({
//       search: "",
//       role: "",
//       isActive: "",
//       page: 1,
//       limit: 10,
//       sortBy: "createdAt",
//       sortOrder: "desc",
//     });
//   };

//   const activeFiltersCount = [filters.search, filters.role, filters.isActive].filter(Boolean).length;
//   const totalUsers = data?.data?.meta?.total || 0;

//   return (
//     <div className="min-h-screen bg-dashboard-background p-6 space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <UsersIcon className="h-6 w-6 text-primary" />
//             <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
//           </div>
//           <p className="text-muted-foreground">
//             Manage your platform users, roles, and permissions
//           </p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <Badge variant="secondary" className="px-3 py-1">
//             {totalUsers} Total Users
//           </Badge>
//           <Button 
//             onClick={() => setShowCreateDialog(true)} 
//             className="bg-gradient-primary hover:opacity-90 shadow-md"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </Button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <Card className="shadow-card border-0">
//         <CardHeader className="pb-4">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               Filters
//               {activeFiltersCount > 0 && (
//             <Badge variant="default" className="ml-2">
//               {activeFiltersCount}
//             </Badge>
//               )}
//             </CardTitle>
//             {activeFiltersCount > 0 && (
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={clearFilters}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 Clear All
//               </Button>
//             )}
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Search Input */}
//             <div className="lg:col-span-2 space-y-2">
//               <label className="text-sm font-medium text-foreground">Search</label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   placeholder="Search by name or email..."
//                   className="pl-10 bg-background border-border"
//                   value={filters.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Role Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">Role</label>
//               <Select
//                 value={filters.role || "all"}
//                 onValueChange={(value) => handleFilterChange('role', value === "all" ? "" : value)}
//               >
//                 <SelectTrigger className="bg-background border-border">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Roles</SelectItem>
//                   <SelectItem value="admin">Admin</SelectItem>
//                   <SelectItem value="instructor">Instructor</SelectItem>
//                   <SelectItem value="student">Student</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Status Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">Status</label>
//               <Select
//                 value={filters.isActive || "all"}
//                 onValueChange={(value) => handleFilterChange('isActive', value === "all" ? "" : value)}
//               >
//                 <SelectTrigger className="bg-background border-border">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="true">Active</SelectItem>
//                   <SelectItem value="false">Blocked</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Users Table */}
//       <UserTable
//         data={data?.data?.data || []}
//         meta={data?.data?.meta}
//         isLoading={isLoading}
//         isError={isError}
//         onUserAction={handleUserAction}
//         filters={filters}
//         onFiltersChange={setFilters}
//       />

//       {/* User Dialog */}
//       <UserDialog
//         open={showCreateDialog || !!editingUser}
//         onOpenChange={(open) => {
//           if (!open) {
//             setShowCreateDialog(false);
//             setEditingUser(null);
//           }
//         }}
//         loading={isLoading || isUpdateLoading}
//         user={editingUser}
//         mode={editingUser ? "update" : "create"}
//         onSuccess={() => {
//           setShowCreateDialog(false);
//           setEditingUser(null);
//         }}
//       />
//     </div>
//   );
// }


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
import { useGetAllQuery } from '@/redux/features/auth/auth.api';



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
      case "unblock":
      case "delete":
        // Handle these actions
        console.log(`${action} user:`, user);
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