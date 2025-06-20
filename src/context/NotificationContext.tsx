import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  type:
    | "complaint_submitted"
    | "complaint_assigned"
    | "complaint_resolved"
    | "complaint_updated"
    | "system";
  title: string;
  message: string;
  complaintId?: string;
  userId: string;
  userRole: "citizen" | "admin" | "official";
  isRead: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "isRead">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByUser: (userId: string, userRole: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("tg-civic-notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error("Error loading notifications from localStorage:", error);
      }
    } else {
      // Initialize with sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: "notification-001",
          type: "complaint_submitted",
          title: "🚨 NEW HIGH PRIORITY COMPLAINT",
          message:
            "ROADS: 'Dangerous pothole causing accidents' - Submitted by Rajesh Kumar (9876543210) at Hitec City, Cyber Towers. This pothole is causing multiple accidents daily and needs immediate attention.",
          complaintId: "TGC2024001234",
          userId: "all-admins",
          userRole: "admin",
          priority: "high",
          actionUrl: "/dashboard",
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          isRead: false,
        },
        {
          id: "notification-004",
          type: "complaint_submitted",
          title: "📋 NEW MEDIUM PRIORITY COMPLAINT",
          message:
            "WATER: 'No water supply for 3 days' - Submitted by Priya Sharma (9876543211) at Jubilee Hills Check Post. Entire colony affected, residents requesting immediate action.",
          complaintId: "TGC2024001235",
          userId: "all-admins",
          userRole: "admin",
          priority: "medium",
          actionUrl: "/dashboard",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
        },
        {
          id: "notification-005",
          type: "complaint_submitted",
          title: "🚨 NEW HIGH PRIORITY COMPLAINT",
          message:
            "STREET-LIGHTS: 'Dark street causing safety concerns' - Submitted by Mohammed Ali (9876543212) at Gachibowli Main Road. Multiple street lights not working, safety risk for pedestrians.",
          complaintId: "TGC2024001236",
          userId: "all-admins",
          userRole: "admin",
          priority: "high",
          actionUrl: "/dashboard",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          isRead: false,
        },
        {
          id: "notif-002",
          type: "complaint_resolved",
          title: "Your Complaint Resolved",
          message:
            "Your water supply issue complaint has been successfully resolved",
          complaintId: "TGC2024001235",
          userId: "citizen-001",
          userRole: "citizen",
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          actionUrl: "/track-complaint",
        },
        {
          id: "notif-003",
          type: "system",
          title: "System Maintenance",
          message: "Scheduled maintenance will occur tonight from 2-4 AM",
          userId: "all",
          userRole: "admin",
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: "low",
        },
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem(
        "tg-civic-notifications",
        JSON.stringify(sampleNotifications),
      );
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(
        "tg-civic-notifications",
        JSON.stringify(notifications),
      );
    }
  }, [notifications]);

  const generateNotificationId = (): string => {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "createdAt" | "isRead">,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateNotificationId(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.userId === user.id ||
        notification.userId === "all" ||
        notification.userRole === user.userType ||
        (user.userType === "admin" && notification.userId === "all-admins")
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAllNotifications = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.userId !== user.id &&
          notification.userId !== "all" &&
          notification.userRole !== user.userType &&
          !(user.userType === "admin" && notification.userId === "all-admins"),
      ),
    );
  };

  const getNotificationsByUser = (
    userId: string,
    userRole: string,
  ): Notification[] => {
    return notifications.filter(
      (notification) =>
        notification.userId === userId ||
        notification.userId === "all" ||
        notification.userRole === userRole ||
        (userRole === "admin" && notification.userId === "all-admins") ||
        (userRole === "official" && notification.userId === "all-officials") ||
        (userRole === "admin" && notification.userId === "admin-001"), // Support legacy admin notifications
    );
  };

  const userNotifications = user
    ? getNotificationsByUser(user.id, user.userType)
    : [];

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const value: NotificationContextType = {
    notifications: userNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByUser,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
