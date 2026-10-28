'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Tractor, PlusCircle, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', latitude: '', longitude: '' });
  const [loading, setLoading] = useState(false);

  const fetchFarms = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/farms');
      const data = await res.json();
      setFarms(data);
    } catch (err) {
      console.error("Error fetching farms:", err);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ name: '', description: '', latitude: '', longitude: '' });
        fetchFarms();
      }
    } catch (err) {
      console.error("Error adding farm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f4f7f4', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Tractor size={36} /> FarmDirect Connect
        </h1>
        <p style={{ color: '#555' }}>Bridging local farmers directly with your community—fair pricing, zero middlemen.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h2 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#2e7d32" /> Register Local Farm
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Farm Name" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <textarea 
              placeholder="What fresh produce do you grow?" 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <input 
              type="number" 
              step="any" 
              placeholder="Latitude (e.g. 13.0827)" 
              value={form.latitude} 
              onChange={e => setForm({...form, latitude: e.target.value})} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <input 
              type="number" 
              step="any" 
              placeholder="Longitude (e.g. 80.2707)" 
              value={form.longitude} 
              onChange={e => setForm({...form, longitude: e.target.value})} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ background: '#2e7d32', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Adding Farm...' : 'Publish Farm'}
            </button>
          </form>
        </div>

        <div>
          <h2 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#2e7d32" /> Available Local Farms Near You
          </h2>
          {farms.length === 0 ? (
            <p style={{ color: '#777' }}>No farms registered yet. Be the first to add one!</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {farms.map((farm) => (
                <div key={farm.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #2e7d32' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>{farm.name}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#555' }}>{farm.description || 'Fresh organic harvest direct from the soil.'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#777' }}>
                    <MapPin size={14} /> Lat: {farm.latitude}, Lng: {farm.longitude}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}