import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Package, ArrowLeft, Save, Loader2, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetBrandsQuery } from "@/redux/features/brand/brand.api";
import { useGetAttributesQuery } from "@/redux/features/attribute/attribute.api";
import { useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery } from "@/redux/features/product/product.api";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { getMediaUrl } from "@/utils/getMediaUrl";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: categoriesData } = useGetCategoriesQuery({ tree: false });
  const { data: brandsData } = useGetBrandsQuery({});
  const { data: attributesData } = useGetAttributesQuery({});
  const { data: productData, isLoading: isProductLoading } = useGetProductByIdQuery(Number(id), { skip: !isEditing });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSaving = isCreating || isUpdating;

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    brandId: "" as string | number,
    isActive: true,
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [productMedia, setProductMedia] = useState<{ id: number; url: string; isThumbnail: boolean }[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (isEditing && productData?.data) {
      const p = productData.data;
      setBasicInfo({
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price: p.price,
        stock: p.stock,
        sku: p.sku || "",
        brandId: p.brandId || "",
        isActive: p.isActive,
      });
      setSelectedCategories(p.categories?.map((c: any) => c.categoryId) || []);
      setProductMedia(
        p.media?.map((m: any) => ({
          id: m.mediaId,
          url: getMediaUrl(m.media.thumbnailUrl || m.media.publicUrl),
          isThumbnail: m.isThumbnail,
        })) || []
      );
      
      const mappedVariants = p.variants?.map((v: any) => ({
        id: v.id,
        sku: v.sku || "",
        price: v.price,
        stock: v.stock,
        isActive: v.isActive,
        attributeValueIds: v.attributeValues?.map((av: any) => av.attributeValueId) || [],
      })) || [];
      setVariants(mappedVariants);
    }
  }, [productData, isEditing]);

  const handleMediaSelect = (media: any[]) => {
    const newMedia = media.filter(m => !productMedia.some(pm => pm.id === m.id)).map(m => ({
      id: m.id,
      url: getMediaUrl(m.thumbnailUrl || m.publicUrl),
      isThumbnail: productMedia.length === 0, // First selected becomes thumb
    }));
    setProductMedia([...productMedia, ...newMedia]);
  };

  const removeMedia = (id: number) => {
    setProductMedia(productMedia.filter(m => m.id !== id));
  };

  const setThumbnail = (id: number) => {
    setProductMedia(productMedia.map(m => ({ ...m, isThumbnail: m.id === id })));
  };

  const addVariant = () => {
    setVariants([...variants, { sku: "", price: basicInfo.price, stock: 0, isActive: true, attributeValueIds: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleVariantAttributeChange = (variantIndex: number, attributeId: number, valueId: string) => {
    const newVariants = [...variants];
    const valIdNum = Number(valueId);
    
    // Find if variant already has a value for this attribute
    const allAttrValues = attributesData?.data?.attributes?.find((a: any) => a.id === attributeId)?.values || [];
    const attrValueIds = allAttrValues.map((v: any) => v.id);
    
    let currentValues = [...(newVariants[variantIndex].attributeValueIds || [])];
    
    // Remove any existing value for this attribute
    currentValues = currentValues.filter(id => !attrValueIds.includes(id));
    
    // Add new value
    if (valIdNum) {
      currentValues.push(valIdNum);
    }
    
    newVariants[variantIndex].attributeValueIds = currentValues;
    setVariants(newVariants);
  };

  const getVariantAttributeValue = (variant: any, attributeId: number) => {
    const allAttrValues = attributesData?.data?.attributes?.find((a: any) => a.id === attributeId)?.values || [];
    const attrValueIds = allAttrValues.map((v: any) => v.id);
    const val = variant.attributeValueIds?.find((id: number) => attrValueIds.includes(id));
    return val ? String(val) : "";
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...basicInfo,
        price: Number(basicInfo.price),
        stock: Number(basicInfo.stock),
        brandId: basicInfo.brandId ? Number(basicInfo.brandId) : null,
        categoryIds: selectedCategories,
        media: productMedia.map((m, index) => ({
          mediaId: m.id,
          isThumbnail: m.isThumbnail,
          sortOrder: index
        })),
        variants: variants.map(v => ({
          id: v.id, // Only for update
          sku: v.sku || null,
          price: Number(v.price),
          stock: Number(v.stock),
          isActive: v.isActive,
          attributeValueIds: v.attributeValueIds
        }))
      };

      if (isEditing) {
        await updateProduct({ id: Number(id), data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
        navigate("/products");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  if (isEditing && isProductLoading) {
    return <div className="p-12 text-center">Loading product data...</div>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full pb-20">
      <PageHeader
        title={isEditing ? "Edit Product" : "Add New Product"}
        description={isEditing ? `Editing: ${basicInfo.name}` : "Create a new product in your catalog"}
        icon={Package}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/products")} disabled={isSaving}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !basicInfo.name}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 mt-0">
          <Card>
            <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="e.g. Premium Cotton T-Shirt"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Base Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7"
                    value={basicInfo.price}
                    onChange={(e) => setBasicInfo({ ...basicInfo, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Base Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={basicInfo.stock}
                  onChange={(e) => setBasicInfo({ ...basicInfo, stock: Number(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={basicInfo.sku}
                  onChange={(e) => setBasicInfo({ ...basicInfo, sku: e.target.value })}
                  placeholder="Stock Keeping Unit"
                />
              </div>

              <div className="grid gap-2">
                <Label>Brand</Label>
                <Select value={basicInfo.brandId ? String(basicInfo.brandId) : "none"} onValueChange={(v) => setBasicInfo({ ...basicInfo, brandId: v === "none" ? "" : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Brand</SelectItem>
                    {brandsData?.data?.brands?.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label>Categories</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto bg-muted/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoriesData?.data?.map((cat: any) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, cat.id]);
                          else setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                        }}
                        className="rounded border-input"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                  {!categoriesData?.data?.length && <div className="text-sm text-muted-foreground">No categories available.</div>}
                </div>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  placeholder="Write a detailed description of the product..."
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2 pt-4 border-t">
                <Switch
                  id="isActive"
                  checked={basicInfo.isActive}
                  onCheckedChange={(c) => setBasicInfo({ ...basicInfo, isActive: c })}
                />
                <Label htmlFor="isActive" className="font-semibold">Product is active and visible</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Product Images</h3>
                  <p className="text-sm text-muted-foreground">Upload and manage images for this product.</p>
                </div>
                <Button onClick={() => setIsMediaPickerOpen(true)} className="gap-2">
                  <ImageIcon className="h-4 w-4" /> Add Media
                </Button>
              </div>

              {productMedia.length === 0 ? (
                <div className="py-12 border-2 border-dashed rounded-lg text-center bg-muted/20">
                  <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-1">No media selected</p>
                  <p className="text-sm text-muted-foreground/70">Click Add Media to select images from your library</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {productMedia.map((media) => (
                    <div key={media.id} className={`relative aspect-square border rounded-lg overflow-hidden group ${media.isThumbnail ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                      <img src={getMediaUrl(media.url)} alt="Product media" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {!media.isThumbnail && (
                          <Button size="sm" variant="secondary" className="h-7 text-xs px-2" onClick={() => setThumbnail(media.id)}>
                            Set Main
                          </Button>
                        )}
                        <Button size="icon" variant="destructive" className="h-7 w-7 rounded-full" onClick={() => removeMedia(media.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {media.isThumbnail && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          MAIN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Product Variants</h3>
                  <p className="text-sm text-muted-foreground">Add variations like size or color with specific pricing and stock.</p>
                </div>
                <Button onClick={addVariant} className="gap-2" variant="secondary">
                  <Plus className="h-4 w-4" /> Add Variant
                </Button>
              </div>

              {variants.length === 0 ? (
                <div className="py-12 border border-dashed rounded-lg text-center bg-muted/20">
                  <p className="text-muted-foreground font-medium mb-1">No variants configured</p>
                  <p className="text-sm text-muted-foreground/70">This product will be sold as a single standard item</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/10 relative">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeVariant(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="font-medium mb-4 pb-2 border-b">Variant #{index + 1}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="grid gap-1.5">
                          <Label className="text-xs">SKU</Label>
                          <Input size={1} className="h-8" value={variant.sku} onChange={e => updateVariant(index, 'sku', e.target.value)} placeholder="Variant SKU" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Price</Label>
                          <Input size={1} className="h-8" type="number" value={variant.price} onChange={e => updateVariant(index, 'price', Number(e.target.value))} />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Stock</Label>
                          <Input size={1} className="h-8" type="number" value={variant.stock} onChange={e => updateVariant(index, 'stock', Number(e.target.value))} />
                        </div>
                        <div className="flex flex-col justify-end gap-1.5 pt-2">
                          <div className="flex items-center gap-2 h-8">
                            <Switch checked={variant.isActive} onCheckedChange={c => updateVariant(index, 'isActive', c)} />
                            <Label className="text-xs font-medium">Active</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 pt-2 bg-background p-3 rounded border">
                        {attributesData?.data?.attributes?.map((attr: any) => (
                          <div key={attr.id} className="grid gap-1.5">
                            <Label className="text-xs">{attr.name}</Label>
                            <Select 
                              value={getVariantAttributeValue(variant, attr.id) || "none"} 
                              onValueChange={(v) => handleVariantAttributeChange(index, attr.id, v)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder={`Select ${attr.name}`} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {attr.values.map((v: any) => (
                                  <SelectItem key={v.id} value={String(v.id)}>
                                    <div className="flex items-center gap-2">
                                      {attr.type === 'color' && <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: v.colorCode || '#000' }} />}
                                      {v.value}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        multiple={true}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
