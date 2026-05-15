import { useEffect, useState } from "react";
import {
  createProviderProfile,
  updateProviderProfile,
  toggleProviderAvailability,
  getProviderMe,
} from "../api/providerApi";
import {
  getProviderBookings,
  updateBookingStatus,
} from "../api/bookingApi";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, THead, TBody, TR, TH, TD, Badge } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { 
  HiOutlineClipboardList, 
  HiOutlineCurrencyRupee, 
  HiOutlineStar, 
  HiOutlineStatusOnline,
  HiOutlinePlus,
  HiOutlineTrendingUp
} from 'react-icons/hi';

const ProviderDashboard = () => {
  const [profileForm, setProfileForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    address: "",
    latitude: "27.7172",
    longitude: "85.3240",
  });

  const [bookings, setBookings] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchProviderData = async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        getProviderBookings(),
        getProviderMe()
      ]);
      setBookings(bookingsRes.data.bookings || []);
      setProviderProfile(profileRes.data.provider);
      
      // Auto-fill form if profile exists
      if (profileRes.data.provider) {
        const p = profileRes.data.provider;
        setProfileForm({
          name: p.name || "",
          category: p.services?.[0]?.category || "",
          description: p.services?.[0]?.description || "",
          price: p.services?.[0]?.price || "",
          address: p.location?.address || "",
          latitude: p.location?.latitude || "27.7172",
          longitude: p.location?.longitude || "85.3240",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const buildProfilePayload = () => ({
    name: profileForm.name,
    services: [
      {
        category: profileForm.category,
        description: profileForm.description,
        price: Number(profileForm.price),
      },
    ],
    location: {
      address: profileForm.address,
      latitude: Number(profileForm.latitude),
      longitude: Number(profileForm.longitude),
    },
  });

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createProviderProfile(buildProfilePayload());
      setMessage("Profile created successfully! 🚀");
      setIsProfileModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    }
  };

  const handleUpdateProfile = async () => {
    setMessage("");
    setError("");

    try {
      await updateProviderProfile(buildProfilePayload());
      setMessage("Profile updated! ✨");
      setIsProfileModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleToggleAvailability = async () => {
    setMessage("");
    setError("");

    try {
      const res = await toggleProviderAvailability();
      setMessage(`Status updated: ${res.data.isAvailable ? 'Online & Ready' : 'Offline Mode'}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability");
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      fetchProviderData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const stats = [
    { label: 'Total Jobs', value: bookings.length, icon: HiOutlineClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Earnings', value: `Rs. ${bookings.reduce((acc, b) => b.status === 'completed' ? acc + b.totalPrice : acc, 0)}`, icon: HiOutlineCurrencyRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Rating', value: providerProfile?.rating || '0.0', icon: HiOutlineStar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Growth', value: '+12%', icon: HiOutlineTrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'confirmed': return 'blue';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">Overview</h1>
          <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mt-2">Manage your professional service performance.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleToggleAvailability} className="backdrop-blur-md">
            {message.includes('Online') ? 'Go Offline' : 'Go Online'}
          </Button>
          <Button onClick={() => setIsProfileModalOpen(true)} className="group">
            <HiOutlinePlus className="mr-2 group-hover:rotate-90 transition-transform" size={20} />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:-translate-y-2 transition-all duration-300">
            <CardBody className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {message && (
        <div className="bg-emerald-500 text-white px-8 py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-500 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <HiOutlineStatusOnline size={24} />
          </div>
          {message}
        </div>
      )}

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Recent Orders</h2>
          <button className="text-sm font-black text-emerald-500 uppercase tracking-widest hover:underline underline-offset-8">View Archive</button>
        </div>

        <Card className="!rounded-[2.5rem]">
          <CardBody className="p-2">
            <Table>
              <THead>
                <TR className="!bg-transparent shadow-none border-none">
                  <TH>Service</TH>
                  <TH>Customer</TH>
                  <TH>Price</TH>
                  <TH>Status</TH>
                  <TH className="text-right pr-12">Action</TH>
                </TR>
              </THead>
              <TBody>
                {bookings.length === 0 ? (
                  <TR>
                    <TD colSpan="5" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic">
                      No active bookings found.
                    </TD>
                  </TR>
                ) : (
                  bookings.map((booking) => (
                    <TR key={booking._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{booking.serviceCategory}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-0.5">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </TD>
                      <TD>
                        <p className="font-bold text-slate-600 dark:text-slate-300">{booking.user?.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{booking.user?.email}</p>
                      </TD>
                      <TD className="text-lg font-black text-slate-800 dark:text-slate-100">Rs. {booking.totalPrice}</TD>
                      <TD>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <div className="flex justify-end gap-3">
                          {booking.status === 'pending' && (
                            <Button size="sm" onClick={() => handleStatusUpdate(booking._id, 'confirmed')}>Accept</Button>
                          )}
                          {['confirmed', 'pending'].includes(booking.status) && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(booking._id, 'completed')}>Finish</Button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleStatusUpdate(booking._id, 'cancelled')}>Reject</Button>
                          )}
                        </div>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Profile Modal */}
      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title="Setup Your Profile"
      >
        <form onSubmit={handleCreateProfile} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
              <input
                name="name"
                placeholder="e.g. Master Electricians"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Specialization</label>
              <input
                name="category"
                placeholder="e.g. Electrician"
                value={profileForm.category}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">About Services</label>
              <textarea
                name="description"
                placeholder="Describe your expertise..."
                value={profileForm.description}
                onChange={handleProfileChange}
                rows="3"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Hourly Rate</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Rs."
                  value={profileForm.price}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Work Zone</label>
                <input
                  name="address"
                  placeholder="City, Area"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1 shadow-emerald-500/20">Init Profile</Button>
            <Button type="button" variant="secondary" onClick={handleUpdateProfile} className="flex-1">Sync Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderDashboard;