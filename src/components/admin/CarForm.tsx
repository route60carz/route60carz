'use client'

import React, { useState } from 'react';
import type { Car } from '@/components/inventory/CarCard';
import { X, Loader2, ImagePlus } from 'lucide-react';

interface CarFormProps {
    car: Car | null;
    onClose: () => void;
    onSave: () => void;
}

const MAKES = [
    'Ashok Leyland', 'Audi', 'BMW', 'Chevrolet', 'Citroen',
    'DatSun', 'Eicher Motors', 'Fiat', 'Force', 'Ford',
    'Hindustan Motors', 'Honda', 'Hyundai', 'Isuzu',
    'Jaguar', 'Jeep', 'Kia', 'Land Rover',
    'Mahindra', 'Mahindra Renault', 'Maruti Suzuki', 'Mercedes Benz',
    'MG', 'MINI', 'Mitsubishi', 'Nissan',
    'Others', 'Piaggio', 'Porsche', 'Premier',
    'Renault', 'Rolls-Royce', 'Skoda', 'SsangYong',
    'Tata', 'Toyota', 'Volkswagen', 'Volvo',
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG'];
const CITIES = ['Theni', 'Madurai', 'Chennai', 'Coimbatore', 'Dindigul', 'Salem'];
const STATUSES = ['available', 'pending', 'sold'];

export default function CarForm({ car, onClose, onSave }: CarFormProps) {
    const isEditing = !!car;

    const [form, setForm] = useState({
        make: car?.make || '',
        model: car?.model || '',
        year: car?.year?.toString() || new Date().getFullYear().toString(),
        price: car?.price?.toString() || '',
        city: car?.city || 'Theni',
        fuel_type: car?.fuel_type || 'Petrol',
        image_url: car?.image_url || '',
        status: car?.status || 'available',
    });

    const existingGallery = (car as any)?.gallery_images || [];
    const [galleryImages, setGalleryImages] = useState<string[]>([
        existingGallery[0] || '',
        existingGallery[1] || '',
        existingGallery[2] || '',
        existingGallery[3] || '',
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleGalleryChange = (index: number, value: string) => {
        setGalleryImages(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const filteredGallery = galleryImages.filter(url => url.trim() !== '');

        const payload = {
            make: form.make,
            model: form.model,
            year: parseInt(form.year),
            price: parseFloat(form.price),
            city: form.city,
            fuel_type: form.fuel_type,
            image_url: form.image_url || null,
            gallery_images: filteredGallery.length > 0 ? filteredGallery : null,
            status: form.status,
        };

        try {
            let res: Response;
            if (isEditing) {
                res = await fetch(`/api/cars/${car.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch('/api/cars', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save car');
                setLoading(false);
                return;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
            return;
        }

        setLoading(false);
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Car' : 'Add New Car'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="admin-form-label">Make</label>
                            <select
                                name="make"
                                value={form.make}
                                onChange={handleChange}
                                required
                                className="admin-form-input"
                            >
                                <option value="">Select Make</option>
                                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="admin-form-label">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="e.g. City"
                                required
                                className="admin-form-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="admin-form-label">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                min="1980"
                                max="2026"
                                required
                                className="admin-form-input"
                            />
                        </div>

                        <div>
                            <label className="admin-form-label">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="e.g. 950000"
                                required
                                min="0"
                                className="admin-form-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="admin-form-label">City</label>
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="admin-form-input"
                            >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="admin-form-label">Fuel Type</label>
                            <select
                                name="fuel_type"
                                value={form.fuel_type}
                                onChange={handleChange}
                                className="admin-form-input"
                            >
                                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="admin-form-label">Main Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="admin-form-input"
                        />
                    </div>

                    {/* Gallery Images */}
                    <div className="border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <ImagePlus size={16} className="text-primary" />
                            <label className="text-xs text-white font-bold uppercase tracking-widest">Gallery Images (4 sub-images)</label>
                        </div>
                        {galleryImages.map((url, idx) => (
                            <div key={idx}>
                                <label className="admin-form-label text-xs">Image {idx + 1} {idx === 0 ? '(Side view)' : idx === 1 ? '(Rear view)' : idx === 2 ? '(Interior)' : '(Engine/Detail)'}</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleGalleryChange(idx, e.target.value)}
                                    placeholder={`https://... (${['Side', 'Rear', 'Interior', 'Engine'][idx]} photo)`}
                                    className="admin-form-input"
                                />
                            </div>
                        ))}
                        {/* Gallery Preview */}
                        {galleryImages.some(u => u.trim()) && (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {galleryImages.map((url, idx) => (
                                    <div key={idx} className="aspect-[3/2] rounded-lg overflow-hidden bg-zinc-800">
                                        {url.trim() ? (
                                            <img
                                                src={url}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Empty</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="admin-form-label">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="admin-form-input"
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Main Image Preview */}
                    {form.image_url && (
                        <div>
                            <label className="admin-form-label">Main Image Preview</label>
                            <div className="w-full h-40 rounded-xl overflow-hidden bg-zinc-800">
                                <img
                                    src={form.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-5 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {isEditing ? 'Update Car' : 'Add Car'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl bg-white/5 text-white font-medium text-sm border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
