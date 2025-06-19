import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  FileText,
  Search,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  quickReplies?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const ChatBot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqData: FAQItem[] = [
    {
      question: "How do I register a complaint?",
      answer:
        "To register a complaint: 1) Go to 'Register Complaint' page, 2) Select your issue category, 3) Fill in details with photos and location, 4) Submit to get a tracking ID.",
      category: "registration",
    },
    {
      question: "How can I track my complaint?",
      answer:
        "You can track your complaint by: 1) Going to 'Track Complaint' page, 2) Enter your complaint ID (starts with TSC) or phone number, 3) View detailed status and history.",
      category: "tracking",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "You need: 1) Issue category and description, 2) Location details or GPS coordinates, 3) Photos of the problem, 4) Your contact information (name, phone, email).",
      category: "requirements",
    },
    {
      question: "How long does it take to resolve complaints?",
      answer:
        "Resolution time depends on the issue type: 1) Street lights: 1-2 days, 2) Roads: 3-7 days, 3) Water issues: 2-5 days, 4) Sanitation: 1-3 days. You'll get regular updates via SMS/email.",
      category: "timeline",
    },
    {
      question: "What types of complaints can I register?",
      answer:
        "You can register complaints for: 1) Roads (potholes, damage), 2) Water (shortage, leakage, quality), 3) Sanitation (garbage, drainage), 4) Electricity (power cuts, faults), 5) Street lights, 6) Safety issues.",
      category: "categories",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Yes, your data is completely secure. We only use your contact information to send updates about your complaint. Your information is not shared with third parties.",
      category: "privacy",
    },
    {
      question: "Can I submit complaints anonymously?",
      answer:
        "While we need contact information for updates, your personal details are kept confidential. Only authorized officials can access your information for complaint resolution.",
      category: "privacy",
    },
    {
      question: "What if my complaint is not resolved?",
      answer:
        "If your complaint isn't resolved within the expected timeframe: 1) Contact our helpline 1800-XXX-XXXX, 2) Use the escalation option in your complaint details, 3) Visit your local municipal office.",
      category: "escalation",
    },
    {
      question: "Can I upload multiple photos?",
      answer:
        "Yes, you can upload up to 5 photos to help officials understand the issue better. Supported formats: JPG, PNG, WebP. Maximum size: 10MB per image.",
      category: "technical",
    },
    {
      question: "How do I get my location automatically?",
      answer:
        "Click 'My Location' button during complaint registration. Allow location access when prompted by your browser. If GPS is not available, manually enter your address.",
      category: "technical",
    },
  ];

  const quickStartOptions = [
    t("ai_quick_register"),
    t("ai_quick_track"),
    t("ai_quick_documents"),
    t("ai_quick_time"),
    t("ai_quick_support"),
  ];

  const greetingMessage: Message = {
    id: "greeting",
    text: t("ai_greeting"),
    sender: "bot",
    timestamp: new Date(),
    quickReplies: quickStartOptions,
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([greetingMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const findBestAnswer = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Keyword matching for FAQ
    const keywordMatches = faqData.filter((faq) => {
      const questionLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();

      // Check for keyword matches
      const keywords = input.split(" ").filter((word) => word.length > 2);
      return keywords.some(
        (keyword) =>
          questionLower.includes(keyword) ||
          answerLower.includes(keyword) ||
          faq.category.includes(keyword),
      );
    });

    if (keywordMatches.length > 0) {
      return keywordMatches[0].answer;
    }

    // Intent recognition with translated responses
    if (
      input.includes("register") ||
      input.includes("submit") ||
      input.includes("file") ||
      input.includes("दर्ज") ||
      input.includes("नमोदु") ||
      input.includes("शिकायत") ||
      input.includes("ఫిర్యాదు")
    ) {
      return t("ai_register_help");
    }

    if (
      input.includes("track") ||
      input.includes("status") ||
      input.includes("check") ||
      input.includes("ट्रैक") ||
      input.includes("ట్రాక్") ||
      input.includes("स्थिति") ||
      input.includes("స్థితి")
    ) {
      return t("ai_track_help");
    }

    if (
      input.includes("time") ||
      input.includes("long") ||
      input.includes("when") ||
      input.includes("समय") ||
      input.includes("సమయం") ||
      input.includes("कितना") ||
      input.includes("ఎంత")
    ) {
      return t("ai_time_help");
    }

    if (
      input.includes("photo") ||
      input.includes("image") ||
      input.includes("picture") ||
      input.includes("फोटो") ||
      input.includes("ఫోటో") ||
      input.includes("तस्वीर") ||
      input.includes("చిత్రం")
    ) {
      return t("ai_photo_help");
    }

    if (
      input.includes("location") ||
      input.includes("address") ||
      input.includes("gps") ||
      input.includes("स्थान") ||
      input.includes("లొకేషన్") ||
      input.includes("पता") ||
      input.includes("చిరునామా")
    ) {
      return t("ai_location_help");
    }

    if (
      input.includes("contact") ||
      input.includes("help") ||
      input.includes("support") ||
      input.includes("संपर्क") ||
      input.includes("సంప్రదించు") ||
      input.includes("सहायता") ||
      input.includes("సహాయం")
    ) {
      return t("ai_contact_help");
    }

    if (
      input.includes("thank") ||
      input.includes("thanks") ||
      input.includes("धन्यवाद") ||
      input.includes("ధన్యవాదాలు")
    ) {
      return t("ai_thanks");
    }

    if (
      input.includes("emergency") ||
      input.includes("urgent") ||
      input.includes("आपातकाल") ||
      input.includes("అత్యవసర") ||
      input.includes("तत्काल") ||
      input.includes("తక్షణ")
    ) {
      return t("ai_emergency");
    }

    // Default response
    return t("ai_default");
  };

  const simulateTyping = (callback: () => void, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const addMessage = (
    text: string,
    sender: "user" | "bot",
    quickReplies?: string[],
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      quickReplies,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, "user");
    setInputText("");

    simulateTyping(() => {
      const botResponse = findBestAnswer(userMessage);
      const shouldShowQuickReplies = Math.random() > 0.7; // Show quick replies 30% of the time
      const quickReplies = shouldShowQuickReplies
        ? [
            t("ai_quick_another"),
            t("ai_quick_register"),
            t("ai_quick_track"),
            t("ai_quick_support"),
          ]
        : undefined;

      addMessage(botResponse, "bot", quickReplies);
    });
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, "user");

    simulateTyping(() => {
      const botResponse = findBestAnswer(reply);
      addMessage(botResponse, "bot");
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  TG Civic AI
                </CardTitle>
                <p className="text-blue-100 text-sm">{t("ai_online_status")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[420px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}
                >
                  <div
                    className={`flex items-start space-x-2 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Replies */}
                  {message.quickReplies && message.sender === "bot" && (
                    <div className="mt-2 space-y-1">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="block w-full text-left text-xs h-auto py-2 px-3 hover:bg-blue-50"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickReply(t("ai_quick_register"))}
              >
                <FileText className="w-3 h-3 mr-1" />
                {t("ai_register_btn")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickReply(t("ai_quick_track"))}
              >
                <Search className="w-3 h-3 mr-1" />
                {t("ai_track_btn")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickReply(t("ai_quick_support"))}
              >
                <Phone className="w-3 h-3 mr-1" />
                {t("ai_support_btn")}
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
