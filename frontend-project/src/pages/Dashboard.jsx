import React, { useEffect, useState } from 'react';
import { getProducts, getSales, getStockStatus } from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, sales: 0, stock: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([getProducts(), getSales(), getStockStatus()]).then(([p, s, ss]) => {
      const revenue = s.data.reduce((sum, sale) => sum + parseFloat(sale.SoldTotalPrice), 0);
      setStats({ products: p.data.length, sales: s.data.length, stock: ss.data.length, revenue });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: '📦', color: 'bg-blue-600', link: '/products' },
    { label: 'Total Sales', value: stats.sales, icon: '🛒', color: 'bg-green-600', link: '/sales' },
    { label: 'Stock Records', value: stats.stock, icon: '🗃️', color: 'bg-amber-500', link: '/stockstatus' },
    { label: 'Total Revenue (RWF)', value: `${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-purple-600', link: '/reports/sales' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(card => (
          <Link to={card.link} key={card.label} className={`${card.color} text-white rounded-xl p-5 shadow-md hover:scale-105 transition-transform`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm opacity-80 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">+ Add Product</Link>
          <Link to="/sales" className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors">+ Record Sale</Link>
          <Link to="/reports/sales" className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm hover:bg-amber-100 transition-colors">📊 Sales Report</Link>
          <Link to="/reports/stock" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors">📋 Stock Report</Link>
        </div>
      </div>
    </div>
  );
}
