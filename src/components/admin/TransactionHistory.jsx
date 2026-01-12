
import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, TrendingUp, DollarSign, CreditCard, Calendar } from 'lucide-react';
import CurrencyDisplay from '../CurrencyDisplay';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ totalRevenue: 0, successful: 0, pending: 0 });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            // Fetching all bookings as a proxy for transactions since we don't have a dedicated /payments/all endpoint yet
            const response = await bookingsAPI.getAll({ limit: 100 });
            const data = response.data?.bookings || [];

            // Transform bookings to transaction-like objects
            const mappedParams = data.map(booking => ({
                id: booking.id || booking._id,
                customerName: booking.customerName || 'Unknown',
                amount: booking.estimated_cost || booking.price || 0,
                status: booking.payment_status || (booking.status === 'completed' ? 'paid' : 'pending'),
                date: booking.created_at || booking.createdAt,
                method: 'Stripe', // Assumed for now
                service: booking.issue_description || 'Repair Service'
            }));

            setTransactions(mappedParams);
            calculateStats(mappedParams);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.reduce((acc, curr) => {
            return curr.status === 'paid' || curr.status === 'completed' ? acc + Number(curr.amount) : acc;
        }, 0);
        const successCount = data.filter(t => t.status === 'paid' || t.status === 'completed').length;

        setStats({
            totalRevenue: total,
            successful: successCount,
            pending: data.length - successCount
        });
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
            case 'succeeded':
                return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Paid</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Pending</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-['Outfit'] font-bold text-white">Financials</h2>
                    <p className="text-zinc-400 font-['Inter']">Track revenue and payment history</p>
                </div>
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <CurrencyDisplay amount={stats.totalRevenue} />
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Successful Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">{stats.successful}</div>
                        <p className="text-xs text-zinc-500 mt-1">Completed transactions</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                        <p className="text-xs text-zinc-500 mt-1">Awaiting completion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">Recent Transactions</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 bg-zinc-800 border-zinc-700 text-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-400">Transaction ID</TableHead>
                                <TableHead className="text-zinc-400">Customer</TableHead>
                                <TableHead className="text-zinc-400">Service</TableHead>
                                <TableHead className="text-zinc-400">Date</TableHead>
                                <TableHead className="text-zinc-400">Amount</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500">Loading financials...</TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500">No transactions found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <TableRow key={t.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-mono text-zinc-400 text-xs">#{t.id.slice(-8)}</TableCell>
                                        <TableCell className="text-white font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                                    {t.customerName.charAt(0)}
                                                </div>
                                                {t.customerName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300 text-sm truncate max-w-[150px]">{t.service}</TableCell>
                                        <TableCell className="text-zinc-400 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(t.date).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white font-bold">
                                            <CurrencyDisplay amount={t.amount} />
                                        </TableCell>
                                        <TableCell>{getStatusBadge(t.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionHistory;
