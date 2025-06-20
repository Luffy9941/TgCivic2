import React from "react";
import { Scheme } from "@/context/SchemesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  Eye,
  Calendar,
} from "lucide-react";

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  onViewIncrement?: (schemeId: string) => void;
}

export const SchemeDetailModal = ({
  scheme,
  isOpen,
  onClose,
  onViewIncrement,
}: SchemeDetailModalProps) => {
  if (!scheme) return null;

  const handleWebsiteClick = () => {
    if (scheme.contactInfo.website) {
      window.open(scheme.contactInfo.website, "_blank");
      if (onViewIncrement) {
        onViewIncrement(scheme.id);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Farmers: "bg-green-100 text-green-800",
      "Senior Citizens": "bg-blue-100 text-blue-800",
      Women: "bg-pink-100 text-pink-800",
      "Digital Services": "bg-purple-100 text-purple-800",
      Healthcare: "bg-red-100 text-red-800",
      Business: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{scheme.icon}</div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {scheme.name}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getCategoryColor(scheme.category)}>
                    {scheme.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{scheme.views} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Updated {new Date(scheme.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {scheme.status}
            </Badge>
          </div>
          <DialogDescription className="text-base text-gray-600 mt-4">
            {scheme.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Department Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Department</h3>
            </div>
            <p className="text-blue-800">{scheme.department}</p>
          </div>

          {/* Key Benefits */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Key Benefits
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scheme.keyBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Eligibility Criteria */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Eligibility Criteria
              </h3>
            </div>
            <div className="space-y-2">
              {scheme.eligibilityCriteria.map((criteria, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-blue-800 text-sm">{criteria}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Required Documents */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Required Documents
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {scheme.requiredDocuments.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-800 text-sm">{document}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Application Process */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Application Process
              </h3>
            </div>
            <div className="space-y-3">
              {scheme.applicationProcess.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-purple-800 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scheme.contactInfo.phone && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Phone</p>
                    <a
                      href={`tel:${scheme.contactInfo.phone}`}
                      className="text-green-700 hover:text-green-800 text-sm"
                    >
                      {scheme.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {scheme.contactInfo.email && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Email</p>
                    <a
                      href={`mailto:${scheme.contactInfo.email}`}
                      className="text-blue-700 hover:text-blue-800 text-sm"
                    >
                      {scheme.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {scheme.contactInfo.website && (
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Website
                    </p>
                    <a
                      href={scheme.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:text-purple-800 text-sm flex items-center gap-1"
                      onClick={() =>
                        onViewIncrement && onViewIncrement(scheme.id)
                      }
                    >
                      Visit Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {scheme.contactInfo.website && (
              <Button
                onClick={handleWebsiteClick}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Apply Online
              </Button>
            )}

            {scheme.contactInfo.phone && (
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${scheme.contactInfo.phone}`)}
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Helpline
              </Button>
            )}

            <Button variant="outline" onClick={onClose} size="lg">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
