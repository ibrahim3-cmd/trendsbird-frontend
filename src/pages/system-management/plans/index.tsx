

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, GripVertical } from "lucide-react";
import { useGetPlansQuery, useCreatePlanMutation, useUpdatePlanMutation, useDeletePlanMutation } from "@/redux/features/plan/planApiSlice";
import { Plan } from "@/types/plan.type";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
import { PlanModal } from "./components/PlanModal";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PlanPage = () => {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active">("all");
  const [activeOrderedPlans, setActiveOrderedPlans] = useState<Plan[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const { data: plans = [], isLoading, isError, refetch } = useGetPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanModalOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanModalOpen(true);
  };

  const handleDeletePlan = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete._id).unwrap();
      toast.success("Plan deleted successfully");
      setDeleteModalOpen(false);
      setPlanToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error("Failed to delete plan");
    }
  };

  const handleSavePlan = async (planData: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log("Plan data being sent:", planData); // Debug log
      if (editingPlan) {
        await updatePlan({ id: editingPlan._id, ...planData }).unwrap();
        toast.success("Plan updated successfully");
      } else {
        await createPlan(planData).unwrap();
        toast.success("Plan created successfully");
      }
      setPlanModalOpen(false);
      setEditingPlan(null);
      refetch();
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error(`Failed to ${editingPlan ? 'update' : 'create'} plan`);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await updatePlan({ id: plan._id, isActive: !plan.isActive }).unwrap();
      toast.success(`Plan ${!plan.isActive ? "activated" : "deactivated"}`);
      refetch();
    } catch (error) {
      console.error("Failed to toggle plan:", error);
      toast.error("Failed to update plan status");
    }
  };

  const activePlans = useMemo(
    () => plans.filter((p) => p.isActive).sort((a, b) => (a.serial ?? 0) - (b.serial ?? 0)),
    [plans]
  );

  useEffect(() => {
    setActiveOrderedPlans(activePlans);
  }, [activePlans]);

  const displayPlans = activeTab === "active" ? activeOrderedPlans : plans;

  const handleDragStart = (id: string) => {
    if (activeTab !== "active") return;
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    if (activeTab !== "active") return;
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (activeTab !== "active" || !draggingId || draggingId === targetId) return;
    const current = [...activeOrderedPlans];
    const fromIndex = current.findIndex((p) => p._id === draggingId);
    const toIndex = current.findIndex((p) => p._id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...current];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const withSerial = reordered.map((p, idx) => ({ ...p, serial: idx }));
    setActiveOrderedPlans(withSerial);

    try {
      await Promise.all(
        withSerial.map((p) => updatePlan({ id: p._id, serial: p.serial }).unwrap())
      );
      toast.success("Plan order updated");
      refetch();
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order");
    } finally {
      setDraggingId(null);
    }
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit.toLowerCase()}${value !== 1 ? 's' : ''}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load plans</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-muted-foreground">Manage your subscription plans</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "active")}>            
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active (orderable)</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {displayPlans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No plans found</p>
              <Button onClick={handleCreatePlan}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {activeTab === "active" && <TableHead className="w-10" />}
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Post-trial Plan</TableHead>
                    <TableHead>Visible</TableHead>
                    {activeTab === "active" && <TableHead>Serial</TableHead>}
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPlans.map((plan) => (
                    <TableRow
                      key={plan._id}
                      draggable={activeTab === "active"}
                      onDragStart={() => handleDragStart(plan._id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(plan._id)}
                      className={activeTab === "active" ? "cursor-grab" : undefined}
                    >
                      {activeTab === "active" && (
                        <TableCell className="w-10 text-muted-foreground">
                          <GripVertical className="h-4 w-4" />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>
                        <Badge variant={plan.isTrial ? "secondary" : "outline"}>
                          {plan.isTrial ? "Trial" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate" title={plan.postTrialPlan || undefined}>
                        {plan.postTrialPlan ? plans.find((p) => p._id === plan.postTrialPlan)?.name || "—" : "—"}
                      </TableCell>
                      <TableCell>
                        <Switch checked={Boolean(plan.isActive)} onCheckedChange={() => handleToggleActive(plan)} />
                      </TableCell>
                      {activeTab === "active" && <TableCell>{plan.serial ?? 0}</TableCell>}
                      <TableCell>
                        <Badge variant="outline">
                          {formatDuration(plan.durationValue, plan.durationUnit)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatPrice(plan.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Modal */}
      <PlanModal
        open={planModalOpen}
        onOpenChange={setPlanModalOpen}
        plan={editingPlan}
        onSave={handleSavePlan}
        isLoading={isCreating || isUpdating}
        plans={plans}
      />

      {/* Delete Warning Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        itemName={planToDelete?.name || ""}
        description="This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PlanPage;