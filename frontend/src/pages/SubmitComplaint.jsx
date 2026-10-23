import React, { useState } from 'react';
import {
  Send,
  Zap,
  Wifi,
  Sparkles,
  Droplets,
  Armchair,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const CATEGORIES = [
  { id: 'Electricity', icon: Zap, color: 'text-amber-400', desc: 'Power cuts, lights, wiring' },
  { id: 'Wi-Fi', icon: Wifi, color: 'text-cyan-400', desc: 'Routers, deadzones, network' },
  { id: 'Cleanliness', icon: Sparkles, color: 'text-emerald-400', desc: 'Washrooms, dustbins, litter' },
  { id: 'Water', icon: Droplets, color: 'text-sky-400', desc: 'Leakages, coolers, taps' },
  { id: 'Furniture', icon: Armchair, color: 'text-indigo-400', desc: 'Desks, chairs, whiteboards' },
  { id: 'Other', icon: HelpCircle, color: 'text-purple-400', desc: 'General facility concerns' },
];

const SAMPLE_CAMPUS_IMAGES = [
  {
    name: 'Lab & Networking',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electrical Fixture',
    url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Water / Plumbing',
    url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Classroom Furniture',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  },
];

const QUICK_LOCATIONS = [
  'Central Library, 2nd Floor',
  'Academic Block A, Lab 301',
  'Hostel Block 3, Room 114',
  'Engineering Block B, Seminar Hall',
  'Main Cafeteria Lawn',
];

export const SubmitComplaint = ({ onSuccessRedirect }) => {
  const { showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electricity');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle local file image upload
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category || !location.trim() || !description.trim()) {
      setError('Please fill in all mandatory fields: Title, Category, Location, and Description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createComplaint({
        title,
        category,
        priority,
        location,
        description,
        image,
      });

      if (res.success) {
        showToast(`Complaint ${res.complaint.complaintId} created successfully!`, 'success');
        if (onSuccessRedirect) {
          onSuccessRedirect();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          File a Campus Infrastructure Complaint
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide accurate details and photos to help dispatch technicians directly to the location.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Category */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Select Category <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-glow-blue'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${cat.color}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white">{cat.id}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Complaint Details & Priority */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Complaint Details <span className="text-rose-400">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Complaint Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
                placeholder="e.g. Projector in CS Seminar Hall 2 display flickering"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Perceived Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low (General cosmetic)</option>
                <option value="Medium">Medium (Routine maintenance)</option>
                <option value="High">High (Impacting class / work)</option>
                <option value="Critical">Critical (Safety hazard / flood)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Exact Location / Building / Room Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Science Complex Block 4, 3rd Floor, Lab 304"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Quick Location Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Quick fill:</span>
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] border border-slate-700 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Detailed Description <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {description.length}/2000 characters
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={2000}
              placeholder="Describe what is broken, when it started, and any symptoms or hazard concerns..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Step 3: Image Upload & Evidence */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            3. Photographic Evidence (Optional)
          </label>

          {image ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-h-72 bg-black/60 flex items-center justify-center">
              <img src={image} alt="Preview" className="max-h-72 object-contain" />
              <button
                type="button"
                onClick={() => {
                  setImage('');
                  const fileInput = document.getElementById('file-upload');
                  if (fileInput) fileInput.value = '';
                }}
                className="absolute top-3 right-3 p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white shadow-lg backdrop-blur-sm transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-6 text-center transition-colors">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">
                  Drag and drop a photo here, or browse from device
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  Browse Device Photo
                </label>
              </div>

              {/* Sample Photo Selector for Quick Hackathon Demo */}
              <div>
                <p className="text-[11px] text-slate-400 mb-2">Or select a demo campus photo:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_CAMPUS_IMAGES.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImage(sample.url)}
                      className="p-1.5 rounded-xl border border-slate-800 hover:border-blue-500 bg-slate-900/60 text-left transition-all group overflow-hidden"
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-16 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[10px] text-slate-300 font-medium block truncate">
                        {sample.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-blue transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Registering Ticket...' : 'Submit Campus Complaint'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
