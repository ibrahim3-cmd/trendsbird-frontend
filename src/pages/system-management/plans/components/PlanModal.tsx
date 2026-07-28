import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Loader2 } from "lucide-react";
import { Plan } from "@/types/plan.type";

interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  onSave: (planData: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading: boolean;
  plans: Plan[];
}

export const PlanModal = ({ open, onOpenChange, plan, onSave, isLoading, plans }: PlanModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState<"DAY" | "WEEK" | "MONTH" | "YEAR">("MONTH");
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState<string[]>([""]);
  const [isTrial, setIsTrial] = useState(false);
  const [postTrialPlan, setPostTrialPlan] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [serial, setSerial] = useState(0);

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description);
      setDurationValue(plan.durationValue);
      setDurationUnit(plan.durationUnit);
      setPrice(plan.price);
      setFeatures(plan.features);
      setIsTrial(Boolean(plan.isTrial));
      setPostTrialPlan(plan.postTrialPlan || null);
      setIsActive(plan.isActive ?? true);
      setSerial(plan.serial ?? 0);
    } else {
      // Reset form for new plan
      setName("");
      setDescription("");
      setDurationValue(1);
      setDurationUnit("MONTH");
      setPrice(0);
      setFeatures([""]);
      setIsTrial(false);
      setPostTrialPlan(null);
      setIsActive(true);
      setSerial(0);
    }
  }, [plan, open]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const planData = {
      name: name.trim(),
      description: description.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      durationValue,
      durationUnit,
      price,
      features: features.filter(feature => feature.trim() !== ''),
      isTrial,
      postTrialPlan: isTrial ? postTrialPlan : null,
      isActive,
      serial,
    };

    onSave(planData);
  };

  const eligiblePostTrialPlans = plans.filter((p) => !p.isTrial && (!plan || p._id !== plan._id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter plan name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <p className="text-xs text-muted-foreground">Inactive plans stay hidden from registration.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isTrial">Is Trial Plan</Label>
                <Switch
                  id="isTrial"
                  checked={isTrial}
                  onCheckedChange={(checked) => {
                    setIsTrial(checked);
                    if (!checked) setPostTrialPlan(null);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Trial plans require a post-trial plan selection.</p>
            </div>
            {isActive && (
              <div className="space-y-2">
                <Label htmlFor="serial">Serial (ordering)</Label>
                <Input
                  id="serial"
                  type="number"
                  min="0"
                  value={serial}
                  onChange={(e) => setSerial(parseInt(e.target.value) || 0)}
                />
              </div>
            )}


            {isTrial && (
              <div className="space-y-2">
                <Label htmlFor="postTrialPlan">Post-trial Plan *</Label>
                <Select
                  value={postTrialPlan ?? undefined}
                  onValueChange={(value) => setPostTrialPlan(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligiblePostTrialPlans.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter plan description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationValue">Duration Value</Label>
              <Input
                id="durationValue"
                type="number"
                min="1"
                value={durationValue}
                onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationUnit">Duration Unit</Label>
              <Select value={durationUnit} onValueChange={(value: "DAY" | "WEEK" | "MONTH" | "YEAR") => setDurationUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Day</SelectItem>
                  <SelectItem value="WEEK">Week</SelectItem>
                  <SelectItem value="MONTH">Month</SelectItem>
                  <SelectItem value="YEAR">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={handleAddFeature}
              size="sm"
              className="w-fit"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !name.trim() ||
                (isTrial && !postTrialPlan)
              }
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};