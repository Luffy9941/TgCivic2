import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, TestTube, UserCheck, AlertTriangle } from "lucide-react";

export const AdminNotificationTest = () => {
  const { user } = useAuth();
  const { addNotification, notifications, unreadCount } = useNotifications();

  if (!user || user.userType !== "admin") {
    return null;
  }

  const createTestNotification = (type: string) => {
    const notificationData = {
      complaint_high: {
        type: "complaint_submitted" as const,
        title: "🚨 TEST: High Priority Road Complaint",
        message:
          "ROADS: 'Dangerous pothole causing accidents' - Submitted by Test User (9999999999) at Test Location, Hyderabad. This is a test notification to verify admin notifications are working correctly.",
        complaintId: "TGC2024TEST001",
        userId: "all-admins",
        userRole: "admin" as const,
        priority: "high" as const,
        actionUrl: "/dashboard",
      },
      complaint_medium: {
        type: "complaint_submitted" as const,
        title: "📋 TEST: Medium Priority Water Complaint",
        message:
          "WATER: 'Water supply issue in area' - Submitted by Test User (9999999998) at Test Area, Secunderabad. Testing medium priority notification system.",
        complaintId: "TGC2024TEST002",
        userId: "all-admins",
        userRole: "admin" as const,
        priority: "medium" as const,
        actionUrl: "/dashboard",
      },
      system: {
        type: "system" as const,
        title: "🔧 TEST: System Notification",
        message:
          "This is a test system notification for admin users. All systems operational.",
        userId: "all-admins",
        userRole: "admin" as const,
        priority: "low" as const,
      },
    };

    const notification =
      notificationData[type as keyof typeof notificationData];
    if (notification) {
      addNotification(notification);
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <TestTube className="w-5 h-5" />
          Admin Notification Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Bell className="w-3 h-3" />
            {unreadCount} Unread
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            User: {user.userType}
          </Badge>
        </div>

        <div className="text-sm text-blue-800 mb-4">
          <p>Test notifications to verify admin complaint alerts:</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => createTestNotification("complaint_high")}
            className="border-red-200 text-red-800 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Test High Priority
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => createTestNotification("complaint_medium")}
            className="border-yellow-200 text-yellow-800 hover:bg-yellow-50"
          >
            <Bell className="w-4 h-4 mr-1" />
            Test Medium Priority
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => createTestNotification("system")}
            className="border-blue-200 text-blue-800 hover:bg-blue-50"
          >
            <TestTube className="w-4 h-4 mr-1" />
            Test System
          </Button>
        </div>

        <div className="text-xs text-blue-600">
          <p>Recent notifications: {notifications.length}</p>
          <p>
            Admin ID: {user.id} | Department: {user.department || "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
