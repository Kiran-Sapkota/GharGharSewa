import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProvidersAdmin,
  getAllBookingsAdmin,
  verifyProvider,
  unverifyProvider,
  deactivateAccount,
  reactivateAccount,
} from "../api/adminApi";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, THead, TBody, TR, TH, TD, Badge } from "../components/ui/Table";
import { 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineClipboardCheck, 
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineSearch
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, providersRes, bookingsRes] = await Promise.all([
        getAllUsers(),
        getAllProvidersAdmin(),
        getAllBookingsAdmin(),
      ]);
      setUsers(usersRes.data.users || []);
      setProviders(providersRes.data.providers || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (providerId) => {
    try {
      await verifyProvider(providerId);
      setMessage("Provider verified! ✅");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify provider");
    }
  };

  const handleUnverify = async (providerId) => {
    try {
      await unverifyProvider(providerId);
      setMessage("Provider unverified! ⚠️");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unverify provider");
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await deactivateAccount(userId);
      setMessage("Account deactivated! 🛑");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate account");
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await reactivateAccount(userId);
      setMessage("Account reactivated! 🚀");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reactivate account");
    }
  };

  const stats = [
    { label: 'Platform Users', value: users.length, icon: HiOutlineUsers, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Service Pros', value: providers.length, icon: HiOutlineUserGroup, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'System Bookings', value: bookings.length, icon: HiOutlineClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Control <span className="text-emerald-500">Center.</span></h1>
          <p className="text-lg font-bold text-slate-400 dark:text-slate-500">Monitor and manage the entire GharGhar Sewa ecosystem.</p>
        </div>
        <Button variant="secondary" onClick={fetchAdminData} className="group">
          <HiOutlineRefresh className="mr-2 group-hover:rotate-180 transition-transform duration-700" size={20} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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

      {(message || error) && (
        <div className={`px-8 py-5 rounded-[2rem] font-black shadow-xl animate-in slide-in-from-top-4 duration-500 ${
          message ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
        }`}>
          {message || error}
        </div>
      )}

      {/* Management Area */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit">
            {['users', 'providers', 'bookings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-emerald-500 dark:text-emerald-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative group flex-1 max-w-xs">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search records..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent pl-11 pr-4 py-3 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>
        
        <Card className="!rounded-[2.5rem]">
          <CardBody className="p-2">
            {activeTab === "users" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>User Identity</TH>
                    <TH>System Role</TH>
                    <TH>Trust Score</TH>
                    <TH>Account State</TH>
                    <TH className="text-right pr-12">Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {users.map((user) => (
                    <TR key={user._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{user.email}</p>
                      </TD>
                      <TD>
                        <Badge variant={user.role === 'admin' ? 'blue' : 'gray'}>{user.role}</Badge>
                      </TD>
                      <TD className="font-black text-slate-600 dark:text-slate-300">{user.rating || 0} / 5</TD>
                      <TD>
                        <Badge variant={user.isActive ? 'green' : 'red'}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant={user.isActive ? 'ghost' : 'primary'}
                          className={user.isActive ? 'text-red-500 hover:bg-red-50' : ''}
                          onClick={() => user.isActive ? handleDeactivate(user._id) : handleReactivate(user._id)}
                        >
                          {user.isActive ? 'Suspend' : 'Unsuspend'}
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {activeTab === "providers" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>Service Pro</TH>
                    <TH>Service Line</TH>
                    <TH>Verification</TH>
                    <TH>Availability</TH>
                    <TH className="text-right pr-12">Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {providers.map((provider) => (
                    <TR key={provider._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{provider.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{provider.user?.email || "N/A"}</p>
                      </TD>
                      <TD>
                        <p className="font-black text-slate-600 dark:text-slate-300 capitalize">{provider.services?.[0]?.category || "N/A"}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rs. {provider.services?.[0]?.price || 0}</p>
                      </TD>
                      <TD>
                        <Badge variant={provider.isVerified ? 'green' : 'yellow'}>
                          {provider.isVerified ? 'Verified' : 'Pending Review'}
                        </Badge>
                      </TD>
                      <TD>
                        <Badge variant={provider.isAvailable ? 'blue' : 'gray'}>
                          {provider.isAvailable ? 'Online' : 'Offline'}
                        </Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant={provider.isVerified ? 'secondary' : 'primary'}
                          onClick={() => provider.isVerified ? handleUnverify(provider._id) : handleVerify(provider._id)}
                        >
                          {provider.isVerified ? 'Revoke' : 'Approve'}
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {activeTab === "bookings" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>Customer & Pro</TH>
                    <TH>Service Line</TH>
                    <TH>Transaction</TH>
                    <TH>Current State</TH>
                  </TR>
                </THead>
                <TBody>
                  {bookings.map((booking) => (
                    <TR key={booking._id}>
                      <TD>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{booking.user?.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{booking.provider?.name || "N/A"}</span>
                          </div>
                        </div>
                      </TD>
                      <TD className="font-black text-slate-600 dark:text-slate-300 capitalize">{booking.serviceCategory}</TD>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">Rs. {booking.totalPrice}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </TD>
                      <TD>
                        <Badge variant={
                          booking.status === 'completed' ? 'green' : 
                          booking.status === 'confirmed' ? 'blue' : 
                          booking.status === 'pending' ? 'yellow' : 'red'
                        }>{booking.status}</Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;