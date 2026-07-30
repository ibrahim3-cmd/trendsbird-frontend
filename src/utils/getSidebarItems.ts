import { sidebarItems } from "@/routes/sidebarItems";

export const getSidebarItems = (features: any[] = []) => {
  const items = [...sidebarItems]

  // Filter items based on features with active view permission
  const allowedKeys = features
    .filter(feature => {
      // Check if view action exists and is active
      const viewAction = feature.actions?.find((action: any) => action.value === "view");
      return viewAction && viewAction.isActive === true;
    })
    .map(f => f.key);
  
  items[0].items = items[0].items.filter(item => allowedKeys.includes(item.key));

  return items;
};
