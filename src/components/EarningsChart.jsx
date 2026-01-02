import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * EarningsChart Component
 * Displays earnings data with a visual bar chart
 * 
 * Props:
 * - data: Array of { date, amount, label } objects
 * - title: Chart title
 * - loading: Loading state
 */
const EarningsChart = ({
    data = [],
    title = "Earnings Overview",
    loading = false,
    currency = "LKR"
}) => {
    const [period, setPeriod] = useState('week');
    const [chartData, setChartData] = useState([]);

    // Generate sample data if none provided
    useEffect(() => {
        if (data.length > 0) {
            setChartData(data);
        } else {
            // Generate mock data for demonstration
            const mockData = generateMockData(period);
            setChartData(mockData);
        }
    }, [data, period]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (chartData.length === 0) return { total: 0, average: 0, trend: 0, max: 0 };

        const total = chartData.reduce((sum, d) => sum + d.amount, 0);
        const average = total / chartData.length;
        const max = Math.max(...chartData.map(d => d.amount));

        // Calculate trend (compare last half to first half)
        const midpoint = Math.floor(chartData.length / 2);
        const firstHalf = chartData.slice(0, midpoint).reduce((sum, d) => sum + d.amount, 0);
        const secondHalf = chartData.slice(midpoint).reduce((sum, d) => sum + d.amount, 0);
        const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

        return { total, average, trend, max };
    }, [chartData]);

    // Generate mock data based on period
    const generateMockData = (period) => {
        const now = new Date();
        let days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
        let labelFormat = period === 'year' ? 'month' : 'day';

        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random earnings between 500 and 15000
            const amount = Math.floor(Math.random() * 14500) + 500;

            let label;
            if (labelFormat === 'month') {
                label = date.toLocaleDateString('en-US', { month: 'short' });
            } else {
                label = date.toLocaleDateString('en-US', { weekday: 'short' });
            }

            // For year view, aggregate by month
            if (period === 'year') {
                const existingMonth = data.find(d => d.label === label);
                if (existingMonth) {
                    existingMonth.amount += amount;
                    continue;
                }
            }

            data.push({
                date: date.toISOString(),
                amount,
                label
            });
        }

        return data;
    };

    // Calculate bar height as percentage
    const getBarHeight = (amount) => {
        if (stats.max === 0) return 0;
        return (amount / stats.max) * 100;
    };

    // Skeleton loader
    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                    <div className="animate-pulse">
                        <div className="h-6 w-48 bg-zinc-800 rounded" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-zinc-800 rounded-t animate-pulse"
                                style={{ height: `${Math.random() * 80 + 20}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        {title}
                    </CardTitle>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Earnings</p>
                        <p className="text-xl font-bold text-white mt-1">
                            <CurrencyDisplay amount={stats.total} currency={currency} />
                        </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Daily Average</p>
                        <p className="text-xl font-bold text-white mt-1">
                            <CurrencyDisplay amount={Math.round(stats.average)} currency={currency} />
                        </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Trend</p>
                        <p className={`text-xl font-bold mt-1 flex items-center gap-1 ${stats.trend >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {stats.trend >= 0 ? (
                                <TrendingUp className="h-5 w-5" />
                            ) : (
                                <TrendingDown className="h-5 w-5" />
                            )}
                            {Math.abs(stats.trend).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-zinc-500">
                        <span><CurrencyDisplay amount={stats.max} currency={currency} compact /></span>
                        <span><CurrencyDisplay amount={stats.max / 2} currency={currency} compact /></span>
                        <span>0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="ml-16">
                        {/* Grid lines */}
                        <div className="absolute left-16 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                            <div className="border-b border-zinc-800/50" />
                            <div className="border-b border-zinc-800/50" />
                            <div className="border-b border-zinc-800/50" />
                        </div>

                        {/* Bars */}
                        <div className="flex items-end justify-between h-48 gap-1 relative">
                            {chartData.slice(-7).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex-1 flex flex-col items-center group"
                                >
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-zinc-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                        <CurrencyDisplay amount={item.amount} currency={currency} />
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-300 hover:from-green-500 hover:to-green-300 cursor-pointer"
                                        style={{
                                            height: `${getBarHeight(item.amount)}%`,
                                            minHeight: item.amount > 0 ? '4px' : '0'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between mt-2">
                            {chartData.slice(-7).map((item, index) => (
                                <div key={index} className="flex-1 text-center">
                                    <span className="text-xs text-zinc-500">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {period === 'week' ? 'Last 7 days' :
                                period === 'month' ? 'Last 30 days' :
                                    'Last 12 months'}
                        </span>
                    </div>
                    <span>Updated just now</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default EarningsChart;
