import React, { useEffect, useState } from 'react';
import { getDailySalesReport } from '../api/api';

const today = () => new Date().toISOString().split('T')[0];

export default function SalesReport() {
  const [date, setDate] = useState(today());
  const [data, setData] = useState({ sales: [], grandTotal: 0 });
  const [loading, setLoading] = useState(false);

  const load = (d) => {
    setLoading(true);
    getDailySalesReport(d).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(date); }, [date]);

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-900">📊 Daily Sales Report</h2>
        <div className="flex gap-3 items-center">
          <input type="date" className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={date} onChange={e => setDate(e.target.value)} max={today()} />
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">🖨️ Print</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b bg-blue-50">
          <h3 className="font-bold text-blue-900 text-lg">DAB Enterprise Ltd — Sales Report</h3>
          <p className="text-sm text-gray-500">Date: <strong>{date}</strong> &nbsp;|&nbsp; Total transactions: <strong>{data.sales.length}</strong></p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    {['#','Product Name','Category','Qty Sold','Unit Price (RWF)','Total Price (RWF)','Date'].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.sales.map((s, i) => (
                    <tr key={s.SaleID} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                      <td className="px-4 py-3 text-gray-500">{i+1}</td>
                      <td className="px-4 py-3 font-medium">{s.ProductName}</td>
                      <td className="px-4 py-3">{s.Category}</td>
                      <td className="px-4 py-3">{s.SoldQuantity}</td>
                      <td className="px-4 py-3">{parseFloat(s.SoldUnitPrice).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">{parseFloat(s.SoldTotalPrice).toLocaleString()}</td>
                      <td className="px-4 py-3">{s.SalesDate?.split('T')[0]}</td>
                    </tr>
                  ))}
                  {data.sales.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No sales recorded for {date}.</td></tr>
                  )}
                </tbody>
                {data.sales.length > 0 && (
                  <tfoot>
                    <tr className="bg-blue-700 text-white font-bold">
                      <td colSpan={5} className="px-4 py-3 text-right">Grand Total</td>
                      <td className="px-4 py-3">RWF {parseFloat(data.grandTotal).toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
