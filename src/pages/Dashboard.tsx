import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useComplaints } from "@/context/ComplaintContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSchemes } from "@/context/SchemesContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  User,
  Shield,
  Activity,
  Calendar,
  Globe,
  Zap,
  Target,
  PieChart,
} from "lucide-react";
import { AdminSchemeModal } from "@/components/AdminSchemeModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { complaints, getComplaintStats } = useComplaints();
  const { notifications, unreadCount, addNotification } = useNotifications();
  const {
    schemes,
    getTotalViews,
    getMostViewedScheme,
    getAllCategories,
    updateScheme,
    deleteScheme,
    addScheme,
    getSchemeById,
  } = useSchemes();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [schemeModalMode, setSchemeModalMode] = useState<
    "view" | "edit" | "create"
  >("view");

  const handleViewScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setSchemeModalMode("view");
    setIsSchemeModalOpen(true);
  };

  const handleEditScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setSchemeModalMode("edit");
    setIsSchemeModalOpen(true);
  };

  const handleCreateScheme = () => {
    setSelectedScheme(null);
    setSchemeModalMode("create");
    setIsSchemeModalOpen(true);
  };

  const handleSaveScheme = (schemeData: any) => {
    if (schemeModalMode === "create") {
      addScheme(schemeData);
    } else if (schemeModalMode === "edit" && selectedScheme) {
      updateScheme(selectedScheme.id, schemeData);
    }
    setIsSchemeModalOpen(false);
  };

  const handleDeleteScheme = (schemeId: string) => {
    deleteScheme(schemeId);
    setIsSchemeModalOpen(false);
  };

  // Debug logging
  console.log("Dashboard - User info:", {
    user,
    userType: user?.userType,
    isAuthenticated: !!user,
  });

  // Redirect non-admin users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Admin Dashboard Access
            </h1>
            <p className="text-gray-600 mb-6">
              Please log in with admin credentials to access the dashboard.
            </p>
            <AdminLoginHelper />
          </div>
        </div>
      </div>
    );
  }

  if (user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              This page is only accessible to admin users.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Current user:</strong> {user.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>User Type:</strong> {user.userType}
              </p>
              <p className="text-sm text-gray-500 mt-2">Required: admin</p>
            </div>
            <AdminLoginHelper />
          </div>
        </div>
      </div>
    );
  }

  const stats = getComplaintStats();

  // Calculate additional metrics
  const totalComplaints = stats.total;
  const resolvedComplaints = stats.resolved + stats.closed;
  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0;
  const avgResolutionTime = 3.2; // Mock data
  const userSatisfaction = 4.8; // Mock data

  // Category distribution data
  const categoryData = [
    { name: "Roads", count: 156, color: "bg-blue-500", percentage: 42 },
    { name: "Water", count: 134, color: "bg-green-500", percentage: 36 },
    { name: "Sanitation", count: 67, color: "bg-yellow-500", percentage: 18 },
    { name: "Electricity", count: 45, color: "bg-orange-500", percentage: 12 },
    { name: "Street Lights", count: 23, color: "bg-purple-500", percentage: 6 },
  ];

  // Schemes data from context
  const topScheme = getMostViewedScheme();
  const schemesData = {
    totalSchemes: schemes.length,
    totalViews: getTotalViews(),
    topScheme: topScheme?.name || "N/A",
    topSchemeViews: topScheme?.views || 0,
    categories: getAllCategories().length,
  };

  const allSchemes = schemes.slice(0, 3); // Show top 3 schemes

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20">
        {" "}
        {/* Account for fixed navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Complete platform management and oversight
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Administrator Access
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5 bg-white">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="complaints"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Complaints
              </TabsTrigger>
              <TabsTrigger value="schemes" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Schemes
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Resolution Rate
                      </h3>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {resolutionRate}%
                      </div>
                      <p className="text-xs text-gray-500">
                        Average resolution rate this month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Avg Resolution Time
                      </h3>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {avgResolutionTime}
                      </div>
                      <p className="text-xs text-gray-500">Days on average</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        User Satisfaction
                      </h3>
                      <div className="text-4xl font-bold text-yellow-600 mb-1">
                        {userSatisfaction}★
                      </div>
                      <p className="text-xs text-gray-500">Average rating</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Distribution */}
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {category.count}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schemes Tab */}
            <TabsContent value="schemes" className="space-y-6">
              {/* Scheme Manager Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Scheme Manager
                  </h2>
                  <p className="text-gray-600">
                    Manage government schemes and track their performance
                  </p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateScheme}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Scheme
                </Button>
              </div>

              {/* Scheme Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Schemes</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.totalSchemes}
                        </p>
                        <p className="text-xs text-gray-500">
                          Active government schemes
                        </p>
                      </div>
                      <Settings className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.totalViews}
                        </p>
                        <p className="text-xs text-gray-500">
                          Schemes page views
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Top Scheme</p>
                        <p className="text-lg font-bold text-gray-900">
                          {schemesData.topScheme}
                        </p>
                        <p className="text-xs text-gray-500">
                          {schemesData.topSchemeViews} views
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.categories}
                        </p>
                        <p className="text-xs text-gray-500">
                          Different categories
                        </p>
                      </div>
                      <Filter className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Schemes Table */}
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Schemes</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Scheme Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Department
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Views
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSchemes.map((scheme, index) => (
                          <tr
                            key={scheme.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {scheme.name}
                                </div>
                                <div className="text-sm text-gray-500 max-w-md truncate">
                                  {scheme.description}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                                {scheme.category}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {scheme.department}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {scheme.views}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {scheme.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewScheme(scheme)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditScheme(scheme)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedScheme(scheme);
                                    handleDeleteScheme(scheme.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaints Tab */}
            <TabsContent value="complaints" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {complaint.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {complaint.category} • {complaint.location}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            By {complaint.name} • {complaint.id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={
                              complaint.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : complaint.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {complaint.priority}
                          </Badge>
                          <Badge variant="outline">{complaint.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs content would be implemented similarly */}
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analytics Dashboard
                  </h2>
                  <p className="text-gray-600">
                    Insights and performance metrics
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="30days">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Complaints</p>
                        <p className="text-3xl font-bold">2,847</p>
                        <p className="text-sm text-blue-200">
                          +18% vs last month
                        </p>
                      </div>
                      <FileText className="w-10 h-10 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Resolution Rate</p>
                        <p className="text-3xl font-bold">94.2%</p>
                        <p className="text-sm text-green-200">
                          +2.1% improvement
                        </p>
                      </div>
                      <Target className="w-10 h-10 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Avg Resolution</p>
                        <p className="text-3xl font-bold">3.2 days</p>
                        <p className="text-sm text-orange-200">
                          -0.8 days faster
                        </p>
                      </div>
                      <Clock className="w-10 h-10 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">User Satisfaction</p>
                        <p className="text-3xl font-bold">4.8★</p>
                        <p className="text-sm text-purple-200">
                          +0.3 rating increase
                        </p>
                      </div>
                      <Star className="w-10 h-10 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Complaints Trend Chart */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Complaints Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Monthly complaint trends
                        </p>
                        <p className="text-sm text-gray-400">
                          Interactive chart visualization
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution Chart */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-green-600" />
                      Category Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Complaint categories breakdown
                        </p>
                        <p className="text-sm text-gray-400">
                          Pie chart visualization
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Department Performance */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "GHMC Roads",
                        complaints: 156,
                        resolved: 148,
                        rate: 94.8,
                        avg: 2.8,
                      },
                      {
                        name: "Water Board",
                        complaints: 134,
                        resolved: 128,
                        rate: 95.5,
                        avg: 3.1,
                      },
                      {
                        name: "Electricity",
                        complaints: 67,
                        resolved: 61,
                        rate: 91.0,
                        avg: 4.2,
                      },
                      {
                        name: "Sanitation",
                        complaints: 45,
                        resolved: 43,
                        rate: 95.5,
                        avg: 2.1,
                      },
                      {
                        name: "Street Lights",
                        complaints: 23,
                        resolved: 22,
                        rate: 95.6,
                        avg: 1.8,
                      },
                    ].map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {dept.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {dept.complaints} total complaints
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">
                              {dept.rate}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Resolution Rate
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">
                              {dept.avg} days
                            </p>
                            <p className="text-xs text-gray-500">Avg Time</p>
                          </div>
                          <div className="w-32">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${dept.rate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Telangana state map</p>
                        <p className="text-sm text-gray-400">
                          Heat map of complaint density
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-600" />
                      Top Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { area: "Hyderabad", count: 342, change: "+12%" },
                        { area: "Secunderabad", count: 287, change: "+8%" },
                        { area: "Warangal", count: 156, change: "+15%" },
                        { area: "Nizamabad", count: 134, change: "+5%" },
                        { area: "Karimnagar", count: 98, change: "+22%" },
                      ].map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {area.area}
                            </p>
                            <p className="text-sm text-gray-500">
                              {area.count} complaints
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {area.change}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: "2 minutes ago",
                        action: "New complaint registered",
                        details: "ROADS: Pothole in Hitec City",
                        type: "new",
                      },
                      {
                        time: "15 minutes ago",
                        action: "Complaint resolved",
                        details: "WATER: Supply issue in Jubilee Hills",
                        type: "resolved",
                      },
                      {
                        time: "1 hour ago",
                        action: "Status updated",
                        details: "SANITATION: Waste collection in Ameerpet",
                        type: "updated",
                      },
                      {
                        time: "2 hours ago",
                        action: "New user registered",
                        details: "Citizen account created",
                        type: "user",
                      },
                      {
                        time: "3 hours ago",
                        action: "Complaint assigned",
                        details: "ELECTRICITY: Power outage in Gachibowli",
                        type: "assigned",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "new"
                              ? "bg-blue-500"
                              : activity.type === "resolved"
                                ? "bg-green-500"
                                : activity.type === "updated"
                                  ? "bg-yellow-500"
                                  : activity.type === "user"
                                    ? "bg-purple-500"
                                    : "bg-orange-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {/* User Management Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h2>
                  <p className="text-gray-600">
                    Manage citizens and admin accounts
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">
                          1,247
                        </p>
                        <p className="text-xs text-gray-500">+12% this month</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Citizens</p>
                        <p className="text-2xl font-bold text-gray-900">
                          1,198
                        </p>
                        <p className="text-xs text-gray-500">Active users</p>
                      </div>
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Admins</p>
                        <p className="text-2xl font-bold text-gray-900">49</p>
                        <p className="text-xs text-gray-500">
                          System administrators
                        </p>
                      </div>
                      <Shield className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Today</p>
                        <p className="text-2xl font-bold text-gray-900">342</p>
                        <p className="text-xs text-gray-500">Online users</p>
                      </div>
                      <Activity className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    className="w-full"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="citizen">Citizens</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="active">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Users</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            User
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Type
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Department
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Last Login
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            name: "Rajesh Kumar",
                            email: "rajesh@email.com",
                            phone: "+91 98765 43210",
                            type: "Citizen",
                            department: "-",
                            lastLogin: "2 hours ago",
                            status: "Active",
                            avatar: "RK",
                          },
                          {
                            name: "Admin User",
                            email: "admin@tgcivic.gov.in",
                            phone: "+91 99999 99999",
                            type: "Admin",
                            department: "IT Department",
                            lastLogin: "5 minutes ago",
                            status: "Active",
                            avatar: "AU",
                          },
                          {
                            name: "Priya Sharma",
                            email: "priya@email.com",
                            phone: "+91 98765 43211",
                            type: "Citizen",
                            department: "-",
                            lastLogin: "1 day ago",
                            status: "Active",
                            avatar: "PS",
                          },
                          {
                            name: "GHMC Officer",
                            email: "officer@ghmc.gov.in",
                            phone: "+91 98765 43212",
                            type: "Admin",
                            department: "GHMC",
                            lastLogin: "3 hours ago",
                            status: "Active",
                            avatar: "GO",
                          },
                          {
                            name: "Mohammed Ali",
                            email: "mohammed@email.com",
                            phone: "+91 98765 43213",
                            type: "Citizen",
                            department: "-",
                            lastLogin: "5 days ago",
                            status: "Inactive",
                            avatar: "MA",
                          },
                        ].map((user, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                                  {user.avatar}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {user.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                className={
                                  user.type === "Admin"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {user.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {user.department}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {user.lastLogin}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                className={
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Notifications
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      {unreadCount} Unread
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Add a demo notification for testing
                        const { addNotification } = useNotifications();
                        addNotification({
                          type: "complaint_submitted",
                          title: "🚨 NEW HIGH PRIORITY COMPLAINT",
                          message:
                            "ROADS: 'Dangerous pothole causing accidents' - Submitted by Test User (9999999999) at Test Location. This is a test notification to demonstrate the system working.",
                          complaintId: "TGC2024TEST",
                          userId: "all-admins",
                          userRole: "admin",
                          priority: "high",
                          actionUrl: "/dashboard",
                        });
                      }}
                    >
                      + Add Test Notification
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/notifications")}
                    >
                      View All
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {notifications.slice(0, 10).map((notification) => (
                    <Card
                      key={notification.id}
                      className={`${!notification.isRead ? "border-l-4 border-l-red-500 bg-red-50/30" : "bg-white"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </span>
                              {notification.complaintId && (
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {notification.complaintId}
                                </span>
                              )}
                            </div>
                          </div>
                          {notification.complaintId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Find and scroll to the complaint in the complaints tab
                                setActiveTab("complaints");
                                // You could add more sophisticated navigation here
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {notifications.length === 0 && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-600 mb-2">
                          No Notifications
                        </h4>
                        <p className="text-gray-500">
                          New complaint notifications will appear here when
                          citizens submit complaints.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {notifications.length > 10 && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/notifications")
                        }
                      >
                        View All {notifications.length} Notifications
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Admin Scheme Modal */}
          <AdminSchemeModal
            scheme={selectedScheme}
            isOpen={isSchemeModalOpen}
            mode={schemeModalMode}
            onClose={() => setIsSchemeModalOpen(false)}
            onSave={handleSaveScheme}
            onDelete={handleDeleteScheme}
          />
        </div>
      </div>
    </div>
  );
};

// Helper component for quick admin login during development
const AdminLoginHelper = () => {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Use the default admin credentials
      const success = await login("admin@tgcivic.gov.in", "admin123", "admin");
      if (success) {
        // Reload the page to reflect the new auth state
        window.location.reload();
      } else {
        alert("Failed to log in as admin. Please check the credentials.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Error logging in as admin: " + error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">
          For demo purposes, you can quickly log in as admin:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Admin Credentials:</strong>
          </p>
          <p className="text-sm text-blue-700">Email: admin@tgcivic.gov.in</p>
          <p className="text-sm text-blue-700">Password: admin123</p>
        </div>
        <Button
          onClick={handleAdminLogin}
          disabled={isLoggingIn}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        >
          {isLoggingIn ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging in...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Quick Admin Login
            </>
          )}
        </Button>
      </div>
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/login")}
          className="w-full"
        >
          Go to Login Page
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
