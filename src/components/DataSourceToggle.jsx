import { useDataStore } from '../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Database, DatabaseZap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export default function DataSourceToggle() {
    const { useMockData, toggleMockData } = useDataStore();

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {useMockData ? (
                        <Database className="h-5 w-5 text-orange-500" />
                    ) : (
                        <DatabaseZap className="h-5 w-5 text-green-500" />
                    )}
                    Data Source Settings
                </CardTitle>
                <CardDescription>
                    Choose between mock data for testing or live MongoDB data
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Current Mode:</span>
                            <Badge variant={useMockData ? "secondary" : "default"}>
                                {useMockData ? 'Mock Data' : 'Live Database'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {useMockData
                                ? 'Using sample data for demonstration'
                                : 'Connected to MongoDB database'}
                        </p>
                    </div>
                    <Button
                        onClick={toggleMockData}
                        variant={useMockData ? "default" : "outline"}
                        size="lg"
                    >
                        Switch to {useMockData ? 'Live Data' : 'Mock Data'}
                    </Button>
                </div>

                {!useMockData && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Make sure MongoDB is running and properly configured in your .env file.
                            Connection string: <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
                            </code>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                            Mock Data
                        </h4>
                        <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                            <li>✓ No setup required</li>
                            <li>✓ Instant testing</li>
                            <li>✓ Sample scenarios</li>
                            <li>✗ Changes not persisted</li>
                        </ul>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                            Live Database
                        </h4>
                        <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                            <li>✓ Real data persistence</li>
                            <li>✓ Production ready</li>
                            <li>✓ Full CRUD operations</li>
                            <li>✗ Requires MongoDB</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
