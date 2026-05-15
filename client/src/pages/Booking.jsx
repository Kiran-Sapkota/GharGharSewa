import { useLocation, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { createBooking } from "../api/bookingApi";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Table";
import { 
  HiOutlineUser, 
  HiOutlineLocationMarker, 
  HiOutlineStar, 
  HiOutlineCurrencyRupee, 
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const Booking = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const provider = location.state?.provider;
  const matchedService = location.state?.matchedService;

  const [formData, setFormData] = useState({
    serviceCategory: matchedService?.category || "",
    serviceDescription: "",
    bookingDate: "",
    address: "",
    totalPrice: matchedService?.price || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!providerId) {
      setError("Provider selection lost. Please go back and select a provider.");
      return;
    }

    if (!formData.serviceCategory || !formData.bookingDate || !formData.address || !formData.totalPrice) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    const payload = {
      provider: providerId,
      serviceCategory: formData.serviceCategory,
      serviceDescription: formData.serviceDescription,
      bookingDate: formData.bookingDate,
      address: formData.address,
      totalPrice: Number(formData.totalPrice),
    };

    try {
      setLoading(true);
      await createBooking(payload);
      alert("Booking confirmed! We've notified the provider. 🚀");
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
          <HiOutlineShieldCheck size={14} />
          Secure Booking
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
          Finalize Your <span className="text-emerald-500">Request.</span>
        </h1>
        <p className="text-lg font-bold text-slate-400 dark:text-slate-500">
          You're one step away from getting your home service sorted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="!rounded-[2.5rem] shadow-2xl shadow-emerald-500/5">
            <CardBody className="p-8 md:p-12">
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 font-bold text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Service Type *</label>
                    <input
                      type="text"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Schedule Date *</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Service Address *</label>
                  <div className="relative group">
                    <HiOutlineLocationMarker className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, City"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent pl-14 pr-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Task Details</label>
                  <textarea
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleChange}
                    placeholder="Provide some details about the work..."
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-8 py-6 rounded-[2rem] focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white leading-relaxed"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full py-5 rounded-[2rem] text-xl"
                  >
                    {loading ? "Processing..." : "Confirm & Book Now"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="!rounded-[2.5rem] bg-emerald-500 text-white border-none shadow-xl shadow-emerald-500/20">
            <CardBody className="p-8 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest opacity-80">Provider Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <HiOutlineUser size={24} />
                  </div>
                  <div>
                    <p className="font-black text-xl leading-tight">{provider?.name || "Expert Provider"}</p>
                    <p className="text-sm font-bold opacity-70">{provider?.location?.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                  <HiOutlineStar size={20} className="text-amber-300" />
                  <span className="font-black">{provider?.rating || 0} / 5 Rating</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="!rounded-[2.5rem] border-slate-100 dark:border-slate-800">
            <CardBody className="p-8 space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500">Base Service</span>
                  <span className="font-black text-slate-800 dark:text-white uppercase text-sm">{formData.serviceCategory || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                  <span className="font-bold text-slate-500 text-lg">Total</span>
                  <div className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                    <HiOutlineCurrencyRupee size={24} />
                    {formData.totalPrice || "0"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;