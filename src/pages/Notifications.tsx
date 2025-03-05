
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, Trash, Filter, Clock, Bell, RefreshCw } from 'lucide-react';

// Mock data for notifications
const mockNotifications = [
  { 
    id: '1', 
    title: 'System Maintenance', 
    message: 'The system will be down for maintenance on Sunday, June 15th from 2:00 AM to 5:00 AM.',
    recipients: 'All Users',
    sentBy: 'System Admin',
    sentAt: '2023-06-10T14:30:00',
    status: 'Sent'
  },
  { 
    id: '2', 
    title: 'New Feature Released', 
    message: 'We have released a new feature for property managers. Check it out in your dashboard!',
    recipients: 'Managers',
    sentBy: 'System Admin',
    sentAt: '2023-06-08T10:15:00',
    status: 'Sent'
  },
  { 
    id: '3', 
    title: 'Payment Reminder', 
    message: 'This is a friendly reminder that your payment is due in 3 days.',
    recipients: 'Clients',
    sentBy: 'System Admin',
    sentAt: '2023-06-05T09:00:00',
    status: 'Sent'
  },
  { 
    id: '4', 
    title: 'Welcome to RentalKE', 
    message: 'Welcome to our platform! Get started by completing your profile.',
    recipients: 'New Users',
    sentBy: 'System Admin',
    sentAt: '2023-06-02T16:45:00',
    status: 'Sent'
  },
  { 
    id: '5', 
    title: 'Holiday Hours', 
    message: 'Our office will be closed on Monday, July 4th for the holiday.',
    recipients: 'All Users',
    sentBy: 'System Admin',
    sentAt: '2023-06-01T11:30:00',
    status: 'Sent'
  },
];

// Mock scheduled notifications
const mockScheduledNotifications = [
  { 
    id: '6', 
    title: 'Upcoming Maintenance', 
    message: 'We will be performing routine maintenance next week.',
    recipients: 'All Users',
    scheduledFor: '2023-06-20T03:00:00',
    status: 'Scheduled'
  },
  { 
    id: '7', 
    title: 'Quarterly Review', 
    message: 'Time to complete your quarterly performance review.',
    recipients: 'Managers',
    scheduledFor: '2023-07-01T09:00:00',
    status: 'Scheduled'
  },
];

const NotificationsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('send');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [notificationsList, setNotificationsList] = useState(mockNotifications);
  const [scheduledNotifications, setScheduledNotifications] = useState(mockScheduledNotifications);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      recipients: recipient === 'all' 
        ? 'All Users' 
        : recipient === 'managers' 
          ? 'Managers' 
          : 'Clients',
      sentBy: 'System Admin',
      sentAt: new Date().toISOString(),
      status: 'Sent'
    };
    
    setNotificationsList([newNotification, ...notificationsList]);
    
    toast({
      title: "Success",
      description: "Notification sent successfully",
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setRecipient('all');
  };
  
  const handleScheduleNotification = () => {
    if (!title || !message || !scheduleDate || !scheduleTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const scheduledDateTime = `${scheduleDate}T${scheduleTime}:00`;
    
    const newScheduledNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      recipients: recipient === 'all' 
        ? 'All Users' 
        : recipient === 'managers' 
          ? 'Managers' 
          : 'Clients',
      scheduledFor: scheduledDateTime,
      status: 'Scheduled'
    };
    
    setScheduledNotifications([newScheduledNotification, ...scheduledNotifications]);
    
    toast({
      title: "Success",
      description: "Notification scheduled successfully",
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setRecipient('all');
    setScheduleDate('');
    setScheduleTime('');
  };
  
  const handleDeleteNotification = (id: string, isScheduled: boolean = false) => {
    if (isScheduled) {
      setScheduledNotifications(scheduledNotifications.filter(notification => notification.id !== id));
    } else {
      setNotificationsList(notificationsList.filter(notification => notification.id !== id));
    }
    
    toast({
      title: "Success",
      description: "Notification deleted successfully",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to users in the system
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="send" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
              <CardDescription>
                Create and send notifications to users in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  Notification Title*
                </label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="message">
                  Message*
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="recipient">
                  Send To
                </label>
                <Select
                  value={recipient}
                  onValueChange={setRecipient}
                >
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="Select recipient group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="managers">Managers Only</SelectItem>
                    <SelectItem value="clients">Clients Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {activeTab === 'send' ? (
                <Button 
                  className="w-full mt-4"
                  onClick={handleSendNotification}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification Now
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="date">
                        Schedule Date*
                      </label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="time">
                        Schedule Time*
                      </label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={handleScheduleNotification}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule Notification
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View all notifications that have been sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of sent notifications.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Recipients</TableHead>
                    <TableHead className="hidden md:table-cell">Sent By</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationsList.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{notification.recipients}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{notification.sentBy}</TableCell>
                      <TableCell>{formatDate(notification.sentAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Notifications</CardTitle>
              <CardDescription>
                View and manage scheduled notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of scheduled notifications.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Recipients</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{notification.recipients}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(notification.scheduledFor)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNotification(notification.id, true)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
