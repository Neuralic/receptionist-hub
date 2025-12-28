import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { businessApi, Business } from '@/lib/api';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

const bookingTrendsData = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 19 },
  { day: 'Wed', bookings: 15 },
  { day: 'Thu', bookings: 22 },
  { day: 'Fri', bookings: 28 },
  { day: 'Sat', bookings: 35 },
  { day: 'Sun', bookings: 18 },
];

const messageVolumeData = [
  { hour: '9AM', messages: 45 },
  { hour: '10AM', messages: 78 },
  { hour: '11AM', messages: 92 },
  { hour: '12PM', messages: 65 },
  { hour: '1PM', messages: 48 },
  { hour: '2PM', messages: 85 },
  { hour: '3PM', messages: 110 },
  { hour: '4PM', messages: 95 },
  { hour: '5PM', messages: 72 },
];

export default function Dashboard() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await businessApi.get();
      if (result.data) {
        setBusiness(result.data.business);
      }
      setIsLoading(false);
    };
    fetchBusiness();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  // Mock data when API doesn't return data
  const stats = {
    conversations: business?.monthlyConversations || 1247,
    bookings: 89,
    staff: business?.staff?.length || 5,
    conversionRate: 73,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here is your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slide-up opacity-0 stagger-1">
            <StatCard
              title="Total Conversations"
              value={stats.conversations.toLocaleString()}
              change={12}
              changeLabel="vs last month"
              icon={<MessageCircle className="w-6 h-6" />}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-2">
            <StatCard
              title="Bookings This Month"
              value={stats.bookings}
              change={8}
              changeLabel="vs last month"
              icon={<Calendar className="w-6 h-6" />}
              variant="success"
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-3">
            <StatCard
              title="Active Staff"
              value={stats.staff}
              icon={<Users className="w-6 h-6" />}
              variant="info"
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-4">
            <StatCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              change={5}
              changeLabel="vs last month"
              icon={<TrendingUp className="w-6 h-6" />}
              variant="warning"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="bookings" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Message Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Overview */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-semibold text-foreground">{business?.name || 'Luxe Beauty Studio'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-semibold text-foreground">{business?.businessType || 'Salon & Spa'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <Badge variant="secondary" className="mt-1">
                    {business?.plan || 'Professional'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Limit</p>
                  <p className="font-semibold text-foreground">
                    {stats.conversations.toLocaleString()} / {(business?.conversationLimit || 5000).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {business?.whatsappConnected !== false ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Services Active</p>
                  <p className="font-semibold text-foreground">{business?.services?.length || 8} services</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
