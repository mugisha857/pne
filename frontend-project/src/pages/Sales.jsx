import React, { useEffect, useState } from 'react';
import { getSales, createSale, updateSale, deleteSale, getProducts } from '../api/api';

const today = () => new Date().toISOString().split('T')[0];
const empty = { ProductID: '', SoldQuantity: '', SoldUnitPrice: '', SalesDate: today() };

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    getSales().then(r => setSales(r.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateSale(editId, form); flash('✅ Sale updated!'); }
      else { await createSale(form); flash('✅ Sale recorded!'); }
      setForm(empty); setEditId(null); load();
    } catch (err) { flash('❌ ' + (err.response?.data?.message || 'Error')); }
  };

  const handleEdit = (s) => {
    setEditId(s.SaleID);
    setForm({ ProductID: s.ProductID, SoldQuantity: s.SoldQuantity, SoldUnitPrice: s.SoldUnitPrice, SalesDate: s.SalesDate?.split('T')[0] || today() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale?')) return;
    await deleteSale(id); flash('🗑️ Sale deleted.'); load();
  };

  const soldTotal = form.SoldQuantity && form.SoldUnitPrice
    ? (parseFloat(form.SoldQuantity) * parseFloat(form.SoldUnitPrice)).toLocaleString() : '—';

  const filtered = sales.filter(s =>
    s.ProductName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-5">Sales Management</h2>
      {msg && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">{msg}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Sale' : 'Record New Sale'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Product *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.ProductID} onChange={e => setForm({ ...form, ProductID: e.target.value })} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.ProductName} ({p.Category})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sold Quantity *</label>
            <input type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.SoldQuantity} onChange={e => setForm({ ...form, SoldQuantity: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sold Unit Price (RWF) *</label>
            <input type="number" min="0" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.SoldUnitPrice} onChange={e => setForm({ ...form, SoldUnitPrice: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sales Date *</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.SalesDate} onChange={e => setForm({ ...form, SalesDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sold Total Price (auto)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" value={`RWF ${soldTotal}`} readOnly />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              {editId ? 'Update Sale' : 'Record Sale'}
            </button>
            {editId && <button type="button" onClick={() => { setForm(empty); setEditId(null); }} className="px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-gray-700">All Sales ({filtered.length})</h3>
          <input className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Search by product..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-50 text-green-800">
              <tr>
                {['#','Product','Qty Sold','Unit Price','Total Price','Date','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.SaleID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3 font-medium">{s.ProductName}</td>
                  <td className="px-4 py-3">{s.SoldQuantity}</td>
                  <td className="px-4 py-3">{parseFloat(s.SoldUnitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-green-700">{parseFloat(s.SoldTotalPrice).toLocaleString()}</td>
                  <td className="px-4 py-3">{s.SalesDate?.split('T')[0]}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">Edit</button>
                    <button onClick={() => handleDelete(s.SaleID)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No sales found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
