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
import { supabaseData } from "@/lib/supabase-data";
import { supabase } from "@/lib/supabase";
import type { FilmRoll } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, MoreHorizontal, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { AddFilmRollDialog } from "@/components/add-film-roll-dialog";

export default function FilmRollsPage() {
  const [filmRolls, setFilmRolls] = useState<FilmRoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFilmRolls();
  }, []);

  const fetchFilmRolls = async () => {
    try {
      const filmRollsData = await supabaseData.getFilmRolls();
      setFilmRolls(filmRollsData);
    } catch (error) {
      console.error("Error fetching film rolls:", error);
      toast.error("Failed to fetch film rolls");
    } finally {
      setLoading(false);
    }
  };

  const filteredFilmRolls = filmRolls.filter(
    (roll) =>
      roll.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.filmRollStock.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      roll.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (roll: FilmRoll) => {
    const totalExposures = roll.filmRollStock.exposuresCapacity;
    const completedExposures = roll.exposures.filter(
      (e) => !e.isUploading
    ).length;
    return Math.round((completedExposures / totalExposures) * 100);
  };

  const handleArchive = async (rollId: string) => {
    try {
      const { error } = await supabase
        .from("film_rolls")
        .update({ is_archived: true })
        .eq("id", rollId);

      if (error) {
        throw error;
      }

      toast.success("Film roll archived successfully");
      fetchFilmRolls();
    } catch (error) {
      console.error("Error archiving film roll:", error);
      toast.error("Failed to archive film roll");
    }
  };

  const handleUnarchive = async (rollId: string) => {
    try {
      const { error } = await supabase
        .from("film_rolls")
        .update({ is_archived: false })
        .eq("id", rollId);

      if (error) {
        throw error;
      }

      toast.success("Film roll unarchived successfully");
      fetchFilmRolls();
    } catch (error) {
      console.error("Error unarchiving film roll:", error);
      toast.error("Failed to unarchive film roll");
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
              <h1 className="text-3xl font-bold tracking-tight">Film Rolls</h1>
              <p className="text-muted-foreground">
                Manage film rolls and track exposure progress
              </p>
            </div>
            <AddFilmRollDialog onFilmRollCreated={fetchFilmRolls} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Film Roll Management</CardTitle>
              <CardDescription>View and manage all film rolls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search film rolls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Label</TableHead>
                      <TableHead>Film Stock</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>ISO</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilmRolls.map((roll) => (
                      <TableRow key={roll.id}>
                        <TableCell className="font-medium">
                          {roll.label}
                        </TableCell>
                        <TableCell>{roll.filmRollStock.name}</TableCell>
                        <TableCell>{roll.filmRollStock.brand.name}</TableCell>
                        <TableCell>{roll.filmRollStock.iso}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${getProgressPercentage(roll)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {
                                roll.exposures.filter((e) => !e.isUploading)
                                  .length
                              }
                              /{roll.filmRollStock.exposuresCapacity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={roll.isArchived ? "secondary" : "default"}
                          >
                            {roll.isArchived ? "Archived" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(roll.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {roll.isArchived ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnarchive(roll.id)}
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleArchive(roll.id)}
                              >
                                <Archive className="h-4 w-4" />
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
