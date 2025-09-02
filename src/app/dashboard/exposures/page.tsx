"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, endpoints, type Exposure } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  MoreHorizontal,
  Upload,
  Settings,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ExposuresPage() {
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExposures();
  }, []);

  const fetchExposures = async () => {
    try {
      const response = await api.get(endpoints.exposures);
      setExposures(response.data);
    } catch (error) {
      toast.error("Failed to fetch exposures");
    } finally {
      setLoading(false);
    }
  };

  const filteredExposures = exposures.filter(
    (exposure) =>
      exposure.filmRoll.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exposure.filmRoll.filmRollStock.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleUploadStarted = async (exposureId: string) => {
    try {
      await api.patch(`${endpoints.exposures}/${exposureId}/upload-started`);
      toast.success("Upload started");
      fetchExposures();
    } catch (error) {
      toast.error("Failed to start upload");
    }
  };

  const handleUploadCompleted = async (exposureId: string) => {
    try {
      await api.patch(`${endpoints.exposures}/${exposureId}/upload-completed`);
      toast.success("Upload completed");
      fetchExposures();
    } catch (error) {
      toast.error("Failed to complete upload");
    }
  };

  const handleProcessingStarted = async (exposureId: string) => {
    try {
      await api.patch(
        `${endpoints.exposures}/${exposureId}/processing-started`
      );
      toast.success("Processing started");
      fetchExposures();
    } catch (error) {
      toast.error("Failed to start processing");
    }
  };

  const handleProcessingCompleted = async (exposureId: string) => {
    try {
      await api.patch(
        `${endpoints.exposures}/${exposureId}/processing-completed`
      );
      toast.success("Processing completed");
      fetchExposures();
    } catch (error) {
      toast.error("Failed to complete processing");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Exposures</h1>
              <p className="text-muted-foreground">
                Manage individual exposures and track processing status
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exposure
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Exposure Management</CardTitle>
              <CardDescription>View and manage all exposures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exposures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Film Roll</TableHead>
                      <TableHead>Film Stock</TableHead>
                      <TableHead>Upload Status</TableHead>
                      <TableHead>Processing Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExposures.map((exposure) => (
                      <TableRow key={exposure.id}>
                        <TableCell>
                          <div className="font-medium">
                            {exposure.filmRoll.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {exposure.filmRoll.filmRollStock.brand.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {exposure.filmRoll.filmRollStock.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ISO {exposure.filmRoll.filmRollStock.iso}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              exposure.isUploading ? "default" : "secondary"
                            }
                          >
                            {exposure.isUploading
                              ? "Uploading"
                              : "Not Uploading"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              exposure.isProcessing ? "default" : "secondary"
                            }
                          >
                            {exposure.isProcessing
                              ? "Processing"
                              : "Not Processing"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(exposure.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {!exposure.isUploading ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUploadStarted(exposure.id)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUploadCompleted(exposure.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {!exposure.isProcessing ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleProcessingStarted(exposure.id)
                                }
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleProcessingCompleted(exposure.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
