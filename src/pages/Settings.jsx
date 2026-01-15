import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    Smartphone,
    Mail,
    Moon,
    Sun,
    Monitor,
    Volume2,
    VolumeX,
    Eye,
    EyeOff,
    Trash2,
    Download,
    LogOut,
    AlertTriangle,
    Check,
    Loader2
} from 'lucide-react';

const Settings = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const { theme, setTheme } = useContext(ThemeContext);
    const { currency, changeCurrency } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('notifications');

    // Settings state
    const [settings, setSettings] = useState({
        // Notification settings
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        bookingUpdates: true,
        promotionalEmails: false,
        weeklyDigest: true,
        soundEnabled: true,

        // Appearance settings
        theme: 'dark',
        language: 'en',
        currency: 'LKR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',

        // Privacy settings
        profileVisible: true,
        showOnlineStatus: true,
        allowDataCollection: true,

        // Security settings
        twoFactorEnabled: false,
        loginAlerts: true,
    });

    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('techcare_settings');
        if (savedSettings) {
            setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
    }, []);

    // Sync global state to settings
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            theme: theme || 'system',
            currency: currency || 'LKR'
        }));
    }, [theme, currency]);

    // Save settings to localStorage
    const saveSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('techcare_settings', JSON.stringify(newSettings));
        toast({
            title: "Settings saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    // Handle toggle change
    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        saveSettings(newSettings);
    };

    // Handle select change
    const handleSelectChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);

        // Update global contexts
        if (key === 'theme') {
            setTheme(value);
        } else if (key === 'currency') {
            changeCurrency(value);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "New password and confirmation must be identical.",
                variant: "destructive"
            });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive"
            });
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.newPassword
            });

            if (error) throw error;

            toast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
            });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({
                title: "Error updating password",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    // Handle data export
    const handleExportData = async () => {
        setLoading(true);
        try {
            // Simulate data export
            const userData = {
                profile: profile,
                settings: settings,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `techcare_data_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Data exported",
                description: "Your data has been downloaded successfully.",
            });
        } catch (error) {
            toast({
                title: "Export failed",
                description: "Could not export your data. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle account deletion request
    const handleDeleteAccount = () => {
        toast({
            title: "Account deletion requested",
            description: "Please contact support@techcare.lk to complete account deletion.",
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Settings - TechCare"
                description="Manage your TechCare account settings, notifications, and preferences."
                keywords="settings, account settings, preferences, notifications"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8" />
                        Settings
                    </h1>
                    <p className="text-zinc-400">
                        Manage your account settings, notifications, and preferences.
                    </p>
                </div>

                {/* Settings Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-4 bg-zinc-900/50 border border-zinc-800">
                        <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <Palette className="h-4 w-4 mr-2" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <Eye className="h-4 w-4 mr-2" />
                            Privacy
                        </TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <Shield className="h-4 w-4 mr-2" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Choose how you want to receive notifications.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Notification Channels */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Notification Channels
                                    </h4>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-zinc-400" />
                                            <div>
                                                <Label className="text-white">Email Notifications</Label>
                                                <p className="text-sm text-zinc-500">Receive updates via email</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={() => handleToggle('emailNotifications')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Bell className="h-5 w-5 text-zinc-400" />
                                            <div>
                                                <Label className="text-white">Push Notifications</Label>
                                                <p className="text-sm text-zinc-500">Get push notifications in browser</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.pushNotifications}
                                            onCheckedChange={() => handleToggle('pushNotifications')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="h-5 w-5 text-zinc-400" />
                                            <div>
                                                <Label className="text-white">SMS Notifications</Label>
                                                <p className="text-sm text-zinc-500">Receive SMS for urgent updates</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.smsNotifications}
                                            onCheckedChange={() => handleToggle('smsNotifications')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            {settings.soundEnabled ? (
                                                <Volume2 className="h-5 w-5 text-zinc-400" />
                                            ) : (
                                                <VolumeX className="h-5 w-5 text-zinc-400" />
                                            )}
                                            <div>
                                                <Label className="text-white">Notification Sounds</Label>
                                                <p className="text-sm text-zinc-500">Play sound for new notifications</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.soundEnabled}
                                            onCheckedChange={() => handleToggle('soundEnabled')}
                                        />
                                    </div>
                                </div>

                                {/* Notification Types */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Notification Types
                                    </h4>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div>
                                            <Label className="text-white">Booking Updates</Label>
                                            <p className="text-sm text-zinc-500">Status changes, technician assignments</p>
                                        </div>
                                        <Switch
                                            checked={settings.bookingUpdates}
                                            onCheckedChange={() => handleToggle('bookingUpdates')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div>
                                            <Label className="text-white">Promotional Emails</Label>
                                            <p className="text-sm text-zinc-500">Discounts, offers, and new services</p>
                                        </div>
                                        <Switch
                                            checked={settings.promotionalEmails}
                                            onCheckedChange={() => handleToggle('promotionalEmails')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <Label className="text-white">Weekly Digest</Label>
                                            <p className="text-sm text-zinc-500">Summary of your activity</p>
                                        </div>
                                        <Switch
                                            checked={settings.weeklyDigest}
                                            onCheckedChange={() => handleToggle('weeklyDigest')}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Appearance Settings
                                </CardTitle>
                                <CardDescription>
                                    Customize how TechCare looks and feels.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Theme Selection */}
                                <div className="space-y-3">
                                    <Label className="text-white">Theme</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => handleSelectChange('theme', 'light')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.theme === 'light'
                                                ? 'border-white bg-white/10'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                                }`}
                                        >
                                            <Sun className="h-6 w-6 mx-auto mb-2" />
                                            <span className="text-sm">Light</span>
                                        </button>
                                        <button
                                            onClick={() => handleSelectChange('theme', 'dark')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.theme === 'dark'
                                                ? 'border-white bg-white/10'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                                }`}
                                        >
                                            <Moon className="h-6 w-6 mx-auto mb-2" />
                                            <span className="text-sm">Dark</span>
                                        </button>
                                        <button
                                            onClick={() => handleSelectChange('theme', 'system')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.theme === 'system'
                                                ? 'border-white bg-white/10'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                                }`}
                                        >
                                            <Monitor className="h-6 w-6 mx-auto mb-2" />
                                            <span className="text-sm">System</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Language
                                    </Label>
                                    <Select
                                        value={settings.language}
                                        onValueChange={(value) => handleSelectChange('language', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="si">සිංහල (Sinhala)</SelectItem>
                                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Currency */}
                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Currency
                                    </Label>
                                    <Select
                                        value={settings.currency}
                                        onValueChange={(value) => handleSelectChange('currency', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="LKR">LKR - Sri Lankan Rupee</SelectItem>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Format */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-white">Date Format</Label>
                                        <Select
                                            value={settings.dateFormat}
                                            onValueChange={(value) => handleSelectChange('dateFormat', value)}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-white">Time Format</Label>
                                        <Select
                                            value={settings.timeFormat}
                                            onValueChange={(value) => handleSelectChange('timeFormat', value)}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                                <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
                                                <SelectItem value="24h">24-hour (13:00)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Privacy Settings
                                </CardTitle>
                                <CardDescription>
                                    Control your privacy and data preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div>
                                            <Label className="text-white">Profile Visibility</Label>
                                            <p className="text-sm text-zinc-500">Allow others to view your profile</p>
                                        </div>
                                        <Switch
                                            checked={settings.profileVisible}
                                            onCheckedChange={() => handleToggle('profileVisible')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                                        <div>
                                            <Label className="text-white">Show Online Status</Label>
                                            <p className="text-sm text-zinc-500">Let others see when you're online</p>
                                        </div>
                                        <Switch
                                            checked={settings.showOnlineStatus}
                                            onCheckedChange={() => handleToggle('showOnlineStatus')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <Label className="text-white">Analytics & Data Collection</Label>
                                            <p className="text-sm text-zinc-500">Help improve TechCare with usage data</p>
                                        </div>
                                        <Switch
                                            checked={settings.allowDataCollection}
                                            onCheckedChange={() => handleToggle('allowDataCollection')}
                                        />
                                    </div>
                                </div>

                                {/* Data Management */}
                                <div className="pt-4 space-y-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Data Management
                                    </h4>

                                    <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                                        <div>
                                            <Label className="text-white">Export Your Data</Label>
                                            <p className="text-sm text-zinc-500">Download a copy of your data</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleExportData}
                                            disabled={loading}
                                            className="border-zinc-600"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-900/50 bg-red-950/20">
                                        <div>
                                            <Label className="text-red-400">Delete Account</Label>
                                            <p className="text-sm text-zinc-500">Permanently delete your account</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage your account security and authentication.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Password Change */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Change Password
                                    </h4>

                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-white">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showPasswords.current ? 'text' : 'password'}
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                    className="bg-zinc-800 border-zinc-700 text-white pr-10"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                                >
                                                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white">New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="bg-zinc-800 border-zinc-700 text-white pr-10"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                                    >
                                                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-white">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        value={passwordForm.confirmPassword}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="bg-zinc-800 border-zinc-700 text-white pr-10"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="bg-white text-black hover:bg-gray-200"
                                            disabled={passwordLoading}
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="pt-4 space-y-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Two-Factor Authentication
                                    </h4>

                                    <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${settings.twoFactorEnabled ? 'bg-green-500/20' : 'bg-zinc-800'}`}>
                                                <Shield className={`h-5 w-5 ${settings.twoFactorEnabled ? 'text-green-400' : 'text-zinc-400'}`} />
                                            </div>
                                            <div>
                                                <Label className="text-white">2FA Authentication</Label>
                                                <p className="text-sm text-zinc-500">
                                                    {settings.twoFactorEnabled
                                                        ? 'Your account is protected with 2FA'
                                                        : 'Add an extra layer of security'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleToggle('twoFactorEnabled')}
                                            className="border-zinc-600"
                                        >
                                            {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <Label className="text-white">Login Alerts</Label>
                                            <p className="text-sm text-zinc-500">Get notified of new sign-ins</p>
                                        </div>
                                        <Switch
                                            checked={settings.loginAlerts}
                                            onCheckedChange={() => handleToggle('loginAlerts')}
                                        />
                                    </div>
                                </div>

                                {/* Active Sessions */}
                                <div className="pt-4 space-y-4">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        Active Sessions
                                    </h4>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                    <Monitor className="h-5 w-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">Current Session</p>
                                                    <p className="text-sm text-zinc-500">Chrome on Windows • Now</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">Active</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full border-zinc-600">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out All Other Sessions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Settings;
