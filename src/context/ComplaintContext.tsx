import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  landmark: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "assigned" | "in-progress" | "resolved" | "closed";
  name: string;
  phone: string;
  email: string;
  images: string[]; // base64 encoded images
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
  estimatedResolution?: string;
  history: {
    timestamp: string;
    status: string;
    notes: string;
    updatedBy: string;
  }[];
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (
    complaint: Omit<
      Complaint,
      "id" | "createdAt" | "updatedAt" | "status" | "history"
    >,
  ) => string;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => boolean;
  getComplaintById: (id: string) => Complaint | undefined;
  getComplaintsByPhone: (phone: string) => Complaint[];
  updateComplaintStatus: (
    id: string,
    status: Complaint["status"],
    notes: string,
    updatedBy: string,
    notificationCallback?: (notification: any) => void,
  ) => void;
  bulkUpdateStatus: (
    ids: string[],
    status: Complaint["status"],
    notes: string,
    updatedBy: string,
  ) => void;
  deleteResolvedComplaints: () => number;
  getComplaintStats: () => {
    total: number;
    pending: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  getComplaintsByDateRange: (startDate: string, endDate: string) => Complaint[];
  getComplaintsByCategory: (category: string) => Complaint[];
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(
  undefined,
);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
};

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // We'll access notifications through a separate hook in the component that uses this

  // Load complaints from localStorage on mount
  useEffect(() => {
    const savedComplaints = localStorage.getItem("tg-civic-complaints");
    if (savedComplaints) {
      try {
        setComplaints(JSON.parse(savedComplaints));
      } catch (error) {
        console.error("Error loading complaints from localStorage:", error);
      }
    } else {
      // Initialize with sample data if no saved complaints
      const sampleComplaints: Complaint[] = [
        {
          id: "TGC2024001234",
          title: "Road damage near IT Hub",
          description:
            "Large pothole causing traffic issues and vehicle damage",
          category: "roads",
          subcategory: "Potholes",
          location: "17.4485835, 78.3908034",
          landmark: "Near Cyber Towers",
          priority: "high",
          status: "in-progress",
          name: "Rajesh Kumar",
          phone: "9876543210",
          email: "rajesh.kumar@email.com",
          images: [],
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T14:20:00Z",
          assignedTo: "GHMC Roads Department",
          estimatedResolution: "2024-01-20",
          history: [
            {
              timestamp: "2024-01-15T10:30:00Z",
              status: "pending",
              notes: "Complaint registered",
              updatedBy: "System",
            },
            {
              timestamp: "2024-01-15T16:45:00Z",
              status: "assigned",
              notes: "Assigned to GHMC Roads Department",
              updatedBy: "Admin",
            },
            {
              timestamp: "2024-01-16T14:20:00Z",
              status: "in-progress",
              notes: "Work started, materials arranged",
              updatedBy: "GHMC Roads Department",
            },
          ],
        },
        {
          id: "TGC2024001235",
          title: "Water supply issue in Jubilee Hills",
          description: "No water supply for the past 3 days in our area",
          category: "water",
          subcategory: "Water Shortage",
          location: "17.4326, 78.4071",
          landmark: "Jubilee Hills Check Post",
          priority: "medium",
          status: "resolved",
          name: "Priya Sharma",
          phone: "9876543211",
          email: "priya.sharma@email.com",
          images: [],
          createdAt: "2024-01-10T08:15:00Z",
          updatedAt: "2024-01-12T17:30:00Z",
          assignedTo: "Hyderabad Water Board",
          resolutionNotes: "Pipeline repaired and water supply restored",
          history: [
            {
              timestamp: "2024-01-10T08:15:00Z",
              status: "pending",
              notes: "Complaint registered",
              updatedBy: "System",
            },
            {
              timestamp: "2024-01-10T12:30:00Z",
              status: "assigned",
              notes: "Assigned to Water Board technical team",
              updatedBy: "Admin",
            },
            {
              timestamp: "2024-01-11T09:00:00Z",
              status: "in-progress",
              notes: "Pipeline issue identified, repair work started",
              updatedBy: "Water Board",
            },
            {
              timestamp: "2024-01-12T17:30:00Z",
              status: "resolved",
              notes: "Pipeline repaired and water supply restored",
              updatedBy: "Water Board",
            },
          ],
        },
      ];
      setComplaints(sampleComplaints);
      localStorage.setItem(
        "tg-civic-complaints",
        JSON.stringify(sampleComplaints),
      );
    }
  }, []);

  // Save complaints to localStorage whenever complaints change
  useEffect(() => {
    localStorage.setItem("tg-civic-complaints", JSON.stringify(complaints));
  }, [complaints]);

  const generateComplaintId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");
    return `TGC${year}${randomNum}`;
  };

  const addComplaint = (
    complaintData: Omit<
      Complaint,
      "id" | "createdAt" | "updatedAt" | "status" | "history"
    >,
  ): string => {
    const id = generateComplaintId();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...complaintData,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      history: [
        {
          timestamp: now,
          status: "pending",
          notes: "Complaint registered successfully",
          updatedBy: "System",
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return id;
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, ...updates, updatedAt: new Date().toISOString() }
          : complaint,
      ),
    );
  };

  const deleteComplaint = (id: string): boolean => {
    const complaintExists = complaints.some((complaint) => complaint.id === id);
    if (complaintExists) {
      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
      return true;
    }
    return false;
  };

  const bulkUpdateStatus = (
    ids: string[],
    status: Complaint["status"],
    notes: string,
    updatedBy: string,
  ) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((complaint) =>
        ids.includes(complaint.id)
          ? {
              ...complaint,
              status,
              updatedAt: timestamp,
              history: [
                ...complaint.history,
                {
                  timestamp,
                  status,
                  notes,
                  updatedBy,
                },
              ],
            }
          : complaint,
      ),
    );
  };

  const deleteResolvedComplaints = (): number => {
    const resolvedCount = complaints.filter(
      (complaint) => complaint.status === "resolved",
    ).length;
    setComplaints((prev) =>
      prev.filter((complaint) => complaint.status !== "resolved"),
    );
    return resolvedCount;
  };

  const getComplaintsByDateRange = (
    startDate: string,
    endDate: string,
  ): Complaint[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return complaints.filter((complaint) => {
      const createdDate = new Date(complaint.createdAt);
      return createdDate >= start && createdDate <= end;
    });
  };

  const getComplaintsByCategory = (category: string): Complaint[] => {
    return complaints.filter((complaint) => complaint.category === category);
  };

  const updateComplaintStatus = (
    id: string,
    status: Complaint["status"],
    notes: string,
    updatedBy: string,
    notificationCallback?: (notification: any) => void,
  ) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint = {
            ...complaint,
            status,
            updatedAt: new Date().toISOString(),
            history: [
              ...complaint.history,
              {
                timestamp: new Date().toISOString(),
                status,
                notes,
                updatedBy,
              },
            ],
          };

          // Send notification to complaint owner if resolved
          if (status === "resolved" && notificationCallback) {
            notificationCallback({
              type: "complaint_resolved",
              title: "Your Complaint Has Been Resolved!",
              message: `Your complaint "${complaint.title}" has been successfully resolved. ${notes}`,
              complaintId: complaint.id,
              userId: complaint.phone, // Using phone as user identifier
              userRole: "citizen",
              priority: "high",
              actionUrl: "/track-complaint",
            });
          } else if (status === "assigned" && notificationCallback) {
            notificationCallback({
              type: "complaint_assigned",
              title: "Complaint Assigned",
              message: `Your complaint "${complaint.title}" has been assigned to ${updatedBy}. ${notes}`,
              complaintId: complaint.id,
              userId: complaint.phone,
              userRole: "citizen",
              priority: "medium",
              actionUrl: "/track-complaint",
            });
          } else if (status === "in-progress" && notificationCallback) {
            notificationCallback({
              type: "complaint_updated",
              title: "Complaint Update",
              message: `Work has started on your complaint "${complaint.title}". ${notes}`,
              complaintId: complaint.id,
              userId: complaint.phone,
              userRole: "citizen",
              priority: "medium",
              actionUrl: "/track-complaint",
            });
          }

          return updatedComplaint;
        }
        return complaint;
      }),
    );
  };

  const getComplaintById = (id: string): Complaint | undefined => {
    return complaints.find((complaint) => complaint.id === id);
  };

  const getComplaintsByPhone = (phone: string): Complaint[] => {
    return complaints.filter((complaint) => complaint.phone === phone);
  };

  const getComplaintStats = () => {
    const stats = complaints.reduce(
      (acc, complaint) => {
        acc.total += 1;
        switch (complaint.status) {
          case "pending":
            acc.pending += 1;
            break;
          case "assigned":
            acc.assigned += 1;
            break;
          case "in-progress":
            acc.inProgress += 1;
            break;
          case "resolved":
            acc.resolved += 1;
            break;
          case "closed":
            acc.closed += 1;
            break;
        }
        return acc;
      },
      {
        total: 0,
        pending: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
      },
    );

    return stats;
  };

  const value: ComplaintContextType = {
    complaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintById,
    getComplaintsByPhone,
    updateComplaintStatus,
    bulkUpdateStatus,
    deleteResolvedComplaints,
    getComplaintStats,
    getComplaintsByDateRange,
    getComplaintsByCategory,
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};
