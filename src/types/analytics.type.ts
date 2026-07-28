// Dashboard Analytics Types

// Ad Spending by Campaign
export interface IAdSpendingByCampaign {
    campaignId: string;
    campaignName: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
}

// Ad Platform Spending Summary
export interface IAdSpending {
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCPC: number;
    avgCTR: number;
    campaigns: IAdSpendingByCampaign[];
    isConnected: boolean;
    error?: string;
}

// Top Item types for lists
export interface ITopAutomation {
    id: string;
    name: string;
    executions: number;
    successRate: number;
    isActive: boolean;
    lastExecutedAt?: string | null;
}

// Time Series Types
export interface ITimeSeriesDataPoint {
    date: string;
    count: number;
}

export interface ITimeSeriesMetric {
    data: ITimeSeriesDataPoint[];
    total: number;
}

export interface ITimeSeries {
    users: ITimeSeriesMetric;
    contacts: ITimeSeriesMetric;
    automations: ITimeSeriesMetric;
    emails: ITimeSeriesMetric;
    forms: ITimeSeriesMetric;
    tasks: ITimeSeriesMetric;
    appointments: ITimeSeriesMetric;
    dateRange: {
        start: string;
        end: string;
    };
}

// Amount-based time series for finance
export interface IAmountDataPoint {
    date: string;
    amount: number;
}

export interface IAmountSeries {
    data: IAmountDataPoint[];
    total: number;
}

export interface IRecentEmail {
    id: string;
    to: string[];
    from: string;
    subject: string;
    status: string;
    provider: string;
    createdAt: string;
}

export interface ITopForm {
    id: string;
    title: string;
    submissions: number;
    lastSubmissionAt?: string;
    isActive: boolean;
}

export interface ITopPipeline {
    id: string;
    name: string;
    leadCount: number;
    conversionRate: number;
    totalValue: number;
}

export interface ITopJob {
    id: string;
    title: string;
    totalCost: number;
    status: string;
    clientName?: string;
}

export interface IUpcomingAppointment {
    id: string;
    bookerName: string;
    bookerEmail: string;
    startTime: string;
    endTime: string;
    status: string;
    bookingPageName?: string;
}

// Lead Source by Pipeline
export interface ILeadSourceByPipeline {
    pipelineId: string;
    pipelineName: string;
    leadCount: number;
    newLeads: number;
    stageCount: number;
    avgLeadsPerStage: number;
    sources: {
        source: string;
        count: number;
    }[];
    // Optional aggregated financial fields
    totalRevenue?: number;
    totalExpense?: number;
    totalInvoiceDue?: number;
    totalDue?: number;
}

// Due Task
export interface IDueTask {
    id: string;
    title: string;
    dueDate: string;
    priority: string;
    assignedTo: {
        id: string;
        name: string;
    }[];
    status: string;
}

export interface IDashboardAnalytics {
    // User Analytics
    users: {
        total: number;
        active: number;
        blocked: number;
        byRole: {
            role: string;
            count: number;
        }[];
        recentlyAdded: number; // Last 30 days
    };

    // Contact Analytics
    contacts: {
        total: number;
        active: number;
        recentlyAdded: number;
    };

    // Lead Analytics
    leads: {
        total: number;
        byStatus: {
            status: string | null;
            count: number;
        }[];
        byPipeline: {
            pipelineId: string;
            pipelineName: string;
            count: number;
        }[];
        byStage: {
            stageId: string;
            stageName: string;
            pipelineId: string;
            count: number;
        }[];
        bySource: {
            source: string;
            count: number;
            totalValue: number;
            won: number;
            lost: number;
            open: number;
            abandoned: number;
        }[];
        sourceByPipeline: ILeadSourceByPipeline[];
        recentlyAdded: number; // Last 30 days
        conversionRate?: number;
    };

    // Deal/Opportunity Analytics
    deals: {
        total: number;
        totalValue: number;
        won: number;
        wonValue: number;
        lost: number;
        lostValue: number;
        pending: number;
        pendingValue: number;
        abandoned: number;
        abandonedValue: number;
        averageDealValue: number;
    };

    // Conversion Rate by Pipeline
    conversionByPipeline: {
        pipelineId: string;
        pipelineName: string;
        totalLeads: number;
        wonLeads: number;
        lostLeads: number;
        conversionRate: number;
        wonRevenue: number;
    }[];

    // Job Analytics
    jobs: {
        total: number;
        active: number;
        scheduled: number;
        inProgress: number;
        onHold: number;
        completed: number;
        cancelled: number;
        totalBill: number;
        totalExpense?: number;
        totalPaid: number;
        totalDue: number;
        byPriority: {
            priority: string | null;
            count: number;
        }[];
        topJobs: ITopJob[];
    };

    // Task Analytics
    tasks: {
        total: number;
        open: number;
        ongoing: number;
        completed: number;
        overdue: number;
        byPriority: {
            priority: string;
            count: number;
        }[];
        byUser: {
            userId: string;
            userName: string;
            total: number;
            completed: number;
            overdue: number;
        }[];
        dueTasks: IDueTask[];
    };

    // Automation Analytics
    automations: {
        total: number;
        active: number;
        inactive: number;
        totalExecutions: number;
        successfulExecutions: number;
        failedExecutions: number;
        successRate: number;
        topAutomations: ITopAutomation[];
    };

    // Form Analytics
    forms: {
        total: number;
        active: number;
        inactive: number;
        totalSubmissions: number;
        recentSubmissions: number;
        topForms: ITopForm[];
    };

    // Email Analytics
    emails: {
        total: number;
        sent: number;
        failed: number;
        recent?: IRecentEmail[];

        // Backwards-compatible fields (may be absent depending on API version)
        delivered?: number;
        opened?: number;
        clicked?: number;
        bounced?: number;
        deliveryRate?: number;
        openRate?: number;
        clickRate?: number;
    };

    // Organization Analytics (Super Admin only)
    organizations?: {
        total: number;
        active: number;
        byPlan: {
            plan: string;
            count: number;
        }[];
    };

    // Pipeline Analytics
    pipelines: {
        total: number;
        active: number;
        averageLeadsPerPipeline: number;
        topPipelines: ITopPipeline[];
    };

    // Appointment Analytics
    appointments: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        noshow: number;
        upcoming: IUpcomingAppointment[]; // Not affected by date filter
    };

    // Conversation Analytics
    conversations: {
        total: number;
        activeToday: number;
        avgMessagesPerConversation: number;
    };

    // Billing Analytics
    billing: {
        totalBill: number;
        totalPaid: number;
        invoiceDue: number;
        totalDue: number;
        invoiceCount: number;
        paidInvoices: number;
        pendingInvoices: number;
        overdueInvoices: number;
    };

    // Payment/Revenue Analytics (from JobPayment)
    payments: {
        totalRevenue: number;
        monthlyRevenue: number;
        successfulPayments: number;
        failedPayments: number;
        pendingPayments: number;
        processingPayments: number;
        refundedPayments: number;
    };

    // Finance (Expenses, Revenue, ROI)
    finance?: {
        totalExpense: number;
        totalRevenue: number;
        grossProfit: number; // totalRevenue - totalExpense
        roiPercent: number; // (profit / expense) * 100
        marginPercent: number; // (profit / revenue) * 100
        expenseByStatus: {
            status: string;
            count: number;
            totalExpense: number;
            totalCost: number;
        }[];
        revenueByStatus: {
            status: string;
            count: number;
            totalRevenue: number;
        }[];
        timeSeries?: {
            revenue: IAmountSeries;
            expense: IAmountSeries;
            roi: { date: string; percent: number }[];
        };
    };

    // Ad Platform Spending (Facebook & Google)
    adSpending?: {
        facebook: IAdSpending;
        google: IAdSpending;
        totalAdSpend: number; // Combined Facebook + Google spend
    };

    // Activity/Log Analytics
    activities: {
        totalLogs: number;
        recentActivities: number; // Last 24 hours
    };

    // System Health
    system: {
        uploadsCount: number;
        totalStorageUsed?: number;
    };

    // Time Series Data for Dashboard Line Chart
    timeSeries: ITimeSeries;
}

export interface IAnalyticsQuery {
    startDate?: string;
    endDate?: string;
    org?: string; // For super admin to filter by specific org
    pipelineId?: string; // For pipeline-specific filtering
    userId?: string; // For user-specific filtering (tasks)
    status?: string; // For status filtering
}

export interface IDashboardAnalyticsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: IDashboardAnalytics;
}

// Configuration Status Types for Alert Badge
export interface IConfigurationStatus {
    email: {
        configured: boolean;
        provider?: string;
        isActive?: boolean;
    };
    phone: {
        configured: boolean;
        provider?: string;
        isActive?: boolean;
        hasPhoneNumber?: boolean;
        phoneNumber?: string;
        isDefault?: boolean;
    };
    facebook: {
        configured: boolean;
        status?: string;
        hasAdAccount?: boolean;
    };
    googleAds: {
        configured: boolean;
        hasCustomerId?: boolean;
    };
    googleCalendar: {
        configured: boolean;
        hasCalendarSelected?: boolean;
    };
    calendly: {
        configured: boolean;
        userEmail?: string;
    };
    paymentGateway: {
        configured: boolean;
        provider?: string;
        isConnected?: boolean;
    };
    allConfigured: boolean;
    missingConfigurations: string[];
}

export interface IConfigurationStatusResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: IConfigurationStatus;
}
