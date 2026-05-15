require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Inline Schema Definitions ────────────────────────────────────────────────
// These mirror your existing models. If your models differ slightly,
// adjust the schema fields below to match yours exactly.

// USER MODEL
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["user", "provider", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    address: { type: String },
    location: {
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// SERVICE PROVIDER MODEL
const serviceProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    category: { type: String, required: true },
    services: [
      {
        category: { type: String },
        description: { type: String },
        price: { type: Number },
      },
    ],
    address: { type: String },
    city: { type: String },
    location: {
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    bio: { type: String },
    experience: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// BOOKING MODEL
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    serviceCategory: { type: String, required: true },
    serviceDescription: { type: String },
    address: { type: String },
    bookingDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// REVIEW MODEL
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const ServiceProvider =
  mongoose.models.ServiceProvider ||
  mongoose.model("ServiceProvider", serviceProviderSchema);
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// ─── Data Pools ───────────────────────────────────────────────────────────────

const nepaliFirstNames = [
  "Aarav","Aayush","Abishek","Aditya","Ajay","Amrit","Anish","Ankit","Anu","Arjun",
  "Ashok","Asim","Asis","Avash","Ayam","Bibek","Bijay","Bikram","Binod","Biraj",
  "Bishal","Bishnu","Deepak","Dipesh","Gagan","Gaurav","Hemant","Ishan","Karan","Kiran",
  "Krish","Kumar","Laxman","Lochan","Manoj","Milan","Nabin","Naresh","Nikhil","Nirajan",
  "Nischal","Pankaj","Paras","Pawan","Prakash","Prashant","Pratik","Puskar","Rahul","Raj",
  "Rajan","Rajesh","Rakesh","Ram","Ramesh","Ravi","Ritesh","Rohan","Rohit","Sachin",
  "Sagun","Sandesh","Sanjay","Sanjib","Saurav","Shiva","Siddharth","Simran","Sita","Subash",
  "Subit","Sujan","Suman","Sunil","Sunita","Surendra","Suresh","Utsav","Vivek","Yogesh",
  "Priya","Anita","Bimala","Kabita","Maya","Nisha","Rekha","Sabita","Sangita","Shristi",
];

const nepaliLastNames = [
  "Adhikari","Aryal","Basnet","Bhattarai","Bista","Budhathoki","Chaudhary","Dhakal",
  "Gautam","Ghimire","Gurung","Joshi","Kafle","Karki","KC","Khanal","Koirala",
  "Lamsal","Limbu","Magar","Maharjan","Manandhar","Niroula","Oli","Panta","Paudel",
  "Pokhrel","Pradhan","Rai","Regmi","Rijal","Sapkota","Sharma","Shrestha","Silwal",
  "Singh","Subedi","Tamang","Thapa","Tiwari",
];

const cities = [
  { name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
  { name: "Lalitpur", lat: 27.6644, lng: 85.3188 },
  { name: "Bhaktapur", lat: 27.6710, lng: 85.4298 },
  { name: "Pokhara", lat: 28.2096, lng: 83.9856 },
  { name: "Butwal", lat: 27.7006, lng: 83.4532 },
  { name: "Chitwan", lat: 27.5291, lng: 84.3542 },
  { name: "Biratnagar", lat: 26.4525, lng: 87.2718 },
  { name: "Dharan", lat: 26.8120, lng: 87.2840 },
  { name: "Hetauda", lat: 27.4167, lng: 85.0333 },
  { name: "Nepalgunj", lat: 28.0500, lng: 81.6167 },
];

const categories = [
  "electrician",
  "plumber",
  "cleaner",
  "carpenter",
  "painter",
  "AC repair",
  "appliance repair",
  "CCTV installation",
  "water tank cleaning",
  "technician",
];

const serviceDescriptionMap = {
  electrician: [
    "Wiring and rewiring of home electrical systems",
    "Fan and light installation",
    "MCB / fuse box replacement",
    "Inverter and UPS installation",
    "Earthing and grounding work",
  ],
  plumber: [
    "Pipe leakage repair and replacement",
    "Tap and shower installation",
    "Toilet seat and flush repair",
    "Water pump installation",
    "Bathroom and kitchen fittings",
  ],
  cleaner: [
    "Full house deep cleaning",
    "Sofa and carpet cleaning",
    "Kitchen and bathroom sanitization",
    "Post-construction cleaning",
    "Office cleaning service",
  ],
  carpenter: [
    "Furniture repair and polishing",
    "Door and window frame fitting",
    "Custom wooden shelf installation",
    "Cabinet making and repair",
    "Bed frame assembly",
  ],
  painter: [
    "Interior wall painting",
    "Exterior house painting",
    "Waterproof paint coating",
    "Texture and design painting",
    "Wood staining and varnishing",
  ],
  "AC repair": [
    "AC gas refilling and servicing",
    "AC installation and uninstallation",
    "AC deep cleaning",
    "Remote control repair",
    "Compressor diagnosis and repair",
  ],
  "appliance repair": [
    "Washing machine repair",
    "Refrigerator gas refilling",
    "Microwave oven repair",
    "Television repair",
    "Water purifier servicing",
  ],
  "CCTV installation": [
    "CCTV camera installation and setup",
    "DVR/NVR configuration",
    "Night vision camera fitting",
    "Remote viewing setup",
    "CCTV maintenance and repair",
  ],
  "water tank cleaning": [
    "Underground tank cleaning",
    "Overhead tank cleaning and disinfection",
    "Tank inspection and leakage fix",
    "Sump cleaning",
    "Water line flushing",
  ],
  technician: [
    "Laptop and computer repair",
    "Mobile phone screen replacement",
    "Router and network setup",
    "Software installation and formatting",
    "Printer setup and repair",
  ],
};

const reviewComments = [
  "Great service! The technician arrived on time and finished the work perfectly.",
  "Very professional. Cleaned up after the job was done.",
  "Affordable price and good quality work. Highly recommend!",
  "The provider was friendly and explained everything clearly.",
  "Quick response and efficient service. Will book again.",
  "Did a fantastic job fixing the issue. Very satisfied.",
  "Service was okay but took a bit longer than expected.",
  "Excellent work! My home looks brand new after the cleaning.",
  "Good experience overall. Professional and courteous.",
  "The plumber fixed the leak quickly and charged a fair price.",
  "AC is working perfectly now. Thanks for the great service!",
  "Very knowledgeable technician. Diagnosed the problem quickly.",
  "Did the job right the first time. No complaints at all.",
  "Reasonable price, quality work. Happy with the result.",
  "Fast and reliable. Will definitely use this service again.",
  "The electrician was skilled and completed the wiring safely.",
  "Disappointed with the service quality. Expected better.",
  "Average work. Nothing special but got the job done.",
  "Arrived late but did a thorough job. Overall satisfied.",
  "Best home service experience I have had in Kathmandu!",
];

const streetNames = [
  "Maharajgunj", "Baneshwor", "Putalisadak", "Bagbazar", "Thamel",
  "Baluwatar", "Bouddha", "Kalanki", "Koteshwor", "Lazimpat",
  "Maitighar", "New Baneshwor", "Patan Dhoka", "Pulchowk", "Sankhamul",
  "Sukedhara", "Swayambhu", "Tahachal", "Tripureshwor", "Chabahil",
];

// ─── Utility Helpers ──────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(1));

const randomName = () =>
  `${rand(nepaliFirstNames)} ${rand(nepaliLastNames)}`;

const jitterCoords = (lat, lng) => ({
  lat: parseFloat((lat + (Math.random() - 0.5) * 0.05).toFixed(6)),
  lng: parseFloat((lng + (Math.random() - 0.5) * 0.05).toFixed(6)),
});

const randomPastDate = (daysBack = 180) => {
  const d = new Date();
  d.setDate(d.getDate() - randInt(1, daysBack));
  return d;
};

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seedDatabase() {
  // 1. Connect
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("❌  MONGO_URI is not defined in your .env file!");
    process.exit(1);
  }

  console.log("🔌  Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB\n");

  // 2. Clear old data and drop collections to remove bad indexes
  console.log("🗑️   Clearing existing data and indexes...");
  await mongoose.connection.collection("reviews").drop().catch(() => {});
  await mongoose.connection.collection("bookings").drop().catch(() => {});
  await mongoose.connection.collection("serviceproviders").drop().catch(() => {});
  await mongoose.connection.collection("users").drop().catch(() => {});
  console.log("✅  Old data cleared\n");

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  // ── SEED 50 REGULAR USERS ─────────────────────────────────────────────────
  console.log("👤  Seeding 50 users...");
  const usersData = [];

  for (let i = 1; i <= 50; i++) {
    const city = rand(cities);
    const { lat, lng } = jitterCoords(city.lat, city.lng);
    const name = randomName();

    usersData.push({
      name,
      email: `user${i}@gmail.com`,
      password: hashedPassword,
      phone: `98${randInt(10000000, 99999999)}`,
      role: "user",
      address: `${rand(streetNames)}, ${city.name}`,
      location: { address: `${rand(streetNames)}, ${city.name}`, latitude: lat, longitude: lng },
      rating: 0,
      totalReviews: 0,
      isActive: true,
    });
  }

  const insertedUsers = await User.insertMany(usersData);
  console.log(`✅  ${insertedUsers.length} users inserted\n`);

  // ── SEED 50 PROVIDER USERS + SERVICE PROVIDERS ───────────────────────────
  console.log("🔧  Seeding 50 service providers (with linked user accounts)...");
  const providerUsersData = [];

  for (let i = 1; i <= 50; i++) {
    const city = rand(cities);
    const { lat, lng } = jitterCoords(city.lat, city.lng);
    const name = randomName();
    const category = rand(categories);

    providerUsersData.push({
      name,
      email: `provider${i}@gmail.com`,
      password: hashedPassword,
      phone: `97${randInt(10000000, 99999999)}`,
      role: "provider",
      address: `${rand(streetNames)}, ${city.name}`,
      location: { address: `${rand(streetNames)}, ${city.name}`, latitude: lat, longitude: lng },
      rating: randFloat(3.5, 5.0),
      totalReviews: randInt(5, 80),
      isActive: true,
      _cityRef: city,       // temp fields, removed before insert
      _categoryRef: category,
      _nameRef: name,
    });
  }

  // Strip temp fields and insert provider users
  const cleanProviderUsers = providerUsersData.map(
    ({ _cityRef, _categoryRef, _nameRef, ...rest }) => rest
  );
  const insertedProviderUsers = await User.insertMany(cleanProviderUsers);

  // Build ServiceProvider docs linked to each provider user
  const serviceProvidersData = insertedProviderUsers.map((u, idx) => {
    const meta = providerUsersData[idx];
    const city = meta._cityRef;
    const category = meta._categoryRef;
    const { lat, lng } = jitterCoords(city.lat, city.lng);
    const descriptions = serviceDescriptionMap[category];

    // 1–3 services per provider
    const numServices = randInt(1, 3);
    const services = [];
    const usedDescs = new Set();
    for (let s = 0; s < numServices; s++) {
      let desc;
      do { desc = rand(descriptions); } while (usedDescs.has(desc));
      usedDescs.add(desc);
      services.push({
        category,
        description: desc,
        price: randInt(500, 5000),
      });
    }

    return {
      user: u._id,
      name: meta.name,
      email: meta.email,
      phone: meta.phone,
      category,
      services,
      address: meta.address,
      city: city.name,
      location: { address: meta.address, latitude: lat, longitude: lng },
      rating: parseFloat(randFloat(3.5, 5.0).toFixed(1)),
      totalReviews: randInt(5, 80),
      isAvailable: Math.random() > 0.2,
      isVerified: Math.random() > 0.3,
      bio: `Experienced ${category} professional serving ${city.name} and nearby areas.`,
      experience: randInt(1, 15),
    };
  });

  const insertedProviders = await ServiceProvider.insertMany(serviceProvidersData);
  console.log(`✅  ${insertedProviders.length} service providers inserted\n`);

  // ── SEED 80 BOOKINGS ──────────────────────────────────────────────────────
  console.log("📅  Seeding 80 bookings...");
  const allUsers = insertedUsers; // only regular users make bookings
  const statuses = ["pending", "confirmed", "completed", "cancelled"];

  const bookingsData = [];
  for (let i = 0; i < 80; i++) {
    const user = rand(allUsers);
    const provider = rand(insertedProviders);
    const city = rand(cities);
    const status = rand(statuses);

    // Weight towards completed for reviews to make sense later
    const weightedStatus =
      Math.random() < 0.45
        ? "completed"
        : Math.random() < 0.3
        ? "confirmed"
        : Math.random() < 0.5
        ? "pending"
        : "cancelled";

    const servicePrice =
      provider.services.length > 0
        ? rand(provider.services).price
        : randInt(500, 5000);

    bookingsData.push({
      user: user._id,
      provider: provider._id,
      serviceCategory: provider.category,
      serviceDescription: rand(serviceDescriptionMap[provider.category]),
      address: `${rand(streetNames)}, ${city.name}`,
      bookingDate: randomPastDate(180),
      status: weightedStatus,
      totalPrice: servicePrice,
      notes:
        Math.random() > 0.5
          ? `Please arrive ${rand(["in the morning", "in the afternoon", "after 5 PM"])}.`
          : "",
    });
  }

  const insertedBookings = await Booking.insertMany(bookingsData);
  console.log(`✅  ${insertedBookings.length} bookings inserted\n`);

  // ── SEED 100 REVIEWS (only for completed bookings) ────────────────────────
  console.log("⭐  Seeding 100 reviews for completed bookings...");
  const completedBookings = insertedBookings.filter(
    (b) => b.status === "completed"
  );

  if (completedBookings.length === 0) {
    console.warn(
      "⚠️  No completed bookings found — skipping reviews. Try re-running."
    );
  } else {
    const reviewsData = [];
    const usedBookingIds = new Set();

    // We want up to 100 reviews; each review maps to a unique completed booking
    const targetReviews = Math.min(100, completedBookings.length);
    const shuffled = completedBookings.sort(() => Math.random() - 0.5);

    for (let i = 0; i < targetReviews; i++) {
      const booking = shuffled[i];
      if (usedBookingIds.has(booking._id.toString())) continue;
      usedBookingIds.add(booking._id.toString());

      reviewsData.push({
        user: booking.user,
        provider: booking.provider,
        booking: booking._id,
        rating: randInt(1, 5),
        comment: rand(reviewComments),
      });
    }

    const insertedReviews = await Review.insertMany(reviewsData);
    console.log(`✅  ${insertedReviews.length} reviews inserted\n`);

    // ── UPDATE PROVIDER AVERAGE RATINGS ─────────────────────────────────────
    console.log("📊  Updating provider average ratings...");

    // Group reviews by provider
    const providerReviewMap = {};
    for (const review of insertedReviews) {
      const pid = review.provider.toString();
      if (!providerReviewMap[pid]) providerReviewMap[pid] = [];
      providerReviewMap[pid].push(review.rating);
    }

    const bulkOps = Object.entries(providerReviewMap).map(([pid, ratings]) => {
      const avgRating =
        parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        );
      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(pid) },
          update: {
            $set: {
              rating: avgRating,
              totalReviews: ratings.length,
            },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      await ServiceProvider.bulkWrite(bulkOps);
      console.log(
        `✅  Updated ratings for ${bulkOps.length} providers\n`
      );
    }
  }

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════");
  console.log("🎉  GharGhar Sewa seed completed!");
  console.log(`   👤 Regular Users      : ${insertedUsers.length}`);
  console.log(`   🔧 Service Providers  : ${insertedProviders.length}`);
  console.log(`      (+ ${insertedProviderUsers.length} provider user accounts)`);
  console.log(`   📅 Bookings           : ${insertedBookings.length}`);
  console.log(
    `   ⭐ Reviews           : ${
      await Review.countDocuments()
    }`
  );
  console.log("═══════════════════════════════════════\n");

  await mongoose.disconnect();
  console.log("🔌  Disconnected from MongoDB");
  process.exit(0);
}

// ─── Run ──────────────────────────────────────────────────────────────────────
seedDatabase().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});