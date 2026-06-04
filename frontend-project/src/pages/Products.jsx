import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';

const empty = { ProductName: '', Category: '', Quantity: '', UnitPrice: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => getProducts().then(r => setProducts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
        flash('✅ Product updated successfully!');
      } else {
        await createProduct(form);
        flash('✅ Product added successfully!');
      }
      setForm(empty); setEditId(null); load();
    } catch (err) {
      flash('❌ ' + (err.response?.data?.message || 'Error occurred'));
    } finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setEditId(p.ProductID);
    setForm({ ProductName: p.ProductName, Category: p.Category, Quantity: p.Quantity, UnitPrice: p.UnitPrice });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id); flash('🗑️ Product deleted.'); load();
  };

  const filtered = products.filter(p =>
    p.ProductName.toLowerCase().includes(search.toLowerCase()) ||
    p.Category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPrice = form.Quantity && form.UnitPrice
    ? (parseFloat(form.Quantity) * parseFloat(form.UnitPrice)).toLocaleString() : '—';

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-5">Product Management</h2>
      {msg && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">{msg}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.ProductName} onChange={e => setForm({ ...form, ProductName: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.Category} onChange={e => setForm({ ...form, Category: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.Quantity} onChange={e => setForm({ ...form, Quantity: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (RWF) *</label>
            <input type="number" min="0" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.UnitPrice} onChange={e => setForm({ ...form, UnitPrice: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Price (auto)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" value={`RWF ${totalPrice}`} readOnly />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
              {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
            </button>
            {editId && <button type="button" onClick={() => { setForm(empty); setEditId(null); }} className="px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-gray-700">All Products ({filtered.length})</h3>
          <input className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-800">
              <tr>
                {['#','Product Name','Category','Quantity','Unit Price','Total Price','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.ProductID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3 font-medium">{p.ProductName}</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{p.Category}</span></td>
                  <td className="px-4 py-3">{p.Quantity}</td>
                  <td className="px-4 py-3">{parseFloat(p.UnitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-green-700">{parseFloat(p.TotalPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">Edit</button>
                    <button onClick={() => handleDelete(p.ProductID)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
