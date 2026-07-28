import { sidebarItems } from "@/routes/sidebarItems";
import { IFeature } from "@/types/feature.type";

export const getSidebarItems = (features: IFeature[] = []) => {
  const items = [...sidebarItems]

  // Filter items based on features with active view permission
  const allowedKeys = features
    .filter(feature => {
      // Check if view action exists and is active
      const viewAction = feature.actions?.find(action => action.value === "view");
      return viewAction && viewAction.isActive === true;
    })
    .map(f => f.key);
  
  items[0].items = items[0].items.filter(item => allowedKeys.includes(item.key));

  return items;
};
