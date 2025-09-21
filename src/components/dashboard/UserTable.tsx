import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Ban, 
  Edit, 
  MoreHorizontal, 
  Trash2, 
  UserCheck, 
  CheckCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IUser, UserFilters } from '@/interface';

interface UserTableProps {
  data: IUser[];
  isLoading?: boolean;
  isError?: boolean;
  meta:{
    page:number,
    limit:number;
    totalPages:number;
    total:number;

  }
  onUserAction: (action: string, user: IUser) => void;
  filters:UserFilters;
  onFiltersChange: (filters:UserFilters) => void;
}

interface DialogState {
  isOpen: boolean;
  user: IUser | null;
  action: 'block' | 'delete' | 'unblock' | '';
}

const getInitials = (name: string) =>
  name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "?";

const getRoleVariant = (role: IUser['role']) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'instructor': return 'default';
    case 'student': return 'secondary';
    default: return 'secondary';
  }
};

const getStatusVariant = (isActive: boolean) => 
  isActive ? 'default' : 'destructive';

const getVerifiedVariant = (isVerified: boolean) => 
  isVerified ? 'default' : 'secondary';

const formatDate = (date: Date | null | undefined) => 
  date ? format(new Date(date), "dd MMM yyyy") : "—";

export function UserTable({ data, isLoading, isError, onUserAction, filters, onFiltersChange ,meta}: UserTableProps) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    user: null,
    action: '',
  });

  const handleActionClick = (action: 'block' | 'delete' | 'unblock', user: IUser) => {
    setDialogState({ isOpen: true, user, action });
  };

  const handleConfirmAction = () => {
    if (dialogState.user && dialogState.action) {
      onUserAction(dialogState.action, dialogState.user);
    }
    setDialogState({ isOpen: false, user: null, action: '' });
  };

  const handleSort = (column: string) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      ...filters,
      sortBy: column,
      sortOrder: newOrder,
    });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  const handleLimitChange = (limit: string) => {
    onFiltersChange({ ...filters, limit: parseInt(limit), page: 1 });
  };

  const getDialogContent = () => {
    const { user, action } = dialogState;
    if (!user) return null;

    switch (action) {
      case "block":
        return {
          title: "Block User",
          description: `Are you sure you want to block ${user.name}? They will not be able to log in.`,
          actionButtonText: "Block User",
          icon: <Ban className="h-6 w-6 text-destructive" />,
          isDestructive: true
        };
      case "delete":
        return {
          title: "Delete User",
          description: `This action cannot be undone. This will permanently delete ${user.name} and all their data.`,
          actionButtonText: "Delete User",
          icon: <Trash2 className="h-6 w-6 text-destructive" />,
          isDestructive: true
        };
      case "unblock":
        return {
          title: "Unblock User",
          description: `Are you sure you want to unblock ${user.name}? They will be able to log in again.`,
          actionButtonText: "Unblock User",
          icon: <UserCheck className="h-6 w-6 text-success" />,
          isDestructive: false
        };
      default:
        return null;
    }
  };

  const dialogContent = getDialogContent();

  if (isError) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>Failed to load users. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-card border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">
                Users {!isLoading && `(${data?.length || 0})`}
              </CardTitle>
              <CardDescription>
                Manage user accounts, permissions, and activity status
              </CardDescription>
            </div>
            
            {/* Table Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select 
                value={filters.limit.toString()} 
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No users found matching your criteria.</p>
              <Button variant="outline" onClick={() => onFiltersChange({
                ...filters,
                search: "",
                role: "",
                isActive: "",
                page: 1
              })}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('name')}
                      >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('role')}
                      >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('createdAt')}
                      >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarImage src={user.profile} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.isActive)} className="capitalize">
                          {user.isActive ? "Active" : "Blocked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVerifiedVariant(user.isVerified)} className="capitalize">
                          {user.isVerified ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </div>
                          ) : (
                            "Unverified"
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {user.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => onUserAction("edit", user)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.isActive ? (
                              <DropdownMenuItem 
                                onClick={() => handleActionClick("block", user)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleActionClick("unblock", user)}
                                className="text-success focus:text-success cursor-pointer"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unblock User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleActionClick("delete", user)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {meta?.totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((meta?.page - 1) * meta?.limit) + 1} to {Math.min(meta?.page * meta?.limit, meta?.total)} of {meta.total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta?.totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={filters.page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                      className="w-8 h-8 p-0"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= Math.ceil(data.length / filters.limit)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      {dialogContent && (
        <AlertDialog open={dialogState.isOpen} onOpenChange={(open) => 
          setDialogState(prev => ({ ...prev, isOpen: open }))
        }>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                {dialogContent.icon}
              </div>
              <AlertDialogTitle className="text-xl font-semibold">
                {dialogContent.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                {dialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={`w-full sm:w-auto ${
                  dialogContent.isDestructive 
                    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                {dialogContent.actionButtonText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}