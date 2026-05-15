import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  HiOutlineSearch, 
  HiOutlineLocationMarker, 
  HiOutlineChatAlt, 
  HiOutlineSparkles,
  HiOutlineViewGrid
} from 'react-icons/hi';

const ServiceSearch = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    latitude: "27.7172",
    longitude: "85.3240",
    problemDescription: "",
  });

  const [error, setError] = useState("");

  const categories = [
    { id: "electrician", name: "Electrician" },
    { id: "plumber", name: "Plumber" },
    { id: "cleaner", name: "Cleaner" },
    { id: "carpenter", name: "Carpenter" },
    { id: "appliance repair", name: "Appliance Repair" },
    { id: "painter", name: "Painter" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.latitude || !formData.longitude) {
      setError("Category and location are required");
      return;
    }

    const params = new URLSearchParams({
      category: formData.category,
      latitude: formData.latitude,
      longitude: formData.longitude,
      problemDescription: formData.problemDescription,
    });

    navigate(`/recommendations?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
          <HiOutlineSparkles size={14} />
          AI-Powered Search
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
          Find Your <span className="text-emerald-500">Expert.</span>
        </h1>
        <p className="text-lg font-bold text-slate-400 dark:text-slate-500 max-w-xl mx-auto">
          Tell us what's wrong, and our smart engine will find the best service provider for your location.
        </p>
      </div>

      <Card className="!rounded-[3rem] shadow-2xl shadow-emerald-500/5">
        <CardBody className="p-8 md:p-12">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Category Picker */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <HiOutlineViewGrid size={16} className="text-emerald-500" />
                  Service Type
                </label>
                <div className="relative group">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">Choose category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <HiOutlineSparkles size={20} />
                  </div>
                </div>
              </div>

              {/* Location Lat/Lng */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <HiOutlineLocationMarker size={16} className="text-emerald-500" />
                  Service Location
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Lat"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                  />
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Lng"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <HiOutlineChatAlt size={16} className="text-emerald-500" />
                Describe the Issue (Optional)
              </label>
              <textarea
                name="problemDescription"
                placeholder="Example: My kitchen tap has been leaking since yesterday..."
                value={formData.problemDescription}
                onChange={handleChange}
                rows="4"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-8 py-6 rounded-[2rem] focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full py-6 rounded-[2rem] text-xl group"
            >
              <HiOutlineSearch size={24} className="mr-3 group-hover:scale-125 transition-transform" />
              Discover Recommendations
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ServiceSearch;