import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useLanguage } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Trash2,
  MoreVertical,
  ArrowRight,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Calendar,
  User,
  Building2,
} from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [notificationSound, setNotificationSound] = useState(true);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "complaint_submitted":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "complaint_assigned":
        return <User className="w-5 h-5 text-yellow-600" />;
      case "complaint_resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "complaint_updated":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const today = notifications.filter(
      (n) => new Date(n.createdAt).toDateString() === new Date().toDateString(),
    ).length;

    return { total, unread, today };
  };

  const stats = getNotificationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              {t("notifications")}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 hidden sm:block">
              {t("stay_updated")}
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationSound(!notificationSound)}
              className="hidden sm:flex"
            >
              {notificationSound ? (
                <Volume2 className="w-4 h-4 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              Sound
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 sm:w-auto sm:px-3"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead}>
                  <Eye className="w-4 h-4 mr-2" />
                  {t("mark_all_read")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAllNotifications}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("clear_all")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {t("total")}
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <Bell className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {t("unread")}
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-red-600">
                    {stats.unread}
                  </p>
                </div>
                <AlertTriangle className="w-5 h-5 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {t("today")}
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-green-600">
                    {stats.today}
                  </p>
                </div>
                <Calendar className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-6">
            <Tabs
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <TabsList className="grid w-full grid-cols-3 h-8 sm:h-10">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2">
                  {t("all")} ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs sm:text-sm px-2">
                  {t("unread")} ({stats.unread})
                </TabsTrigger>
                <TabsTrigger value="read" className="text-xs sm:text-sm px-2">
                  {t("read")} ({stats.total - stats.unread})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-2 sm:space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="py-8 sm:py-16 text-center">
                <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {t("no_notifications_found")}
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  {filter === "unread"
                    ? t("all_caught_up")
                    : filter === "read"
                      ? "No read notifications to display."
                      : "You don't have any notifications yet."}
                </p>
                <Button
                  onClick={() => navigate("/register-complaint")}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Register a Complaint
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 bg-white rounded-lg border ${
                  !notification.isRead
                    ? "border-l-4 border-blue-500 bg-blue-50/20"
                    : "border-gray-200"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Mobile Compact Layout */}
                <div className="p-3 block sm:hidden">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {React.cloneElement(
                        getNotificationIcon(notification.type),
                        {
                          className: "w-4 h-4",
                        },
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Priority Row */}
                      <div className="flex items-start justify-between mb-1">
                        <h3
                          className={`text-sm font-medium leading-tight ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <Badge
                            className={`${getPriorityColor(notification.priority)} text-xs px-1.5 py-0.5`}
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-xs text-gray-600 leading-snug mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{formatTime(notification.createdAt)}</span>
                          {notification.complaintId && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="font-mono">
                                {notification.complaintId}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {notification.actionUrl && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5 p-0 hover:bg-gray-100"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="p-6 hidden sm:block">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge
                              className={getPriorityColor(
                                notification.priority,
                              )}
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(notification.createdAt)}</span>
                            </div>
                            {notification.complaintId && (
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span className="font-mono">
                                  {notification.complaintId}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.isRead && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm"
            >
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
