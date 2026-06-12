/**
 * Run: npm run seed
 * Seeds demo doctors and a patient into MongoDB.
 */
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in .env.local first");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: String,
  photo: String,
}, { timestamps: true });

const DoctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  specialization: String,
  degree: String,
  experience: Number,
  hospital: String,
  bio: String,
  consultationFee: Number,
  availableDays: [String],
  availableTimeSlots: [String],
  rating: Number,
  totalPatients: Number,
  profileComplete: Boolean,
  image: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model("DoctorProfile", DoctorProfileSchema);

const doctors = [
  {
    name: "Dr. Rajesh Kumar",
    email: "doctor@medcare.com",
    phone: "+91 98765 43210",
    specialization: "Cardiology",
    degree: "MBBS, MD (Cardiology), FACC",
    experience: 15,
    hospital: "Apollo Hospital, Delhi",
    bio: "Renowned cardiologist with 15+ years of experience in interventional cardiology.",
    consultationFee: 1500,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Priya Sharma",
    email: "neuro@medcare.com",
    phone: "+91 98765 43211",
    specialization: "Neurology",
    degree: "MBBS, MD (Neurology), DM",
    experience: 12,
    hospital: "Fortis Hospital, Mumbai",
    bio: "Expert neurologist specializing in stroke management and epilepsy.",
    consultationFee: 2000,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Vikram Singh",
    email: "ortho@medcare.com",
    phone: "+91 98765 43212",
    specialization: "Orthopedics",
    degree: "MBBS, MS (Orthopedics)",
    experience: 10,
    hospital: "Max Hospital, Bangalore",
    bio: "Orthopedic surgeon expert in joint replacement and sports injuries.",
    consultationFee: 1200,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Ananya Patel",
    email: "pediatric@medcare.com",
    phone: "+91 98765 43213",
    specialization: "Pediatrics",
    degree: "MBBS, MD (Pediatrics)",
    experience: 8,
    hospital: "AIIMS, New Delhi",
    bio: "Compassionate pediatrician dedicated to child healthcare.",
    consultationFee: 1000,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  },
];

const SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  const hash = await bcrypt.hash("doctor123", 12);
  const patientHash = await bcrypt.hash("patient123", 12);

  for (const doc of doctors) {
    const existing = await User.findOne({ email: doc.email });
    if (existing) {
      console.log(`Skip: ${doc.email} already exists`);
      continue;
    }
    const user = await User.create({
      name: doc.name,
      email: doc.email,
      password: hash,
      phone: doc.phone,
      role: "doctor",
      photo: doc.image,
    });
    await DoctorProfile.create({
      userId: user._id,
      specialization: doc.specialization,
      degree: doc.degree,
      experience: doc.experience,
      hospital: doc.hospital,
      bio: doc.bio,
      consultationFee: doc.consultationFee,
      availableDays: DAYS,
      availableTimeSlots: SLOTS,
      rating: 4.8,
      totalPatients: 1000,
      profileComplete: true,
      image: doc.image,
    });
    console.log(`Created doctor: ${doc.name}`);
  }

  const patientExists = await User.findOne({ email: "patient@medcare.com" });
  if (!patientExists) {
    await User.create({
      name: "Amit Sharma",
      email: "patient@medcare.com",
      password: patientHash,
      phone: "+91 98765 12345",
      role: "patient",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    });
    console.log("Created patient: patient@medcare.com / patient123");
  }

  console.log("\nSeed complete! Doctor login: doctor@medcare.com / doctor123");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
