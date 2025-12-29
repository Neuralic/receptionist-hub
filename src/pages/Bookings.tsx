import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookingsApi, Booking, BookingStatus } from '@/lib/api';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  List,
  Grid3X3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

const mockBookings: Booking[] = [
  {
    id: '1',
    customer: { name: 'Amanda Foster', whatsappNumber: '+1 (555) 111-2222' },
    service: { name: 'Premium Haircut' },
    staff: { name: 'Sarah Johnson' },
    startTime: '2024-12-28T10:00:00',
    endTime: '2024-12-28T10:45:00',
    status: 'confirmed',
  },
  {
    id: '2',
    customer: { name: 'Robert Martinez', whatsappNumber: '+1 (555) 222-3333' },
    service: { name: 'Deep Tissue Massage' },
    staff: { name: 'Michael Chen' },
    startTime: '2024-12-28T14:00:00',
    endTime: '2024-12-28T15:30:00',
    status: 'pending',
  },
  {
    id: '3',
    customer: { name: 'Lisa Thompson', whatsappNumber: '+1 (555) 333-4444' },
    service: { name: 'Gel Manicure' },
    staff: { name: 'Emily Rodriguez' },
    startTime: '2024-12-29T11:00:00',
    endTime: '2024-12-29T12:00:00',
    status: 'confirmed',
  },
  {
    id: '4',
    customer: { name: 'James Wilson', whatsappNumber: '+1 (555) 444-5555' },
    service: { name: 'Facial Treatment' },
    staff: { name: 'Jessica Williams' },
    startTime: '2024-12-29T15:00:00',
    endTime: '2024-12-29T16:00:00',
    status: 'pending',
  },
  {
    id: '5',
    customer: { name: 'Nancy Brown', whatsappNumber: '+1 (555) 555-6666' },
    service: { name: 'Hair Coloring' },
    staff: { name: 'Sarah Johnson' },
    startTime: '2024-12-27T09:00:00',
    endTime: '2024-12-27T11:00:00',
    status: 'completed',
  },
  {
    id: '6',
    customer: { name: 'Kevin Lee', whatsappNumber: '+1 (555) 666-7777' },
    service: { name: 'Premium Haircut' },
    staff: { name: 'David Kim' },
    startTime: '2024-12-26T16:00:00',
    endTime: '2024-12-26T16:45:00',
    status: 'cancelled',
  },
];

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle2; className: string }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: AlertCircle, className: 'bg-warning/10 text-warning border-0' },
  confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircle2, className: 'bg-success/10 text-success border-0' },
  completed: { label: 'Completed', variant: 'outline', icon: CheckCircle2, className: 'bg-muted text-muted-foreground border-0' },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle, className: 'bg-destructive/10 text-destructive border-0' },
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      const result = await bookingsApi.getAll();
      if (result.data) {
        setBookings(result.data.bookings);
      } else {
        setBookings(mockBookings);
      }
      setIsLoading(false);
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await bookingsApi.updateStatus(id, status);
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    toast({ title: `Booking ${status}` });
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getBookingsForDay = (day: Date) => {
    return bookings.filter(b => isSameDay(parseISO(b.startTime), day));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading bookings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground">Manage customer appointments and schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="h-8"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('calendar')}
                className="h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as BookingStatus | 'all')} className="animate-fade-in">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {view === 'list' ? (
          filteredBookings.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="w-8 h-8 text-muted-foreground" />}
              title="No bookings found"
              description={filter === 'all' 
                ? "Bookings will appear here when customers schedule appointments"
                : `No ${filter} bookings at the moment`
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking, index) => {
                const statusInfo = statusConfig[booking.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card 
                    key={booking.id}
                    className="bg-card border-border hover:shadow-elevated transition-all duration-300 animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {booking.customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-foreground">{booking.service.name}</h3>
                              <Badge variant={statusInfo.variant} className={statusInfo.className}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{booking.customer.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{format(parseISO(booking.startTime), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{format(parseISO(booking.startTime), 'h:mm a')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-16 lg:ml-0">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          <Card className="bg-card border-border animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 min-h-[100px] bg-card" />
                ))}
                {daysInMonth.map(day => {
                  const dayBookings = getBookingsForDay(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-2 min-h-[100px] bg-card ${
                        isToday(day) ? 'ring-2 ring-primary ring-inset' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayBookings.slice(0, 2).map(booking => (
                          <div
                            key={booking.id}
                            className={`text-xs p-1.5 rounded truncate ${
                              booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                              booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                              booking.status === 'completed' ? 'bg-muted text-muted-foreground' :
                              'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {format(parseISO(booking.startTime), 'h:mm a')}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1">+{dayBookings.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
