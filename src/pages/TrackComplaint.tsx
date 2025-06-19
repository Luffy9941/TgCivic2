import { useState } from "react";
import { useComplaints } from "@/context/ComplaintContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  User,
  Building2,
  Eye,
  Phone,
  Mail,
  Camera,
  History,
  MapPinIcon,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackComplaint = () => {
  const navigate = useNavigate();
  const { complaints, getComplaintById, getComplaintsByPhone } =
    useComplaints();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(complaints.slice(0, 5));
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(complaints.slice(0, 5));
      return;
    }

    // Search by complaint ID or phone number
    let results = [];

    if (searchTerm.startsWith("TSC")) {
      // Search by complaint ID
      const complaint = getComplaintById(searchTerm);
      results = complaint ? [complaint] : [];
    } else if (/^\d{10}$/.test(searchTerm)) {
      // Search by phone number (10 digits)
      results = getComplaintsByPhone(searchTerm);
    } else {
      // Search in all fields
      results = complaints.filter(
        (complaint) =>
          complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.phone.includes(searchTerm),
      );
    }

    setSearchResults(results);
  };

  const viewComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint);
    setShowDetailsDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "assigned":
        return <User className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "assigned":
        return "Assigned";
      case "pending":
        return "Pending";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  TG Civic
                </span>
                <span className="text-xs text-gray-600 ml-2">
                  Track Complaint
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Track Your Complaint
          </h1>
          <p className="text-lg text-gray-600">
            Enter your complaint ID or phone number to check status
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Complaint
            </CardTitle>
            <CardDescription>
              Enter your complaint ID (e.g., TSC2024001234) or registered phone
              number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Complaint ID or Phone Number"
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchTerm
                ? `Search Results (${searchResults.length})`
                : "Recent Complaints"}
            </h2>
            {searchTerm && searchResults.length === 0 && (
              <Badge variant="secondary">No complaints found</Badge>
            )}
          </div>

          {searchResults.length === 0 && searchTerm ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No complaints found
                </h3>
                <p className="text-gray-600">
                  Please check your complaint ID or phone number and try again.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults(complaints.slice(0, 5));
                  }}
                >
                  Show All Complaints
                </Button>
              </CardContent>
            </Card>
          ) : (
            searchResults.map((complaint) => (
              <Card
                key={complaint.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-mono text-sm text-blue-600 font-medium">
                          {complaint.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(complaint.priority)}
                        >
                          {complaint.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {complaint.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {complaint.landmark ||
                            complaint.location.split(",")[0]}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(complaint.createdAt)}
                        </div>
                        <Badge variant="secondary">
                          {complaint.subcategory}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className={getStatusColor(complaint.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(complaint.status)}
                            {getStatusDisplayName(complaint.status)}
                          </span>
                        </Badge>
                        {complaint.assignedTo && (
                          <span className="text-sm text-gray-600">
                            • Assigned to {complaint.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewComplaintDetails(complaint)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you can't find your complaint or need assistance, please
                  contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Live Chat Support
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Helpline: 1800-XXX-XXXX
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Complaint Details
                </DialogTitle>
                <DialogDescription>
                  Complete information about complaint {selectedComplaint.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Complaint ID
                    </Label>
                    <p className="font-mono text-lg font-bold text-blue-600">
                      {selectedComplaint.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Current Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={getStatusColor(selectedComplaint.status)}
                      >
                        {getStatusIcon(selectedComplaint.status)}
                        <span className="ml-1">
                          {getStatusDisplayName(selectedComplaint.status)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Issue Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedComplaint.title}
                    </h4>
                    <p className="text-gray-700 mb-3">
                      {selectedComplaint.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {selectedComplaint.subcategory}
                      </Badge>
                      <Badge
                        className={getPriorityColor(selectedComplaint.priority)}
                      >
                        {selectedComplaint.priority.toUpperCase()} Priority
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Location
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-gray-900">
                          {selectedComplaint.location}
                        </p>
                        {selectedComplaint.landmark && (
                          <p className="text-gray-600 text-sm">
                            Near: {selectedComplaint.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">
                          {selectedComplaint.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">
                          {selectedComplaint.phone}
                        </span>
                      </div>
                      {selectedComplaint.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">
                            {selectedComplaint.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images */}
                {selectedComplaint.images &&
                  selectedComplaint.images.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Images
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedComplaint.images.map(
                          (image: string, index: number) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Assignment Info */}
                {selectedComplaint.assignedTo && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assignment Information
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Assigned to: {selectedComplaint.assignedTo}
                        </span>
                      </div>
                      {selectedComplaint.estimatedResolution && (
                        <p className="text-blue-700 text-sm">
                          Expected Resolution:{" "}
                          {new Date(
                            selectedComplaint.estimatedResolution,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Resolution Notes */}
                {selectedComplaint.resolutionNotes && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Resolution Notes
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">
                        {selectedComplaint.resolutionNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* History */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Status History
                  </h3>
                  <div className="space-y-3">
                    {selectedComplaint.history.map(
                      (entry: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(entry.status)}
                              <span className="font-medium text-gray-900">
                                {getStatusDisplayName(entry.status)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{entry.notes}</p>
                          <p className="text-gray-600 text-xs mt-1">
                            Updated by: {entry.updatedBy}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsDialog(false);
                      navigate("/register-complaint");
                    }}
                  >
                    Register New Complaint
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label = ({ className, children, ...props }: any) => (
  <label
    className={`text-sm font-medium text-gray-700 ${className || ""}`}
    {...props}
  >
    {children}
  </label>
);

export default TrackComplaint;
