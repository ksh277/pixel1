import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Bell, MessageCircle, Heart, Package, Settings, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface NotificationIconProps {
  type: string;
  className?: string;
}

const NotificationIcon = ({ type, className = "h-5 w-5" }: NotificationIconProps) => {
  switch (type) {
    case "comment":
      return <MessageCircle className={className} />;
    case "like":
      return <Heart className={className} />;
    case "order":
      return <Package className={className} />;
    case "system":
      return <Settings className={className} />;
    default:
      return <Bell className={className} />;
  }
};

export const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.is_read;
    return notification.type === filter;
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "like":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "order":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "system":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "comment":
        return "댓글";
      case "like":
        return "좋아요";
      case "order":
        return "주문";
      case "system":
        return "시스템";
      default:
        return "알림";
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">알림</h1>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                className="text-sm"
              >
                모두 읽음 처리 ({unreadCount})
              </Button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="text-sm"
            >
              전체 ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="text-sm"
            >
              안읽음 ({unreadCount})
            </Button>
            <Button
              variant={filter === "comment" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("comment")}
              className="text-sm"
            >
              댓글
            </Button>
            <Button
              variant={filter === "like" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("like")}
              className="text-sm"
            >
              좋아요
            </Button>
            <Button
              variant={filter === "order" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("order")}
              className="text-sm"
            >
              주문
            </Button>
            <Button
              variant={filter === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("system")}
              className="text-sm"
            >
              시스템
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">알림을 불러오는 중...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  알림이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === "all" ? "아직 받은 알림이 없습니다." : `${filter === "unread" ? "읽지 않은" : getNotificationTypeText(filter)} 알림이 없습니다.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: any) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                  notification.is_read
                    ? "bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700 border-l-gray-300 dark:border-l-gray-600"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 border-l-blue-500"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <NotificationIcon type={notification.type} className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${
                          notification.is_read
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-900 dark:text-white font-semibold"
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getNotificationTypeColor(notification.type)}`}
                          >
                            {getNotificationTypeText(notification.type)}
                          </Badge>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        notification.is_read
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {format(new Date(notification.created_at), "yyyy년 MM월 dd일 HH:mm")}
                        </span>
                        {notification.related_url && (
                          <Link href={notification.related_url}>
                            <Button variant="ghost" size="sm" className="text-xs">
                              보러가기
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};