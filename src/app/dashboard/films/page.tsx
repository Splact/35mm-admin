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
import { api, endpoints, type Film } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await api.get(endpoints.films);
      setFilms(response.data);
    } catch (error) {
      toast.error("Failed to fetch films");
    } finally {
      setLoading(false);
    }
  };

  const filteredFilms = films.filter(
    (film) =>
      film.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.iso.toString().includes(searchTerm)
  );

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
              <h1 className="text-3xl font-bold tracking-tight">Films</h1>
              <p className="text-muted-foreground">
                Manage film inventory and specifications
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Film
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Film Management</CardTitle>
              <CardDescription>
                View and manage all registered films
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search films..."
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
                      <TableHead>Film</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>ISO</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilms.map((film) => (
                      <TableRow key={film.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{film.name}</div>
                            {film.description && (
                              <div className="text-sm text-muted-foreground">
                                {film.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{film.brand}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">ISO {film.iso}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{film.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {film.user.firstName?.[0] ||
                                  film.user.username[0]}
                              </span>
                            </div>
                            <span className="text-sm">
                              {film.user.firstName && film.user.lastName
                                ? `${film.user.firstName} ${film.user.lastName}`
                                : film.user.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(film.createdAt)}</TableCell>
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

              {filteredFilms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No films found matching your search."
                      : "No films found."}
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
