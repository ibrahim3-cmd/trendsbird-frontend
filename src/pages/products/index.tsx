import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Package, Plus, Trash2, Edit2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CanAccess } from "@/components/CanAccess";
import { useGetProductsQuery, useDeleteProductMutation } from "@/redux/features/product/product.api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useGetBrandsQuery } from "@/redux/features/brand/brand.api";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data: brandsResp } = useGetBrandsQuery({ page: 1, limit: 100 });
  const { data: categoriesResp } = useGetCategoriesQuery({ tree: false, page: 1, limit: 100 });
  const { data, isLoading } = useGetProductsQuery({
    search,
    brandId: brandId === "all" ? undefined : Number(brandId),
    categoryId: categoryId === "all" ? undefined : Number(categoryId),
    isActive: status === "all" ? undefined : status === "true",
    page,
    limit,
  });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Products"
        description="Manage your store's inventory and variations"
        icon={Package}
        action={
          <CanAccess permission="product:create">
            <Link to="/products/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </Link>
          </CanAccess>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 items-end">
        <div className="grid gap-2 xl:col-span-2">
          <Label>Search</Label>
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or SKU" />
        </div>
        <div className="grid gap-2">
          <Label>Brand</Label>
          <Select value={brandId} onValueChange={(value) => { setBrandId(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="All brands" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brandsResp?.data?.brands?.map((brand: any) => (
                <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={(value) => { setCategoryId(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoriesResp?.data?.data?.map((category: any) => (
                <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">Loading products...</div>
        ) : (
          data?.data?.products?.map((product: any) => {
            const thumbnail = product.media?.find((m: any) => m.isThumbnail)?.media || product.media?.[0]?.media;
            
            return (
              <div key={product.id} className="bg-card border rounded-xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail.thumbnailUrl || thumbnail.publicUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  {!product.isActive && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      DRAFT
                    </div>
                  )}
                  {product.stock <= 0 && product.isActive && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      OUT OF STOCK
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <CanAccess permission="product:update">
                      <Link to={`/products/edit/${product.id}`}>
                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-sm hover:bg-white">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CanAccess>
                    <CanAccess permission="product:delete">
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(product.id)} className="h-9 w-9 rounded-full shadow-sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                    <span>{product.brand?.name || "No Brand"}</span>
                    <span>SKU: {product.sku || "N/A"}</span>
                  </div>
                  <h3 className="font-semibold leading-tight line-clamp-2 mb-2 flex-1">{product.name}</h3>
                  
                  <div className="flex items-end justify-between mt-auto pt-3 border-t">
                    <div>
                      <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
                    </div>
                    <div className="text-xs text-right text-muted-foreground">
                      <div>Stock: {product.stock}</div>
                      {product.categories?.length > 0 && (
                        <div className="line-clamp-1 max-w-[120px]">{product.categories.map((c: any) => c.category.name).join(", ")}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {data?.data?.products?.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed rounded-xl flex flex-col items-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No products found</h3>
            <p className="text-muted-foreground text-sm mb-4">Start building your catalog by adding your first product.</p>
            <CanAccess permission="product:create">
              <Link to="/products/create">
                <Button>Create Product</Button>
              </Link>
            </CanAccess>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" disabled={!data?.data?.products || data.data.products.length < limit} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
