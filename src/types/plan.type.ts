export interface Plan {
    _id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    durationValue: number;
    durationUnit: "DAY" | "WEEK" | "MONTH" | "YEAR";
    features: string[];
    isTrial?: boolean;
    postTrialPlan?: string | null;
    isActive?: boolean;
    serial?: number;
    createdAt: string;
    updatedAt: string;
}
