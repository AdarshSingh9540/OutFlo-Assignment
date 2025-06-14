"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, ExternalLink, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  leads: string[];
  accountIDs: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leads: "",
    accountIDs: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const campaignData = {
      name: formData.name,
      description: formData.description,
      leads: formData.leads.split("\n").filter((lead) => lead.trim()),
      accountIDs: formData.accountIDs.split("\n").filter((id) => id.trim()),
    };

    try {
      const url = editingCampaign
        ? `/api/campaigns/${editingCampaign.id}`
        : "/api/campaigns";
      const method = editingCampaign ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Campaign ${
            editingCampaign ? "updated" : "created"
          } successfully`,
        });
        fetchCampaigns();
        resetForm();
      } else {
        throw new Error("Failed to save campaign");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          editingCampaign ? "update" : "create"
        } campaign`,
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (campaign: Campaign) => {
    try {
      const newStatus = campaign.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campaign, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Campaign ${newStatus.toLowerCase()}`,
        });
        fetchCampaigns();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
        fetchCampaigns();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", leads: "", accountIDs: "" });
    setEditingCampaign(null);
    setIsCreateDialogOpen(false);
  };

  const startEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
      leads: campaign.leads.join("\n"),
      accountIDs: campaign.accountIDs.join("\n"),
    });
    setEditingCampaign(campaign);
    setIsCreateDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => resetForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? "Update your campaign details"
                : "Create a new LinkedIn outreach campaign"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter campaign name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your campaign"
                required
              />
            </div>
            <div>
              <Label htmlFor="leads">
                LinkedIn Profile URLs (one per line)
              </Label>
              <Textarea
                id="leads"
                value={formData.leads}
                onChange={(e) =>
                  setFormData({ ...formData, leads: e.target.value })
                }
                placeholder="https://linkedin.com/in/profile-1&#10;https://linkedin.com/in/profile-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="accountIDs">Account IDs (one per line)</Label>
              <Textarea
                id="accountIDs"
                value={formData.accountIDs}
                onChange={(e) =>
                  setFormData({ ...formData, accountIDs: e.target.value })
                }
                placeholder="account-id-1&#10;account-id-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCampaign ? "Update Campaign" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first LinkedIn outreach campaign to get started.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {campaign.name}
                      <Badge
                        variant={
                          campaign.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={campaign.status === "ACTIVE"}
                      onCheckedChange={() => toggleStatus(campaign)}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      LinkedIn Profiles ({campaign.leads.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {campaign.leads.slice(0, 3).map((lead, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={lead}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {lead.replace("https://linkedin.com/in/", "")}
                          </a>
                        </div>
                      ))}
                      {campaign.leads.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{campaign.leads.length - 3} more profiles
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Account IDs ({campaign.accountIDs.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {campaign.accountIDs.slice(0, 3).map((id, index) => (
                        <div
                          key={index}
                          className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded"
                        >
                          {id}
                        </div>
                      ))}
                      {campaign.accountIDs.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{campaign.accountIDs.length - 3} more accounts
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(campaign.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
