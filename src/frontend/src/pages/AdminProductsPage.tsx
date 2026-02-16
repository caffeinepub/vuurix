import { useState } from 'react';
import { useProducts } from '../hooks/queries/useProducts';
import { useIsCallerAdmin } from '../hooks/queries/useIsCallerAdmin';
import { useAddProduct } from '../hooks/mutations/useAddProduct';
import { useUpdateProduct } from '../hooks/mutations/useUpdateProduct';
import { useDeleteProduct } from '../hooks/mutations/useDeleteProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import ProductImage from '../components/store/ProductImage';
import type { Product, ProductId } from '../backend';
import Price from '../components/design/Price';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  sizes: string;
  colors: string;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  sizes: '',
  colors: ''
};

export default function AdminProductsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading, error: productsError, refetch } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImagePreview('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', ')
    });
    setImagePreview(product.imageUrl);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImagePreview('');
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setFormData({ ...formData, imageUrl: dataUrl });
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceInCents = BigInt(Math.round(parseFloat(formData.price) * 100));
    const sizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
    const colors = formData.colors.split(',').map(c => c.trim()).filter(c => c);

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          name: formData.name,
          description: formData.description,
          price: priceInCents,
          category: formData.category,
          imageUrl: formData.imageUrl,
          sizes,
          colors
        });
      } else {
        await addProduct.mutateAsync({
          name: formData.name,
          description: formData.description,
          price: priceInCents,
          category: formData.category,
          imageUrl: formData.imageUrl,
          sizes,
          colors
        });
      }
      handleCloseForm();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDelete = async (product: Product) => {
    setDeleteConfirmProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    try {
      await deleteProduct.mutateAsync(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  if (adminLoading) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAdmin) {
    return (
      <div className="vuurix-container py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You do not have permission to access this page. Only administrators can manage products.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (productsLoading) {
    return <LoadingState message="Loading products..." />;
  }

  if (productsError) {
    return <ErrorState message="Failed to load products" onRetry={refetch} />;
  }

  return (
    <div className="vuurix-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-2">Add, edit, and manage your store products</p>
        </div>
        <Button onClick={handleOpenCreate} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No products yet. Click "Add Product" to create your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <ProductImage
                        imageUrl={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Price amount={product.price} />
                    </TableCell>
                    <TableCell>{product.sizes.join(', ')}</TableCell>
                    <TableCell>{product.colors.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below.' : 'Fill in the details to create a new product.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Classic White T-Shirt"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Describe the product..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., T-Shirts"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                />
              </div>

              <div>
                <Label htmlFor="colors">Colors (comma-separated)</Label>
                <Input
                  id="colors"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Black, White, Navy"
                />
              </div>

              <div className="space-y-3">
                <Label>Product Image</Label>
                
                <div>
                  <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>

                <div>
                  <Label htmlFor="imageFile" className="text-sm text-muted-foreground">Upload Image File</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon" asChild>
                      <label htmlFor="imageFile" className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                      </label>
                    </Button>
                  </div>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">Preview</Label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-48 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/generated/vuurix-product-placeholder-2.dim_800x800.png';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addProduct.isPending || updateProduct.isPending}
              >
                {addProduct.isPending || updateProduct.isPending
                  ? 'Saving...'
                  : editingProduct
                  ? 'Update Product'
                  : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmProduct} onOpenChange={() => setDeleteConfirmProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
