import { useTranslation } from 'react-i18next';
import { translate } from '@/lib/translations';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2, Package, Link as LinkIcon, Upload, ChevronLeft, ChevronRight } from "lucide-react";
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
const ITEMS_PER_PAGE = 24;

function CategoryFormDialog({ open, onOpenChange, initial, onSubmit, saving }) {
 const { t: tr } = useTranslationPreferences();

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
      toast.success(translate("Image uploaded & optimized successfully!"));
    } catch (err) {
      toast.error(translate(err.message || "Failed to process image."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle><T>{initial ? "Edit Category" : "New Category"}</T></DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="cat-name"> <T>Category Name</T> </Label>
            <Input id="cat-name" required value={form.name} onChange={set("name")} placeholder={tr("e.g. Sportswear")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-slug"> <T>Slug</T> </Label>
            <Input id="cat-slug" value={form.slug} onChange={set("slug")} placeholder={tr("e.g. sportswear")} disabled={Boolean(initial)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc"> <T>Description</T> </Label>
            <Textarea id="cat-desc" value={form.description} onChange={set("description")} rows={3} placeholder={tr("Brief category description...")} />
          </div>

          <div className="space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-gray-900 text-xs"> <T>Category Image</T> </Label>
              <div className="flex gap-1 bg-gray-200 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${imageMode === "url" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                >
                  <LinkIcon size={10} className="inline me-1" /> <T>URL</T> </button>
                <button
                  type="button"
                  onClick={() => setImageMode("file")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${imageMode === "file" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600"}`}
                >
                  <Upload size={10} className="inline me-1" /> <T>File</T> </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <Input id="cat-image" value={form.image} onChange={set("image")} placeholder={tr("https://...")} />
            ) : (
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer bg-white text-xs" disabled={uploading} />
            )}

            {form.image && (
              <div className="flex items-center gap-2 pt-1">
                <img src={form.image} alt="Preview" className="h-10 w-10 object-cover rounded border border-gray-200" />
                <span className="text-[10px] text-gray-500"> <T>Image selected</T> </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving || uploading} className="cursor-pointer">
              <T>{initial ? "Save Changes" : "Create Category"}</T>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesList() {
  const { t: searchText } = useTranslation();
  const [search, setSearch] = useState('');
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const query = search.trim().toLocaleLowerCase();
  const list = (categories || []).filter((item) => [item.name, item.slug, item.description].some((value) => String(value || '').toLocaleLowerCase().includes(query)));
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCreate = (form) => {
    createCategory.mutate(form, {
      onSuccess: () => {
        toast.success(translate(`Category "${form.name}" created!`));
        setCreateOpen(false);
      },
      onError: (err) => toast.error(translate(err.message || "Failed to create category.")),
    });
  };

  const handleUpdate = (form) => {
    updateCategory.mutate(
      { slug: editing.slug, patch: { ...editing, ...form } },
      {
        onSuccess: () => {
          toast.success(translate(`Category "${form.name}" updated!`));
          setEditing(null);
        },
        onError: (err) => toast.error(translate(err.message || "Failed to update category.")),
      }
    );
  };

  const handleDelete = (slug, name) => {
    deleteCategory.mutate(slug, {
      onSuccess: () => toast.info(translate(`Category "${name}" deleted.`)),
      onError: () => toast.error(translate("Failed to delete category.")),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{list.length} <T>categories total</T> </p>
        <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-1">
          <Plus size={16} /> <T>Add category</T> </Button>
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={searchText('adminSearch.categories')} aria-label={searchText('adminSearch.categories')} className="ps-9" />
      </div>
      {!isLoading && query && list.length === 0 && <p role="status" className="py-6 text-center text-muted-foreground">{searchText('adminSearch.empty')}</p>}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                            <AlertTitle> <T>Delete "</T> {c.name}"?</AlertTitle>
                            <AlertDialogDescription> <T>Products in this category will keep their category value until reassigned.</T> </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertFooter>
                            <AlertDialogCancel className="cursor-pointer"> <T>Cancel</T> </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.slug, c.name)} className="cursor-pointer bg-red-600 hover:bg-red-700"> <T>Delete</T> </AlertDialogAction>
                          </AlertFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description || "No description provided."}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Package size={12} /> {c.productsCount} <T>products</T> </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
              <p> <T>Page</T> {page} <T>of</T> {totalPages} · {list.length} <T>categories</T> </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer">
                  <ChevronLeft size={14} className="rtl:rotate-180" /> <T>Prev</T> </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="cursor-pointer"> <T>Next</T> <ChevronRight size={14} className="rtl:rotate-180" />
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
