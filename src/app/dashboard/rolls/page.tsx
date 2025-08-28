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
import { api, endpoints, type Roll } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, Plus, MoreHorizontal, Camera } from "lucide-react";
import { toast } from "sonner";

export default function RollsPage() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRolls();
  }, []);

  const fetchRolls = async () => {
    try {
      const response = await api.get(endpoints.rolls);
      setRolls(response.data);
    } catch (error) {
      toast.error("Failed to fetch rolls");
    } finally {
      setLoading(false);
    }
  };

  const filteredRolls = rolls.filter(
    (roll) =>
      roll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.film.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (roll: Roll) => {
    return Math.round((roll.exposureCount / roll.maxExposures) * 100);
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
              <h1 className="text-3xl font-bold tracking-tight">Rolls</h1>
              <p className="text-muted-foreground">
                Manage film rolls and track progress
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Roll
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Roll Management</CardTitle>
              <CardDescription>View and manage all film rolls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rolls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll</TableHead>
                      <TableHead>Film</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRolls.map((roll) => (
                      <TableRow key={roll.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{roll.name}</div>
                            {roll.description && (
                              <div className="text-sm text-muted-foreground">
                                {roll.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {roll.film.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {roll.film.brand} ISO {roll.film.iso}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{roll.exposureCount}</span>
                              <span className="text-muted-foreground">
                                / {roll.maxExposures}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${getProgressPercentage(roll)}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getProgressPercentage(roll)}% complete
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={roll.isCompleted ? "default" : "secondary"}
                          >
                            {roll.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {roll.user.firstName?.[0] ||
                                  roll.user.username[0]}
                              </span>
                            </div>
                            <span className="text-sm">
                              {roll.user.firstName && roll.user.lastName
                                ? `${roll.user.firstName} ${roll.user.lastName}`
                                : roll.user.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(roll.startedAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRolls.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No rolls found matching your search."
                      : "No rolls found."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
