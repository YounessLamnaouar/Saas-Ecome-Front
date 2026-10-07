import React, { useState } from "react";
import { Plus, Pencil, Trash2, Sparkles, Package, Loader2, Link as LinkIcon, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from "@/hooks/useCollections";
import { compressImage } from "@/lib/imageCompressor";

const DEFAULT_FORM = { name: "", slug: "", description: "", image: "", is_featured: false };
const ITEMS_PER_PAGE = 6;

export default function Collections() {
  const { data: collections, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [imageMode, setImageMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

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

  const list = collections || [];
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const paginatedCollections = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Sparkles size={14} /> Manage product collections stored in the database.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
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

            {/* Image Input (URL or Upload) */}
            <div className="space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-gray-900 text-xs">Collection Image</Label>
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
                <Input id="col-image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
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

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="col-featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 h-4 w-4 cursor-pointer"
              />
              <Label htmlFor="col-featured" className="cursor-pointer">Mark as Featured Collection</Label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || uploading} className="cursor-pointer">
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
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(deleteTarget.slug, deleteTarget.name)} className="cursor-pointer bg-red-600 hover:bg-red-700">
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

            {!isLoading && list.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  No collections created yet. Click "Add Collection" to get started.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              paginatedCollections.map((col) => (
                <TableRow key={col.id || col.slug}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {col.image ? (
                        <img src={col.image} alt={col.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
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
                      <Button variant="ghost" size="sm" onClick={() => openEdit(col)} className="cursor-pointer">
                        <Pencil size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(col)} className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
          <p>Page {page} of {totalPages} · {list.length} collections</p>
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
    </div>
  );
}
