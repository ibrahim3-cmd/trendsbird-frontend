import { IUserFeatureAccess } from "@/types/user.type";

const getFeaturesFromStorage = (): IUserFeatureAccess[] => {
    const data = localStorage.getItem("features");
    return data ? JSON.parse(data) : [];
};

// Recursive search for feature or subFeature
const findFeature = (features: IUserFeatureAccess[], key: string): IUserFeatureAccess | undefined => {
    for (const f of features) {
        if (f.key === key) return f;
        if (f.subFeatures?.length) {
            const found = findFeature(f.subFeatures, key);
            if (found) return found;
        }
    }
    return undefined;
};

// Find sub-feature by key within a specific feature
const findSubFeature = (feature: IUserFeatureAccess, subFeatureKey: string): IUserFeatureAccess | undefined => {
    return feature.subFeatures?.find(sub => sub.key === subFeatureKey);
};

export const usePermission = () => {
    const features = getFeaturesFromStorage();

    const can = (featureKey: string, action: string): boolean => {
        const featureOrSub = findFeature(features, featureKey);
        if (!featureOrSub) return false;
        return featureOrSub.actions.some(a => a.value === action && a.isActive);
    };

    const canAccessSubFeature = (featureKey: string, subFeatureKey: string, action: string): boolean => {
        const feature = features.find(f => f.key === featureKey);
        if (!feature) return false;

        const subFeature = findSubFeature(feature, subFeatureKey);
        if (!subFeature) return false;

        return subFeature.actions.some(a => a.value === action && a.isActive);
    };

    const filterTabsBySubFeatures = <T extends { name: string; key?: string; [key: string]: any }>(
        featureKey: string,
        tabs: T[]
    ): T[] => {
        const feature = features.find(f => f.key === featureKey);
        if (!feature) return [];

        return tabs.filter(tab => {
            // If tab has a key, check if user has access to that sub-feature
            if (tab.key) {
                const subFeature = findSubFeature(feature, tab.key);
                return subFeature && subFeature.actions.some(a => a.value === "view" && a.isActive);
            }
            // If no key, check if user has any access to the main feature
            return feature.actions.some(a => a.value === "view" && a.isActive);
        });
    };

    const getUserFeatures = (): IUserFeatureAccess[] => features;

    const hasFeature = (featureKey: string): boolean => {
        return features.some(f => f.key === featureKey);
    };

    
    const hasSubFeature = (featureKey: string, subFeatureKey: string): boolean => {
        const feature = features.find(f => f.key === featureKey);
        if (!feature) return false;
        return feature.subFeatures?.some(sub => sub.key === subFeatureKey) || false;
    };

    return {
        can,
        canAccessSubFeature,
        filterTabsBySubFeatures,
        getUserFeatures,
        hasFeature,
        hasSubFeature
    };
};
