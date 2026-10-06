import React, { useState } from "react";
import { Plus, Pencil, Trash2, Sparkles, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from "@/hooks/useCollections";

const DEFAULT_FORM = { name: "", slug: "", description: "", image: "", is_featured: false };

export default function Collections() {
  const { data: collections, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditingCollection(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (col) => {
    setEditingCollection(col);
    setForm({
      name: col.name || "",
      slug: col.slug || "",
      description: col.description || "",
      image: col.image || "",
      is_featured: !!col.is_featured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCollection) {
        await updateCollection.mutateAsync({ slug: editingCollection.slug, patch: form });
        toast.success(`Collection "${form.name}" updated successfully!`);
      } else {
        await createCollection.mutateAsync(form);
        toast.success(`Collection "${form.name}" created successfully!`);
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err.payload?.message || err.message || "Action failed.");
    }
  };

  const handleDelete = async (slug, name) => {
    try {
      await deleteCollection.mutateAsync(slug);
      toast.info(`Collection "${name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete collection.");
    }
  };

  const isSubmitting = createCollection.isPending || updateCollection.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Sparkles size={14} /> Manage product collections stored in the database.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Add Collection
        </Button>
      </div>

      {/* Dialog for Create / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCollection ? "Edit Collection" : "Create Collection"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="col-name">Collection Name</Label>
              <Input
                id="col-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer Essentials"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-slug">Slug (Optional)</Label>
              <Input
                id="col-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. summer-essentials"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-desc">Description</Label>
              <Textarea
                id="col-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief summary of this collection..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-image">Image URL</Label>
              <Input
                id="col-image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="col-featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 h-4 w-4"
              />
              <Label htmlFor="col-featured" className="cursor-pointer">Mark as Featured Collection</Label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : editingCollection ? "Save Changes" : "Create Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {deleteTarget && (
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{deleteTarget.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This collection will be permanently removed. Products associated with it will remain unaffected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(deleteTarget.slug, deleteTarget.name)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Table listing collections */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collection</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-10" /></TableCell>
                </TableRow>
              ))}

            {!isLoading && (collections || []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  No collections created yet. Click "Add Collection" to get started.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              (collections || []).map((col) => (
                <TableRow key={col.id || col.slug}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {col.image ? (
                        <img src={col.image} alt={col.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <Package size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{col.name}</p>
                        <p className="text-xs text-gray-400">/{col.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {col.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{col.products_count ?? col.products?.length ?? 0} products</Badge>
                  </TableCell>
                  <TableCell>
                    {col.is_featured ? (
                      <Badge variant="success">Featured</Badge>
                    ) : (
                      <Badge variant="secondary">Standard</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(col)}>
                        <Pencil size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(col)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
