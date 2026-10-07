import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { compressImage } from "@/lib/imageCompressor";
import { toast } from "sonner";

const EMPTY_FORM = { name: "", description: "", price: "", stock: "", brand: "", sku: "", category: "", image: "", tags: "" };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: product, isLoading: loadingProduct } = useProduct(isEdit ? id : null);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageMode, setImageMode] = useState("url");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        brand: product.brand || "",
        sku: product.sku || "",
        category: product.category || (categories?.[0]?.slug || ""),
        image: product.image || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
    }
  }, [product, categories]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file, 800, 800, 0.85);
      setForm((f) => ({ ...f, image: compressedDataUrl }));
      toast.success("Image uploaded & optimized successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    const priceNum = Number(form.price) || 0;
    if (priceNum > 999999.99) {
      toast.error("Price cannot exceed $999,999.99.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceNum,
      stock: Number(form.stock) || 0,
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      category: form.category || (categories?.[0]?.slug || "women"),
      image: form.image.trim() || "https://picsum.photos/seed/product/400/400",
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id, patch: payload });
        toast.success(`Product "${payload.name}" updated successfully!`);
      } else {
        await createProduct.mutateAsync(payload);
        toast.success(`Product "${payload.name}" created successfully!`);
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.payload?.message || err.message || "Failed to save product.");
    }
  };

  const saving = createProduct.isPending || updateProduct.isPending;

  if (isEdit && loadingProduct) {
    return <p className="text-gray-400 p-8 text-center">Loading product data…</p>;
  }
  if (isEdit && !loadingProduct && !product) {
    return <p className="text-gray-500 p-8 text-center">Product not found.</p>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
        <ArrowLeft size={14} /> Back to products
      </Link>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{isEdit ? "Edit Product" : "New Product"}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" required value={form.name} onChange={set("name")} placeholder="e.g. Summer Silk Dress" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={set("description")} rows={4} placeholder="Describe the product..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" min="0" max="999999.99" required value={form.price} onChange={set("price")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" min="0" max="999999" required value={form.stock} onChange={set("stock")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={set("brand")} placeholder="e.g. Zara" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU Code</Label>
                <Input id="sku" value={form.sku} onChange={set("sku")} placeholder="e.g. ZRA-1204" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category || (categories?.[0]?.slug || "")} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="cursor-pointer"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {(categories || []).map((c) => (
                    <SelectItem key={c.slug} value={c.slug} className="cursor-pointer">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Input: URL or File Upload */}
            <div className="space-y-2 border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-gray-900">Product Image</Label>
                <div className="flex gap-1 bg-gray-200 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageMode === "url" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                  >
                    <LinkIcon size={12} className="inline mr-1" /> Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("file")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageMode === "file" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                  >
                    <Upload size={12} className="inline mr-1" /> Upload File
                  </button>
                </div>
              </div>

              {imageMode === "url" ? (
                <Input id="image" value={form.image} onChange={set("image")} placeholder="https://..." />
              ) : (
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer bg-white" disabled={uploading} />
                  {uploading && <p className="text-xs text-amber-600 font-medium">Compressing and optimizing image...</p>}
                </div>
              )}

              {form.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-white" />
                  <span className="text-xs text-gray-500">Image preview active</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags / Collections (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={set("tags")} placeholder="featured, sale, summer" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving || uploading} className="cursor-pointer">
                {saving && <Loader2 size={14} className="animate-spin mr-1" />}
                {isEdit ? "Save Changes" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")} className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
