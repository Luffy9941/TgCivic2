import bcrypt from "bcryptjs";

export type UserType = "citizen" | "admin";

export interface CitizenData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: "citizen";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  isVerified: boolean;
  avatar?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: "admin";
  role: "super_admin" | "admin" | "moderator";
  department: string;
  employeeId: string;
  permissions: string[];
  isActive: boolean;
  avatar?: string;
  lastLogin?: string;
  loginHistory: {
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
  }[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserData = CitizenData | AdminData;

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  // Admin specific fields
  department?: string;
  employeeId?: string;
  role?: "super_admin" | "admin" | "moderator";
}

export interface LoginData {
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  role?: string;
  department?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
}

class ClientStorageService {
  private readonly CITIZENS_KEY = "tg_civic_citizens";
  private readonly ADMINS_KEY = "tg_civic_admins";

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    // Initialize with default admin if none exists
    const admins = this.getAdmins();
    if (admins.length === 0) {
      this.createDefaultAdmin();
    }
  }

  private async createDefaultAdmin() {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    const defaultAdmin: AdminData = {
      id: "admin_default_001",
      name: "System Administrator",
      email: "admin@tgcivic.gov.in",
      phone: "9999999999",
      password: hashedPassword,
      userType: "admin",
      role: "super_admin",
      department: "IT Department",
      employeeId: "TG2024ADMIN",
      permissions: [
        "read_complaints",
        "update_complaints",
        "delete_complaints",
        "manage_citizens",
        "manage_admins",
        "view_analytics",
        "system_settings",
        "bulk_operations",
        "export_data",
      ],
      isActive: true,
      loginHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveAdmin(defaultAdmin);
  }

  private getCitizens(): CitizenData[] {
    try {
      const data = localStorage.getItem(this.CITIZENS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading citizens:", error);
      return [];
    }
  }

  private getAdmins(): AdminData[] {
    try {
      const data = localStorage.getItem(this.ADMINS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading admins:", error);
      return [];
    }
  }

  private saveCitizen(citizen: CitizenData) {
    const citizens = this.getCitizens();
    const existingIndex = citizens.findIndex((c) => c.id === citizen.id);

    if (existingIndex >= 0) {
      citizens[existingIndex] = citizen;
    } else {
      citizens.push(citizen);
    }

    localStorage.setItem(this.CITIZENS_KEY, JSON.stringify(citizens));
  }

  private saveAdmin(admin: AdminData) {
    const admins = this.getAdmins();
    const existingIndex = admins.findIndex((a) => a.id === admin.id);

    if (existingIndex >= 0) {
      admins[existingIndex] = admin;
    } else {
      admins.push(admin);
    }

    localStorage.setItem(this.ADMINS_KEY, JSON.stringify(admins));
  }

  async register(userData: RegisterData): Promise<AuthUser | null> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      if (userData.userType === "citizen") {
        // Check if citizen already exists
        const citizens = this.getCitizens();
        const existingCitizen = citizens.find(
          (c) => c.email === userData.email || c.phone === userData.phone,
        );

        if (existingCitizen) {
          throw new Error("User with this email or phone already exists");
        }

        // Create new citizen
        const citizen: CitizenData = {
          id: `citizen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          userType: "citizen",
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.saveCitizen(citizen);

        return {
          id: citizen.id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          createdAt: citizen.createdAt,
        };
      } else if (userData.userType === "admin") {
        // Check if admin already exists
        const admins = this.getAdmins();
        const existingAdmin = admins.find(
          (a) =>
            a.email === userData.email ||
            a.phone === userData.phone ||
            a.employeeId === userData.employeeId,
        );

        if (existingAdmin) {
          throw new Error(
            "Admin with this email, phone, or employee ID already exists",
          );
        }

        // Create new admin
        const admin: AdminData = {
          id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          userType: "admin",
          department: userData.department || "Other",
          employeeId: userData.employeeId || `TG${Date.now()}`,
          role: userData.role || "admin",
          permissions: ["read_complaints", "update_complaints"],
          isActive: true,
          loginHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.saveAdmin(admin);

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          createdAt: admin.createdAt,
        };
      }

      throw new Error("Invalid user type");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<AuthUser | null> {
    try {
      if (loginData.userType === "citizen") {
        const citizens = this.getCitizens();
        const citizen = citizens.find((c) => c.email === loginData.email);

        if (!citizen) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          loginData.password,
          citizen.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Update last login
        citizen.lastLogin = new Date().toISOString();
        citizen.updatedAt = new Date().toISOString();
        this.saveCitizen(citizen);

        return {
          id: citizen.id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          lastLogin: citizen.lastLogin,
          createdAt: citizen.createdAt,
        };
      } else if (loginData.userType === "admin") {
        const admins = this.getAdmins();
        const admin = admins.find(
          (a) => a.email === loginData.email && a.isActive,
        );

        if (!admin) {
          throw new Error("Invalid credentials or account inactive");
        }

        const isPasswordValid = await bcrypt.compare(
          loginData.password,
          admin.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Update last login and add to login history
        admin.lastLogin = new Date().toISOString();
        admin.updatedAt = new Date().toISOString();
        admin.loginHistory.push({
          timestamp: new Date().toISOString(),
          ipAddress: "127.0.0.1", // Mock IP
          userAgent: navigator.userAgent,
        });

        // Keep only last 50 login history entries
        if (admin.loginHistory.length > 50) {
          admin.loginHistory = admin.loginHistory.slice(-50);
        }

        this.saveAdmin(admin);

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
        };
      }

      throw new Error("Invalid user type");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async getUserById(id: string, userType: UserType): Promise<AuthUser | null> {
    try {
      if (userType === "citizen") {
        const citizens = this.getCitizens();
        const citizen = citizens.find((c) => c.id === id);
        if (!citizen) return null;

        return {
          id: citizen.id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          lastLogin: citizen.lastLogin,
          createdAt: citizen.createdAt,
        };
      } else if (userType === "admin") {
        const admins = this.getAdmins();
        const admin = admins.find((a) => a.id === id);
        if (!admin) return null;

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
        };
      }

      return null;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }

  // Utility methods for debugging
  getAllUsers() {
    return {
      citizens: this.getCitizens(),
      admins: this.getAdmins(),
    };
  }

  clearAllUsers() {
    localStorage.removeItem(this.CITIZENS_KEY);
    localStorage.removeItem(this.ADMINS_KEY);
    this.initializeDefaultUsers();
  }
}

export const clientStorageService = new ClientStorageService();
