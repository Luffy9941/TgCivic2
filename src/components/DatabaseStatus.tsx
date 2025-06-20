import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { testDatabaseConnection } from "@/lib/dbTest";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";

export const DatabaseStatus = () => {
  const [status, setStatus] = useState<
    "testing" | "connected" | "error" | "idle"
  >("idle");
  const [message, setMessage] = useState("");

  const testConnection = async () => {
    setStatus("testing");
    setMessage("Testing database connection...");

    try {
      const success = await testDatabaseConnection();
      if (success) {
        setStatus("connected");
        setMessage("Database connection successful! Ready to register users.");
      } else {
        setStatus("error");
        setMessage("Database connection failed. Check console for details.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  useEffect(() => {
    // Auto-test on component mount
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "testing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      case "testing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5" />
          MongoDB Connection Status
        </h3>
        <Badge className={getStatusColor()}>
          {getStatusIcon()}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      {message && (
        <Alert
          className={
            status === "error"
              ? "border-red-200 bg-red-50"
              : status === "connected"
                ? "border-green-200 bg-green-50"
                : ""
          }
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-3">
        <Button
          onClick={testConnection}
          disabled={status === "testing"}
          size="sm"
          variant="outline"
        >
          {status === "testing" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          <strong>Database:</strong> tg-civic
        </p>
        <p>
          <strong>Collections:</strong> citizens, admins
        </p>
        <p>
          <strong>Connection:</strong> MongoDB Atlas
        </p>
      </div>
    </div>
  );
};
