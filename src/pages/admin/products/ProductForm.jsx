import { translate } from '@/lib/translations';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
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
import { useCollections } from "@/hooks/useCollections";
import { compressImage } from "@/lib/imageCompressor";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  sku: "",
  category: "",
  image: "",
  tags: "",
  collectionIds: [],
};

export default function ProductForm() {
 const { t: tr } = useTranslationPreferences();

  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: product, isLoading: loadingProduct } = useProduct(isEdit ? id : null);
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();
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
        collectionIds: Array.isArray(product.collectionIds)
          ? product.collectionIds
          : Array.isArray(product.collections)
          ? product.collections.map((c) => c.id)
          : [],
      });
    }
  }, [product, categories]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleCollection = (colId) => {
    setForm((f) => {
      const current = f.collectionIds || [];
      const exists = current.includes(colId);
      return {
        ...f,
        collectionIds: exists ? current.filter((id) => id !== colId) : [...current, colId],
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file, 800, 800, 0.85);
      setForm((f) => ({ ...f, image: compressedDataUrl }));
      toast.success(translate("Image uploaded & optimized successfully!"));
    } catch (err) {
      toast.error(translate(err.message || "Failed to process image file."));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error(translate("Product name is required."));
      return;
    }

    const priceNum = Number(form.price) || 0;
    if (priceNum > 999999.99) {
      toast.error(translate("Price cannot exceed $999,999.99."));
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
      collectionIds: form.collectionIds || [],
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id, patch: payload });
        toast.success(translate(`Product "${payload.name}" updated successfully!`));
      } else {
        await createProduct.mutateAsync(payload);
        toast.success(translate(`Product "${payload.name}" created successfully!`));
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(translate(err.payload?.message || err.message || "Failed to save product."));
    }
  };

  const saving = createProduct.isPending || updateProduct.isPending;

  if (isEdit && loadingProduct) {
    return <p className="text-gray-400 p-8 text-center"> <T>Loading product data…</T> </p>;
  }
  if (isEdit && !loadingProduct && !product) {
    return <p className="text-gray-500 p-8 text-center"> <T>Product not found.</T> </p>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
        <ArrowLeft size={14} /> <T>Back to products</T> </Link>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4"><T>{isEdit ? "Edit Product" : "New Product"}</T></h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name"> <T>Product Name</T> </Label>
              <Input id="name" required value={form.name} onChange={set("name")} placeholder={tr("e.g. Summer Silk Dress")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description"> <T>Description</T> </Label>
              <Textarea id="description" value={form.description} onChange={set("description")} rows={4} placeholder={tr("Describe the product...")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price"> <T>Price ($)</T> </Label>
                <Input id="price" type="number" step="0.01" min="0" max="999999.99" required value={form.price} onChange={set("price")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock"> <T>Stock Quantity</T> </Label>
                <Input id="stock" type="number" min="0" max="999999" required value={form.stock} onChange={set("stock")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand"> <T>Brand</T> </Label>
                <Input id="brand" value={form.brand} onChange={set("brand")} placeholder={tr("e.g. Zara")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku"> <T>SKU Code</T> </Label>
                <Input id="sku" value={form.sku} onChange={set("sku")} placeholder={tr("e.g. ZRA-1204")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label> <T>Category</T> </Label>
              <Select value={form.category || (categories?.[0]?.slug || "")} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="cursor-pointer"><SelectValue placeholder={tr("Select a category")} /></SelectTrigger>
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
                <Label className="font-semibold text-gray-900"> <T>Product Image</T> </Label>
                <div className="flex gap-1 bg-gray-200 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageMode === "url" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                  >
                    <LinkIcon size={12} className="inline mr-1" /> <T>Image URL</T> </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("file")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageMode === "file" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                  >
                    <Upload size={12} className="inline mr-1" /> <T>Upload File</T> </button>
                </div>
              </div>

              {imageMode === "url" ? (
                <Input id="image" value={form.image} onChange={set("image")} placeholder={tr("https://...")} />
              ) : (
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer bg-white" disabled={uploading} />
                  {uploading && <p className="text-xs text-amber-600 font-medium"> <T>Compressing and optimizing image...</T> </p>}
                </div>
              )}

              {form.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-white" />
                  <span className="text-xs text-gray-500"> <T>Image preview active</T> </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label> <T>Collections</T> </Label>
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-wrap gap-2">
                {!collections || collections.length === 0 ? (
                  <p className="text-xs text-gray-500"> <T>No collections available.</T> </p>
                ) : (
                  collections.map((col) => {
                    const isSelected = form.collectionIds?.includes(col.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => toggleCollection(col.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span>{col.name}</span>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags"> <T>Tags (comma separated)</T> </Label>
              <Input id="tags" value={form.tags} onChange={set("tags")} placeholder={tr("featured, sale, summer")} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving || uploading} className="cursor-pointer">
                {saving && <Loader2 size={14} className="animate-spin mr-1" />}
                <T>{isEdit ? "Save Changes" : "Create Product"}</T>
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")} className="cursor-pointer"> <T>Cancel</T> </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
