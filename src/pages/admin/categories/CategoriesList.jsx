import React, { useState } from "react";
import { Plus, Pencil, Trash2, Package, Link as LinkIcon, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter as AlertFooter,
  AlertDialogTitle as AlertTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { compressImage } from "@/lib/imageCompressor";
import { toast } from "sonner";

const EMPTY = { name: "", slug: "", description: "", image: "" };
const ITEMS_PER_PAGE = 6;

function CategoryFormDialog({ open, onOpenChange, initial, onSubmit, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [imageMode, setImageMode] = useState("url");
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => setForm(initial || EMPTY), [initial, open]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImage(file, 600, 600, 0.85);
      setForm((f) => ({ ...f, image: dataUrl }));
      toast.success("Image uploaded & optimized successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input id="cat-name" required value={form.name} onChange={set("name")} placeholder="e.g. Sportswear" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input id="cat-slug" value={form.slug} onChange={set("slug")} placeholder="e.g. sportswear" disabled={Boolean(initial)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" value={form.description} onChange={set("description")} rows={3} placeholder="Brief category description..." />
          </div>

          <div className="space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-gray-900 text-xs">Category Image</Label>
              <div className="flex gap-1 bg-gray-200 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${imageMode === "url" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                >
                  <LinkIcon size={10} className="inline mr-1" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("file")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${imageMode === "file" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                >
                  <Upload size={10} className="inline mr-1" /> File
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <Input id="cat-image" value={form.image} onChange={set("image")} placeholder="https://..." />
            ) : (
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer bg-white text-xs" disabled={uploading} />
            )}

            {form.image && (
              <div className="flex items-center gap-2 pt-1">
                <img src={form.image} alt="Preview" className="h-10 w-10 object-cover rounded border border-gray-200" />
                <span className="text-[10px] text-gray-500">Image selected</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving || uploading} className="cursor-pointer">
              {initial ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesList() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const list = categories || [];
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCreate = (form) => {
    createCategory.mutate(form, {
      onSuccess: () => {
        toast.success(`Category "${form.name}" created!`);
        setCreateOpen(false);
      },
      onError: (err) => toast.error(err.message || "Failed to create category."),
    });
  };

  const handleUpdate = (form) => {
    updateCategory.mutate(
      { slug: editing.slug, patch: { ...editing, ...form } },
      {
        onSuccess: () => {
          toast.success(`Category "${form.name}" updated!`);
          setEditing(null);
        },
        onError: (err) => toast.error(err.message || "Failed to update category."),
      }
    );
  };

  const handleDelete = (slug, name) => {
    deleteCategory.mutate(slug, {
      onSuccess: () => toast.info(`Category "${name}" deleted.`),
      onError: () => toast.error("Failed to delete category."),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{list.length} categories total</p>
        <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-1">
          <Plus size={16} /> Add category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCategories.map((c) => (
              <Card key={c.slug} className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <Package size={18} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-400">/{c.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(c)} className="cursor-pointer">
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 cursor-pointer">
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertTitle>Delete "{c.name}"?</AlertTitle>
                            <AlertDialogDescription>Products in this category will keep their category value until reassigned.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.slug, c.name)} className="cursor-pointer bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </AlertFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description || "No description provided."}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Package size={12} /> {c.productsCount} products
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
              <p>Page {page} of {totalPages} · {list.length} categories</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer">
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="cursor-pointer">
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={null}
        saving={createCategory.isPending}
        onSubmit={handleCreate}
      />
      <CategoryFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        initial={editing}
        saving={updateCategory.isPending}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
