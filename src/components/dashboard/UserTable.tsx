import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ban, Edit, MoreHorizontal, Trash2, UserCheck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { IUser } from './../../interface/index';


const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getStatusVariant = (isActive: boolean) => (isActive ? "default" : "destructive");
const getVerifiedVariant = (isVerified: boolean) => (isVerified ? "default" : "secondary");
const formatDate = (date: Date | null | undefined) => (date ? format(new Date(date), "dd MMM yyyy") : "—");

const UserTable = ({
  data,
  handleUserAction,
  isLoading
}: {
  data: IUser[];
  handleUserAction: (action: string, user: IUser) => void;
  isLoading?: boolean;
}) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    user: IUser | null;
    action: 'block' | 'delete' | 'unblock' | '';
  }>({
    isOpen: false,
    user: null,
    action: '',
  });

  const handleActionClick = (action: 'block' | 'delete' | 'unblock', user: IUser) => {
    setDialogState({ isOpen: true, user, action });
  };

  const handleConfirmAction = () => {
    if (dialogState.user && dialogState.action) {
      handleUserAction(dialogState.action, dialogState.user);
    }
    setDialogState({ isOpen: false, user: null, action: '' });
  };

  const getDialogContent = () => {
    const { user, action } = dialogState;
    if (!user) return null;

    switch (action) {
      case "block":
        return {
          title: "Block User",
          description: `Are you sure you want to block ${user.name}? They will not be able to log in.`,
          actionButtonText: "Block",
          icon: <Ban className="h-6 w-6 text-destructive" />,
          isDestructive: true
        };
      case "delete":
        return {
          title: "Permanently Delete User",
          description: `This action cannot be undone. This will permanently delete ${user.name} and all their data.`,
          actionButtonText: "Delete",
          icon: <Trash2 className="h-6 w-6 text-destructive" />,
          isDestructive: true
        };
      case "unblock":
        return {
          title: "Unblock User",
          description: `Are you sure you want to unblock ${user.name}? They will be able to log in again.`,
          actionButtonText: "Unblock",
          icon: <UserCheck className="h-6 w-6 text-primary" />,
          isDestructive: false
        };
      default:
        return null;
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Users {isLoading ? "" : `(${data?.length})`}</CardTitle>
        <CardDescription>
          A detailed list of all users in the system, including their profile status and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <Table>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : data?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No users found matching your criteria.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow key={user?._id} className="hover:bg-accent/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user?.profile} alt={user?.name} />
                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user?.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user?.isActive)} className="capitalize">
                      {user?.isActive ? "Active" : "Blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getVerifiedVariant(user?.isVerified)} className="capitalize">
                      {user?.isVerified ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" /> Verified
                        </span>
                      ) : (
                        "Not Verified"
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {user?.phone || "—"}
                  </TableCell>
               
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDate(user?.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUserAction("edit", user)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user?.isActive ? (
                          <DropdownMenuItem onClick={() => handleActionClick("block", user)} className="text-destructive focus:text-destructive">
                            <Ban className="mr-2 h-4 w-4" /> Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActionClick("unblock", user)}>
                            <UserCheck className="mr-2 h-4 w-4" /> Unblock User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleActionClick("delete", user)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {dialogContent && (
        <AlertDialog open={dialogState.isOpen} onOpenChange={(open) => setDialogState(prev => ({ ...prev, isOpen: open }))}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader className="flex flex-col items-center text-center">
              {dialogContent.icon && <div className="mb-4">{dialogContent.icon}</div>}
              <AlertDialogTitle className="text-xl font-bold">{dialogContent.title}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                {dialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row sm:justify-end">
              <AlertDialogCancel className="w-full sm:w-auto mt-2 sm:mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={`w-full sm:w-auto ${dialogContent.isDestructive ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}`}
              >
                {dialogContent.actionButtonText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default UserTable;
