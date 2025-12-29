import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { staffApi, Staff } from '@/lib/api';
import { Plus, Pencil, Trash2, Phone, Mail, Users, Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockStaff: Staff[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@luxebeauty.com', phone: '+1 (555) 123-4567', calendarConnected: true },
  { id: '2', name: 'Michael Chen', email: 'michael@luxebeauty.com', phone: '+1 (555) 234-5678', calendarConnected: true },
  { id: '3', name: 'Emily Rodriguez', email: 'emily@luxebeauty.com', phone: '+1 (555) 345-6789', calendarConnected: false },
  { id: '4', name: 'David Kim', email: 'david@luxebeauty.com', phone: '+1 (555) 456-7890', calendarConnected: true },
  { id: '5', name: 'Jessica Williams', email: 'jessica@luxebeauty.com', phone: '+1 (555) 567-8901', calendarConnected: false },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaff = async () => {
      const result = await staffApi.getAll();
      if (result.data) {
        setStaff(result.data.staff);
      } else {
        setStaff(mockStaff);
      }
      setIsLoading(false);
    };
    fetchStaff();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingStaff(null);
  };

  const handleOpenDialog = (member?: Staff) => {
    if (member) {
      setEditingStaff(member);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingStaff) {
      const result = await staffApi.update(editingStaff.id, formData);
      if (result.data) {
        setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
      } else {
        setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
      }
      toast({ title: 'Staff member updated successfully' });
    } else {
      const result = await staffApi.create(formData);
      if (result.data) {
        setStaff([...staff, result.data.staff]);
      } else {
        const newStaff = { ...formData, id: Date.now().toString(), calendarConnected: false };
        setStaff([...staff, newStaff]);
      }
      toast({ title: 'Staff member added successfully' });
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await staffApi.delete(id);
    setStaff(staff.filter(s => s.id !== id));
    toast({ title: 'Staff member removed successfully' });
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=128`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading staff..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff</h1>
            <p className="text-muted-foreground">Manage your team members and their availability</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
                <DialogDescription>
                  {editingStaff ? 'Update the staff member details' : 'Add a new team member to your business'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingStaff ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Staff Grid */}
        {staff.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8 text-muted-foreground" />}
            title="No staff members yet"
            description="Add your team members so customers can book appointments with them"
            actionLabel="Add Staff Member"
            onAction={() => handleOpenDialog()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, index) => (
              <Card 
                key={member.id}
                className="bg-card border-border hover:shadow-elevated transition-all duration-300 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={getAvatarUrl(member.name)}
                      alt={member.name}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg truncate">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        {member.calendarConnected ? (
                          <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Calendar Synced
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning border-0">
                            <XCircle className="w-3 h-3" />
                            Not Synced
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(member)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={member.calendarConnected}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
