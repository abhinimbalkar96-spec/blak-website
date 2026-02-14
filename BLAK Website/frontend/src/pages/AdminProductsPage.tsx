import { useState } from 'react';
import { useProducts, useAdminProducts } from '../hooks/useProducts';
import AdminGuard from '../components/blak/AdminGuard';
import ImageUploadField from '../components/blak/ImageUploadField';
import { usePageMeta } from '../hooks/usePageMeta';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Product } from '../backend';
import type { ExternalBlob } from '../backend';

export default function AdminProductsPage() {
  usePageMeta('Admin — Products', 'Manage your product inventory.');

  return (
    <AdminGuard>
      <AdminProductsContent />
    </AdminGuard>
  );
}

function AdminProductsContent() {
  const { data: products, isLoading } = useProducts();
  const { addProduct, updateProduct, deleteProduct, adjustStock } = useAdminProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Hoodies',
    sizes: [] as string[],
    image: null as ExternalBlob | null,
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Hoodies',
      sizes: [],
      image: null,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      sizes: product.sizes,
      image: product.image || null,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      id: formData.id || `PROD-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: BigInt(formData.stock),
      category: formData.category,
      sizes: formData.sizes,
      image: formData.image || undefined,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter">Product Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <button className="bg-black text-white px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hoodies">Hoodies</SelectItem>
                      <SelectItem value="Tees">Tees</SelectItem>
                      <SelectItem value="Jackets">Jackets</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Available Sizes</Label>
                  <div className="flex gap-2 mt-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <ImageUploadField
                  currentImage={formData.image}
                  onImageChange={(image) => setFormData({ ...formData, image })}
                />

                <button
                  type="submit"
                  disabled={addProduct.isPending || updateProduct.isPending}
                  className="w-full bg-black text-white py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {addProduct.isPending || updateProduct.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : editingProduct ? (
                    'Update Product'
                  ) : (
                    'Add Product'
                  )}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : products && products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-600">No products yet. Add your first product to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => {
              const imageUrl = product.image
                ? product.image.getDirectURL()
                : `/assets/generated/product-${product.category.toLowerCase()}.dim_1200x1200.jpg`;

              return (
                <div key={product.id} className="border border-gray-200 p-6">
                  <img src={imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4" />
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mb-2">Stock: {product.stock.toString()}</p>
                  <p className="text-sm text-gray-600 mb-4">Sizes: {product.sizes.join(', ')}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 border border-black text-black px-4 py-2 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
