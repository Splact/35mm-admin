"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Film,
  Camera,
  TrendingUp,
  Tag,
  Building2,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the 35mm admin dashboard. Here&apos;s an overview of
              your data.
            </p>
          </div>

          {/* stats cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Films
                </CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Film Rolls
                </CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Exposures
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* additional stats for new entities */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tags
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Brands
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  +4.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Film Stocks
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  +11.8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Processing Exposures
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +3.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* recent activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest user registrations and film additions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">
                        john.doe@example.com joined the platform
                      </p>
                    </div>
                    <Badge variant="secondary">2 min ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Film added</p>
                      <p className="text-xs text-muted-foreground">
                        Kodak Portra 400 added by jane.smith@example.com
                      </p>
                    </div>
                    <Badge variant="secondary">5 min ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Roll completed</p>
                      <p className="text-xs text-muted-foreground">
                        Roll &quot;Summer Vacation&quot; completed by
                        mike.wilson@example.com
                      </p>
                    </div>
                    <Badge variant="secondary">12 min ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Link href="/dashboard/users">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Users className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">View Users</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/films">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Film className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">Manage Films</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/film-rolls">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Camera className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">View Film Rolls</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/exposures">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Camera className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">Manage Exposures</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/tags">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Tag className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">Manage Tags</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/brands">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Building2 className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">Manage Brands</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/film-stocks">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Package className="h-4 w-4 mb-2" />
                      <p className="text-sm font-medium">Film Stocks</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
