import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  CreditCard, 
  Download, 
  Search, 
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Receipt,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-001',
      courseId: '1',
      courseName: mockCourses[0].title,
      amount: mockCourses[0].price,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'Credit Card',
      invoice: 'INV-001'
    },
    {
      id: 'TXN-002', 
      courseId: '2',
      courseName: mockCourses[1].title,
      amount: mockCourses[1].price,
      date: '2024-01-10',
      status: 'completed',
      paymentMethod: 'PayPal',
      invoice: 'INV-002'
    },
    {
      id: 'TXN-003',
      courseId: '3', 
      courseName: mockCourses[2].title,
      amount: mockCourses[2].price,
      date: '2024-01-05',
      status: 'pending',
      paymentMethod: 'Credit Card',
      invoice: 'INV-003'
    },
    {
      id: 'TXN-004',
      courseId: '4',
      courseName: mockCourses[3].title,
      amount: mockCourses[3].price,
      date: '2023-12-28',
      status: 'refunded',
      paymentMethod: 'Credit Card', 
      invoice: 'INV-004'
    },
    {
      id: 'TXN-005',
      courseId: '5',
      courseName: mockCourses[4].title,
      amount: mockCourses[4].price,
      date: '2023-12-20',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      invoice: 'INV-005'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange === 'thisMonth') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      matchesDate = transactionDate.getMonth() === now.getMonth() && 
                   transactionDate.getFullYear() === now.getFullYear();
    } else if (dateRange === 'lastMonth') {
      const transactionDate = new Date(transaction.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      matchesDate = transactionDate.getMonth() === lastMonth.getMonth() && 
                   transactionDate.getFullYear() === lastMonth.getFullYear();
    } else if (dateRange === 'last3Months') {
      const transactionDate = new Date(transaction.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      matchesDate = transactionDate >= threeMonthsAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthSpent = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.status === 'completed' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'refunded':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'refunded':
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage your course purchases and payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Total Spent</span>
              </div>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">This Month</span>
              </div>
              <div className="text-2xl font-bold">${thisMonthSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Transactions</span>
              </div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-info" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="last3Months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{transaction.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.courseName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">${transaction.amount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{transaction.paymentMethod}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                          {transaction.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                  <p className="text-muted-foreground mb-4">
                    No transactions match your current filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateRange('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Need a summary of your transactions?
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;