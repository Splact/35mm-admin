"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabaseData } from "@/lib/supabase-data";
import type { FilmRollStock, User } from "@/lib/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface AddFilmRollDialogProps {
  onFilmRollCreated: () => void;
}

export const AddFilmRollDialog = ({
  onFilmRollCreated,
}: AddFilmRollDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filmRollStocks, setFilmRollStocks] = useState<FilmRollStock[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    label: "",
    filmRollStockId: "",
    userId: "",
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [stocksData, usersData] = await Promise.all([
        supabaseData.getFilmRollStocks(),
        supabaseData.getUsers(),
      ]);
      setFilmRollStocks(stocksData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load form data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.filmRollStockId) {
      toast.error("Please select a film stock");
      return;
    }

    if (!formData.userId) {
      toast.error("Please select a user");
      return;
    }

    setLoading(true);

    try {
      await supabaseData.createFilmRoll({
        label: formData.label.trim() || "",
        filmRollStockId: formData.filmRollStockId,
        userId: formData.userId,
      });

      toast.success("Film roll created successfully");
      setOpen(false);
      setFormData({ label: "", filmRollStockId: "", userId: "" });
      onFilmRollCreated();
    } catch (error) {
      console.error("Error creating film roll:", error);
      toast.error("Failed to create film roll");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Film Roll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Film Roll</DialogTitle>
          <DialogDescription>
            Create a new film roll by selecting the film stock and user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="Enter film roll label (optional)..."
                value={formData.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filmStock">Film Stock</Label>
              <Select
                value={formData.filmRollStockId}
                onValueChange={(value) =>
                  handleInputChange("filmRollStockId", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a film stock" />
                </SelectTrigger>
                <SelectContent>
                  {filmRollStocks.map((stock) => (
                    <SelectItem key={stock.id} value={stock.id}>
                      {stock.brand.name} {stock.name} (ISO {stock.iso})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user">User</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => handleInputChange("userId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Film Roll"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
