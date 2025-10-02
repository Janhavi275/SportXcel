import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  Video, 
  Trophy, 
  Apple, 
  AlertCircle, 
  CheckCircle, 
  X,
  Clock,
  Star
} from 'lucide-react';

interface NotificationsProps {
  userRole: string;
}

export function Notifications({ userRole }: NotificationsProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'video_analyzed',
      title: 'Video Analysis Complete',
      message: 'Your running form analysis is ready for review',
      timestamp: '2 minutes ago',
      read: false,
      priority: 'high',
      icon: Video
    },
    {
      id: 2,
      type: 'achievement',
      title: 'New Badge Earned!',
      message: 'You\'ve earned the "Consistency Champion" badge',
      timestamp: '1 hour ago',
      read: false,
      priority: 'medium',
      icon: Trophy
    },
    {
      id: 3,
      type: 'nutrition',
      title: 'Meal Reminder',
      message: 'Time for your post-workout protein shake',
      timestamp: '3 hours ago',
      read: true,
      priority: 'low',
      icon: Apple
    },
    {
      id: 4,
      type: 'official_review',
      title: 'Official Review Completed',
      message: 'Coach Martinez has reviewed your technique video',
      timestamp: '5 hours ago',
      read: false,
      priority: 'high',
      icon: Star
    },
    {
      id: 5,
      type: 'alert',
      title: 'Training Schedule Update',
      message: 'Your next session has been moved to 6:00 PM',
      timestamp: '1 day ago',
      read: true,
      priority: 'medium',
      icon: AlertCircle
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-background border-primary/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <Badge 
                            variant={getPriorityBadgeVariant(notification.priority)}
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}