import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getMyBookings,
  cancelBooking,
} from "../api/bookingApi";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Table";
import { 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineCurrencyRupee,
  HiOutlineEmojiSad,
  HiOutlineSearch
} from 'react-icons/hi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );
      alert("Booking cancelled successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 font-medium">Track your service history and current requests.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
            <HiOutlineEmojiSad size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No bookings yet</h3>
          <p className="text-slate-500 mt-2 mb-6">You haven't booked any services yet. Start exploring now!</p>
          <Link to="/search">
            <Button className="flex items-center gap-2">
              <HiOutlineSearch size={20} /> Explore Services
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:border-green-100 transition-colors">
              <CardBody className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        #{booking._id.substring(booking._id.length - 8)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-slate-800">{booking.serviceCategory}</h2>
                      <p className="text-slate-500 mt-1 font-medium">{booking.serviceDescription}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="text-green-600" size={18} />
                        {new Date(booking.bookingDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HiOutlineLocationMarker className="text-green-600" size={18} />
                        {booking.address}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCurrencyRupee className="text-green-600" size={18} />
                        Rs. {booking.totalPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[150px]">
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {booking.status === "completed" && !booking.isReviewed && (
                      <Link to={`/review/${booking._id}`}>
                        <Button size="sm" className="w-full">Submit Review</Button>
                      </Link>
                    )}
                    {booking.status === "completed" && booking.isReviewed && (
                      <Badge variant="blue">Reviewed</Badge>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;