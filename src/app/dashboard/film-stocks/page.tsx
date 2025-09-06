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
import type { FilmRollStock } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function FilmStocksPage() {
  const [filmStocks, setFilmStocks] = useState<FilmRollStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFilmStocks();
  }, []);

  const fetchFilmStocks = async () => {
    try {
      const filmStocksData = await supabaseData.getFilmRollStocks();
      setFilmStocks(filmStocksData);
    } catch (error) {
      console.error("Error fetching film stocks:", error);
      toast.error("Failed to fetch film stocks");
    } finally {
      setLoading(false);
    }
  };

  const filteredFilmStocks = filmStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.iso.toString().includes(searchTerm)
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
              <h1 className="text-3xl font-bold tracking-tight">Film Stocks</h1>
              <p className="text-muted-foreground">
                Manage film stock specifications and details
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Film Stock
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Film Stock Management</CardTitle>
              <CardDescription>
                View and manage all film stock specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search film stocks..."
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
                      <TableHead>Film Stock</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>ISO</TableHead>
                      <TableHead>Colors</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilmStocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {stock.coverImageUrl && (
                              <img
                                src={stock.coverImageUrl}
                                alt={stock.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{stock.name}</div>
                              {stock.description && (
                                <div className="text-sm text-muted-foreground">
                                  {stock.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {stock.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{stock.brand.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">ISO {stock.iso}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {stock.primaryColor && (
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: stock.primaryColor }}
                                title={stock.primaryColor}
                              />
                            )}
                            {stock.secondaryColor && (
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{
                                  backgroundColor: stock.secondaryColor,
                                }}
                                title={stock.secondaryColor}
                              />
                            )}
                            {!stock.primaryColor && !stock.secondaryColor && (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {stock.exposuresCapacity} exposures
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={stock.isActive ? "default" : "secondary"}
                          >
                            {stock.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(stock.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredFilmStocks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No film stocks found matching your search."
                      : "No film stocks found."}
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
