import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSchemes } from "@/context/SchemesContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Share2,
  ExternalLink,
  FileText,
  Users,
  Calendar,
  Building2,
  Gift,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Mic,
  MicOff,
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Schemes = () => {
  const navigate = useNavigate();
  const { schemes, searchSchemes, getSchemesByCategory } = useSchemes();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(schemes.filter((s) => s.isActive).map((s) => s.category)),
    );
    return uniqueCategories.sort();
  }, [schemes]);

  // Filter schemes based on search and category
  const filteredSchemes = useMemo(() => {
    let result = schemes.filter((scheme) => scheme.isActive);

    if (searchQuery.trim()) {
      result = searchSchemes(searchQuery);
    }

    if (selectedCategory !== "all") {
      result = result.filter((scheme) => scheme.category === selectedCategory);
    }

    return result;
  }, [schemes, searchQuery, selectedCategory, searchSchemes]);

  const handleVoiceSearch = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice search not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN"; // You can make this dynamic based on selected language

    recognition.onstart = () => {
      setIsVoiceSearching(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsVoiceSearching(false);
    };

    recognition.onerror = () => {
      setIsVoiceSearching(false);
    };

    recognition.onend = () => {
      setIsVoiceSearching(false);
    };

    recognition.start();
  };

  const shareScheme = async (scheme: any) => {
    const shareText = `🏛️ TG Civic Scheme: ${scheme.name}

📋 ${scheme.description}

💰 Benefits: ${scheme.benefits}

📄 Apply: ${scheme.applyLink}

🏢 Department: ${scheme.department}

Learn more about government schemes on TG Civic app!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `TG Civic - ${scheme.name}`,
          text: shareText,
          url: scheme.applyLink,
        });
      } catch (error) {
        // Fallback to WhatsApp if native sharing fails
        shareToWhatsApp(shareText);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      shareToWhatsApp(shareText);
    }
  };

  const shareToWhatsApp = (text: string) => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Agriculture: "bg-green-100 text-green-800 border-green-200",
      Health: "bg-blue-100 text-blue-800 border-blue-200",
      "Social Welfare": "bg-purple-100 text-purple-800 border-purple-200",
      Education: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Employment: "bg-orange-100 text-orange-800 border-orange-200",
      Housing: "bg-indigo-100 text-indigo-800 border-indigo-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors.default;
  };

  const formatApplicantCount = (count?: number) => {
    if (!count) return "0";
    if (count < 1000) return count.toString();
    if (count < 100000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Government Schemes
            </h1>
            <p className="text-gray-600">
              Discover and apply for various government welfare schemes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50">
              {filteredSchemes.length} schemes available
            </Badge>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find schemes that match your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search schemes by name, benefits, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleVoiceSearch}
                disabled={isVoiceSearching}
                className={`min-w-fit ${
                  isVoiceSearching ? "text-red-500 animate-pulse" : ""
                }`}
              >
                {isVoiceSearching ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="h-10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {isVoiceSearching && (
              <p className="text-sm text-blue-600 flex items-center gap-2">
                <span className="animate-pulse">🎙️ Listening... Speak now</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Schemes Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                        {scheme.name}
                      </CardTitle>
                      <Badge
                        className={`${getCategoryColor(scheme.category)} mb-2`}
                      >
                        {scheme.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareScheme(scheme)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-sm">
                    {scheme.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Benefits */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Benefits
                      </span>
                    </div>
                    <p className="text-sm text-green-700">{scheme.benefits}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{formatApplicantCount(scheme.applicantCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{scheme.department}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedScheme(scheme)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        {selectedScheme && (
                          <>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-blue-600" />
                                {selectedScheme.name}
                              </DialogTitle>
                              <DialogDescription>
                                Complete information about this scheme
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Basic Info */}
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Description
                                </h3>
                                <p className="text-gray-700">
                                  {selectedScheme.description}
                                </p>
                              </div>

                              {/* Benefits */}
                              <div>
                                <h3 className="font-semibold mb-2">Benefits</h3>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-green-800">
                                    {selectedScheme.benefits}
                                  </p>
                                </div>
                              </div>

                              {/* Eligibility */}
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Eligibility Criteria
                                </h3>
                                <ul className="space-y-1">
                                  {selectedScheme.eligibility.map(
                                    (criteria: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">
                                          {criteria}
                                        </span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              {/* Required Documents */}
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Required Documents
                                </h3>
                                <ul className="space-y-1">
                                  {selectedScheme.requiredDocuments.map(
                                    (doc: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-2"
                                      >
                                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{doc}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              {/* Application Process */}
                              <div>
                                <h3 className="font-semibold mb-2">
                                  How to Apply
                                </h3>
                                <p className="text-gray-700">
                                  {selectedScheme.applicationProcess}
                                </p>
                              </div>

                              {/* Department Info */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-medium">
                                    {selectedScheme.department}
                                  </span>
                                </div>
                                {selectedScheme.applicantCount && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">
                                      {formatApplicantCount(
                                        selectedScheme.applicantCount,
                                      )}{" "}
                                      applicants
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Apply Button */}
                              <div className="flex gap-3">
                                <Button
                                  onClick={() =>
                                    window.open(
                                      selectedScheme.applyLink,
                                      "_blank",
                                    )
                                  }
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Apply Now
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => shareScheme(selectedScheme)}
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      onClick={() => window.open(scheme.applyLink, "_blank")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No schemes found
              </h3>
              <p className="text-gray-600 mb-4">
                No schemes match your current search and filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Chatbot Integration Hint */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Need help finding the right scheme?
                </p>
                <p className="text-xs text-blue-700">
                  Use the chatbot in the bottom-right corner to ask questions
                  about schemes and eligibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schemes;
