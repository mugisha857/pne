import React, { useEffect, useState } from 'react';
import { getStockStatus, updateStock, deleteStock, getProducts, createStock } from '../api/api';

const empty = { ProductID: '', AvailableQuantity: '', SoldQuantity: '' };

export default function StockStatus() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    getStockStatus().then(r => setStocks(r.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateStock(editId, form); flash('✅ Stock updated!'); }
      else { await createStock(form); flash('✅ Stock record created!'); }
      setForm(empty); setEditId(null); load();
    } catch (err) { flash('❌ ' + (err.response?.data?.message || 'Error')); }
  };

  const handleEdit = (s) => {
    setEditId(s.StockID);
    setForm({ ProductID: s.ProductID, AvailableQuantity: s.AvailableQuantity, SoldQuantity: s.SoldQuantity });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock record?')) return;
    await deleteStock(id); flash('🗑️ Record deleted.'); load();
  };

  const remaining = form.AvailableQuantity && form.SoldQuantity
    ? parseInt(form.AvailableQuantity) - parseInt(form.SoldQuantity) : '—';

  const filtered = stocks.filter(s =>
    s.ProductName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-5">Stock Status Management</h2>
      {msg && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">{msg}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Stock Record' : 'Add Stock Record'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Product *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.ProductID} onChange={e => setForm({ ...form, ProductID: e.target.value })} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Available Quantity *</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.AvailableQuantity} onChange={e => setForm({ ...form, AvailableQuantity: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sold Quantity *</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={form.SoldQuantity} onChange={e => setForm({ ...form, SoldQuantity: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Remaining (auto)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" value={remaining} readOnly />
          </div>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <button type="submit" className="px-6 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              {editId ? 'Update Stock' : 'Add Stock'}
            </button>
            {editId && <button type="button" onClick={() => { setForm(empty); setEditId(null); }} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-gray-700">Stock Records ({filtered.length})</h3>
          <input className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-amber-50 text-amber-800">
              <tr>
                {['#','Product','Category','Available Qty','Sold Qty','Remaining Qty','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.StockID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3 font-medium">{s.ProductName}</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{s.Category}</span></td>
                  <td className="px-4 py-3">{s.AvailableQuantity}</td>
                  <td className="px-4 py-3">{s.SoldQuantity}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.RemainingQuantity < 5 ? 'text-red-600' : 'text-green-700'}`}>
                      {s.RemainingQuantity}
                      {s.RemainingQuantity < 5 && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">Low</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">Edit</button>
                    <button onClick={() => handleDelete(s.StockID)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No stock records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
