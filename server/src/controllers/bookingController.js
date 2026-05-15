const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      provider,
      serviceCategory,
      serviceDescription,
      bookingDate,
      address,
      totalPrice,
    } = req.body;

    // check provider exists
    const providerExists = await ServiceProvider.findById(provider);

    if (!providerExists) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // create booking
    const booking = await Booking.create({
      user: req.user._id,
      provider,
      serviceCategory,
      serviceDescription,
      bookingDate,
      address,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// User booking history
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("provider")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Provider bookings
const getProviderBookings = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    const bookings = await Booking.find({
      provider: provider._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider bookings",
      error: error.message,
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // only booking owner can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// Get single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("provider user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById,
};