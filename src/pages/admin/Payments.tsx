import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, RefreshCw, Download, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Payment, PaginatedResponse, PaymentFilters } from '@/types';
import { mockApi } from '@/services/mockApi';
import { formatCurrency, formatDate, getStatusVariant, getInitials, debounce } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Payments() {
  const [payments, setPayments] = useState<PaginatedResponse<Payment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = async (page = 1, newFilters = filters) => {
    setLoading(true);
    try {
      const data = await mockApi.getPayments(page, 10, newFilters);
      setPayments(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const debouncedSearch = debounce((search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    fetchPayments(1, newFilters);
  }, 500);

  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    fetchPayments(1, newFilters);
  };

  const handlePaymentAction = async (action: string, payment: Payment) => {
    try {
      switch (action) {
        case 'refund':
          if (window.confirm(`Refund ${formatCurrency(payment.amount)} to ${payment.student.name}?`)) {
            await mockApi.refundPayment(payment.id);
            toast.success('Payment refunded successfully');
            fetchPayments(currentPage);
          }
          break;
        case 'export':
          // Simulate CSV export
          toast.success('Payment details exported to CSV');
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} payment:`, error);
      toast.error(`Failed to ${action} payment`);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return CreditCard;
      case 'paypal': return DollarSign;
      case 'bank_transfer': return RefreshCw;
      default: return CreditCard;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'card': return 'text-blue-600 bg-blue-100';
      case 'paypal': return 'text-yellow-600 bg-yellow-100';
      case 'bank_transfer': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalRevenue = payments?.data.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0) || 0;
  const completedPayments = payments?.data.filter(p => p.status === 'completed').length || 0;
  const refundedPayments = payments?.data.filter(p => p.status === 'refunded').length || 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Track transactions, process refunds, and manage revenue
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From completed payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Successful transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Money returned to customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments?.total ? Math.round((completedPayments / payments.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by student, course, or transaction ID..."
                className="pl-10"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.paymentMethod || ''} onValueChange={(value) => handleFilterChange('paymentMethod', value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            Detailed view of all transactions and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : payments?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found matching your criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.data.map((payment) => {
                  const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);
                  
                  return (
                    <TableRow key={payment.id} className="hover:bg-secondary/50">
                      <TableCell>
                        <div>
                          <div className="font-mono text-sm">{payment.transactionId}</div>
                          <div className="text-xs text-muted-foreground">ID: {payment.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={payment.student.avatarUrl} alt={payment.student.name} />
                            <AvatarFallback>{getInitials(payment.student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.student.name}</div>
                            <div className="text-sm text-muted-foreground">{payment.student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            by {payment.course.instructor.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getPaymentMethodColor(payment.paymentMethod)}`}>
                            <PaymentIcon className="h-3 w-3" />
                          </div>
                          <span className="text-sm capitalize">
                            {payment.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : payment.paymentMethod}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(payment.status)} className="capitalize">
                          {payment.status}
                        </Badge>
                        {payment.refundedAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Refunded: {formatDate(payment.refundedAt)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(payment.date)}
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
                            <DropdownMenuItem onClick={() => handlePaymentAction('export', payment)}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {payment.status === 'completed' && (
                              <DropdownMenuItem 
                                onClick={() => handlePaymentAction('refund', payment)}
                                className="text-destructive focus:text-destructive"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {payments && payments.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, payments.total)} of {payments.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPayments(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPayments(currentPage + 1)}
                  disabled={currentPage >= payments.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}