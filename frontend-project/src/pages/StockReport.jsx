import React, { useEffect, useState } from 'react';
import { getStockStatus } from '../api/api';

export default function StockReport() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getStockStatus().then(r => setStocks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = stocks.filter(s =>
    s.ProductName?.toLowerCase().includes(search.toLowerCase()) ||
    s.Category?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-900">📋 Stock Status Report</h2>
        <div className="flex gap-3 items-center">
          <input className="border rounded-lg px-3 py-2 text-sm w-48 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={handlePrint} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">🖨️ Print</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b bg-amber-50">
          <h3 className="font-bold text-amber-900 text-lg">DAB Enterprise Ltd — Stock Status Report</h3>
          <p className="text-sm text-gray-500">Generated: <strong>{new Date().toLocaleDateString()}</strong> &nbsp;|&nbsp; Total products: <strong>{filtered.length}</strong></p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-amber-600 text-white">
                <tr>
                  {['#','Product Name','Category','Stored Qty','Sold Qty','Remaining Qty','Status'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const pct = s.AvailableQuantity > 0 ? (s.RemainingQuantity / s.AvailableQuantity) * 100 : 0;
                  const status = pct <= 0 ? { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
                    : pct <= 20 ? { label: 'Critical', cls: 'bg-red-100 text-red-700' }
                    : pct <= 50 ? { label: 'Low', cls: 'bg-amber-100 text-amber-700' }
                    : { label: 'In Stock', cls: 'bg-green-100 text-green-700' };
                  return (
                    <tr key={s.StockID} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}`}>
                      <td className="px-4 py-3 text-gray-500">{i+1}</td>
                      <td className="px-4 py-3 font-medium">{s.ProductName}</td>
                      <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{s.Category}</span></td>
                      <td className="px-4 py-3">{s.AvailableQuantity}</td>
                      <td className="px-4 py-3 text-red-600">{s.SoldQuantity}</td>
                      <td className="px-4 py-3 font-bold text-green-700">{s.RemainingQuantity}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span></td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No stock records found.</td></tr>}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-amber-600 text-white font-bold">
                    <td colSpan={3} className="px-4 py-3 text-right">Totals</td>
                    <td className="px-4 py-3">{filtered.reduce((s, r) => s + r.AvailableQuantity, 0)}</td>
                    <td className="px-4 py-3">{filtered.reduce((s, r) => s + r.SoldQuantity, 0)}</td>
                    <td className="px-4 py-3">{filtered.reduce((s, r) => s + r.RemainingQuantity, 0)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
