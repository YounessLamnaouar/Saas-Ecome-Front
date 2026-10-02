import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

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

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        brand: product.brand || "",
        sku: product.sku || "",
        category: product.category || "",
        image: product.image || "",
        tags: (product.tags || []).join(", "),
      });
    }
  }, [product]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      category: form.category,
      image: form.image.trim() || "https://picsum.photos/seed/new-product/400/400",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (isEdit) {
      await updateProduct.mutateAsync({ id, patch: payload });
    } else {
      await createProduct.mutateAsync(payload);
    }
    navigate("/admin/products");
  };

  const saving = createProduct.isPending || updateProduct.isPending;

  if (isEdit && loadingProduct) {
    return <p className="text-gray-400">Loading product…</p>;
  }
  if (isEdit && !loadingProduct && !product) {
    return <p className="text-gray-500">Product not found.</p>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={14} /> Back to products
      </Link>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={set("name")} placeholder="Summer Dress" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={set("description")} rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" min="0" required value={form.price} onChange={set("price")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" required value={form.stock} onChange={set("stock")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={set("brand")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={set("sku")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {(categories || []).map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={form.image} onChange={set("image")} placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Collections / tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={set("tags")} placeholder="featured, sale, trending" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {isEdit ? "Save changes" : "Create product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
