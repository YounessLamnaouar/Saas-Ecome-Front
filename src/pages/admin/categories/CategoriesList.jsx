import React, { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
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

const EMPTY = { name: "", slug: "", description: "", image: "" };

function CategoryFormDialog({ open, onOpenChange, initial, onSubmit, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  React.useEffect(() => setForm(initial || EMPTY), [initial, open]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input id="cat-name" required value={form.name} onChange={set("name")} placeholder="Sportswear" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input id="cat-slug" required value={form.slug} onChange={set("slug")} placeholder="sportswear" disabled={Boolean(initial)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" value={form.description} onChange={set("description")} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-image">Image URL</Label>
            <Input id="cat-image" value={form.image} onChange={set("image")} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>{initial ? "Save changes" : "Create category"}</Button>
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
  const [editing, setEditing] = useState(null); // category being edited, or null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories?.length || 0} categories</p>
        <Button onClick={() => setCreateOpen(true)}><Plus size={16} /> Add category</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categories || []).map((c) => (
            <Card key={c.slug}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">/{c.slug}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(c)}>
                      <Pencil size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertTitle>Delete "{c.name}"?</AlertTitle>
                          <AlertDialogDescription>Products in this category will keep their category value until reassigned.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCategory.mutate(c.slug)}>Delete</AlertDialogAction>
                        </AlertFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Package size={12} /> {c.productsCount} products
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={null}
        saving={createCategory.isPending}
        onSubmit={(form) => createCategory.mutate(form, { onSuccess: () => setCreateOpen(false) })}
      />
      <CategoryFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        initial={editing}
        saving={updateCategory.isPending}
        onSubmit={(form) => updateCategory.mutate({ slug: editing.slug, patch: { ...editing, ...form } }, { onSuccess: () => setEditing(null) })}
      />
    </div>
  );
}
