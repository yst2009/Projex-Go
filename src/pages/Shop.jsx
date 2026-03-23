import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Plus, Phone } from 'lucide-react';
import CreateProduct from './CreateProduct'; 

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/shop/products');
      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const newParts = products.filter(p => p.condition === 'new');
  const usedParts = products.filter(p => p.condition === 'used');

  if (showCreate) {
    return <CreateProduct onBack={() => setShowCreate(false)} onCreated={() => {
        setShowCreate(false);
        fetchProducts();
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">المتجر الإلكتروني</h1>
            <p className="text-gray-600">تصفح وشراء قطع الغيار الجديدة والمستعملة لمشاريعك.</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-blue-600 hover:bg-blue-700">
             <Plus className="w-4 h-4 ml-2" /> بيع منتج
          </Button>
        </div>

        {loading ? (
            <div className="text-center py-20">جاري تحميل المنتجات...</div>
        ) : (
            <>
                <section>
                    <h2 className="text-3xl font-bold mb-6 border-r-4 border-blue-600 pr-4">قطع غيار جديدة</h2>
                    {newParts.length === 0 ? <p className="text-gray-500">لا توجد منتجات جديدة حالياً.</p> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newParts.map((part) => (
                            <ProductCard key={part.id} part={part} type="new" />
                        ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 border-r-4 border-yellow-500 pr-4">قطع غيار مستعملة</h2>
                    {usedParts.length === 0 ? <p className="text-gray-500">لا توجد منتجات مستعملة حالياً.</p> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {usedParts.map((part) => (
                            <ProductCard key={part.id} part={part} type="used" />
                        ))}
                        </div>
                    )}
                </section>
            </>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ part, type }) => {
    const imageUrl = part.image ? `http://127.0.0.1:8000${part.image}` : null;
    
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative h-48 bg-gray-200">
                {imageUrl ? (
                    <img src={imageUrl} alt={part.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">لا توجد صورة</div>
                )}
                <Badge className={`absolute top-3 right-3 ${type === 'new' ? 'bg-blue-600' : 'bg-yellow-500'}`}>
                    {part.price} جنيه
                </Badge>
            </div>
            <CardHeader>
                <CardTitle>{part.name}</CardTitle>
                <CardDescription className="line-clamp-2">{part.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>الحالة: {type === 'new' ? 'جديد' : 'مستعمل'}</span>
                    <span className="flex items-center gap-1 text-green-600">
                        <Phone className="w-3 h-3" /> {part.contact_info}
                    </span>
                </div>
                <Button className="w-full">
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    تواصل للشراء
                </Button>
            </CardContent>
        </Card>
    );
};

export default Shop;
