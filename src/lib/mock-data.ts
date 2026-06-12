import { DoctorProfile, FAQItem, Testimonial, User } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Patient",
    content:
      "MedCare made booking my appointment so easy! I found the perfect cardiologist and got a confirmation email instantly. The serial number system kept everything organized.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    content:
      "As a doctor, this platform has transformed how I manage my daily patients. The dashboard shows everything I need — waiting, confirmed, and completed appointments at a glance.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Patient",
    content:
      "I love being able to see my appointment history and track my token number. The doctor updated my status in real-time when my treatment was complete.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Patient",
    content:
      "Professional, clean interface with all doctor details — degrees, experience, fees. Booking took less than 2 minutes. Highly recommend MedCare!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
];

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "How do I book an appointment with a doctor?",
    answer:
      "Register as a patient, browse our list of qualified doctors, view their profiles including specialization and experience, select an available time slot, and confirm your booking. You'll receive an instant email confirmation.",
  },
  {
    id: "2",
    question: "Can I cancel or reschedule my appointment?",
    answer:
      "Currently, appointment cancellations and rescheduling requests are handled by your doctor. Contact your doctor through the platform or request a time change — your doctor will update the status accordingly.",
  },
  {
    id: "3",
    question: "How does the serial number system work?",
    answer:
      "When you book an appointment for a specific day, you're assigned a serial number based on booking order. On the day of your visit, doctors see patients in serial order, helping reduce wait times.",
  },
  {
    id: "4",
    question: "What information do doctors provide on their profiles?",
    answer:
      "Doctors complete detailed profiles including their medical degree, years of experience, specialization, hospital affiliation, consultation fees, available days, and time slots so patients can make informed decisions.",
  },
  {
    id: "5",
    question: "Will I receive email notifications?",
    answer:
      "Yes! When you successfully book an appointment, you'll receive an email confirmation with appointment details including date, time, doctor name, and your serial number.",
  },
  {
    id: "6",
    question: "How can doctors manage their daily patients?",
    answer:
      "Doctors get a comprehensive dashboard showing today's appointments organized by status — waiting, confirmed, in-progress, and completed. They can update patient status and view full patient details.",
  },
];

const HERO_IMAGES = {
  corridor:
    "https://images.openai.com/static-rsc-4/Yzs31TdVdC1vw6Ne-hITWvqdFQqe-QobriXJchBzu9W4SQE7m3l7g1hubmAe4jhbTUOl0MrefqQrGzDUkOAoVBSA-XEm4hTQCVek8ol6k5RekrMIlVn0OdFiKvNkyzmcpo3CAx47g9Xo8o1xLyHFAZAGhKnX9FYoHBvjtBTlnHwdyjqWDeSiWscMx6UxYMnN?purpose=fullsize",
  reception:
    "https://images.openai.com/static-rsc-4/ybsxyp77rsayHrF52g_bsQUyf6m21pwujis6hQQNnQ9n7jpioIYFKlBKv4zVI4hOjHZ3B_hS-nHQvrG6QLcqYnmHJJMtQ9TYsARJtDA_PAwoieOBTlWanpguLteNHbpDJ_-S96xgyI3a3G7kAFsWusl4_6pAUUZhgZDmg6kfCBr__Fm5AY9IcGx-awIdnL1N?purpose=fullsize",
  staff:
    "https://images.openai.com/static-rsc-4/pNhgmJP5AJnNXijxCzyxI_mw32C5om-c12cvOnpCaXxGaIC7ATtUHyHYqyoaW3p3TJNuFlXoeE2Ax7I7hHTfcRoVlnLJB6Ho9ag2bbxRn1vqatyp3I6ojm4JXyqQCyRmNCMSbKgUeWgpjGIgI3yi0zvT90u4nFnBvyUhJJbi66eDUI9Fhh8o3N4u9VOh9w3R?purpose=fullsize",
} as const;

export const heroSlides = [
  {
    id: 1,
    title: "Your Health, Our Priority",
    subtitle: "Book appointments with top doctors instantly",
    description:
      "Connect with experienced healthcare professionals. Manage appointments, track your visits, and receive instant confirmations.",
    image: HERO_IMAGES.corridor,
    cta: "Book Now",
  },
  {
    id: 2,
    title: "Expert Doctors, Trusted Care",
    subtitle: "Browse verified medical professionals",
    description:
      "View detailed doctor profiles with degrees, experience, and patient reviews. Choose the right specialist for your needs.",
    image: HERO_IMAGES.reception,
    cta: "Find Doctors",
  },
  {
    id: 3,
    title: "Smart Appointment Management",
    subtitle: "Serial-based queue system",
    description:
      "Get your token number, track appointment status in real-time, and receive email confirmations for every booking.",
    image: HERO_IMAGES.staff,
    cta: "Get Started",
  },
];

export const defaultUsers: User[] = [
  {
    id: "doc-1",
    email: "doctor@medcare.com",
    password: "doctor123",
    name: "Dr. Rajesh Kumar",
    phone: "+91 98765 43210",
    role: "doctor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pat-1",
    email: "patient@medcare.com",
    password: "patient123",
    name: "Amit Sharma",
    phone: "+91 98765 12345",
    role: "patient",
    createdAt: new Date().toISOString(),
  },
];

export const defaultDoctorProfiles: DoctorProfile[] = [
  {
    userId: "doc-1",
    specialization: "Cardiology",
    degree: "MBBS, MD (Cardiology), FACC",
    experience: 15,
    hospital: "Apollo Hospital, Delhi",
    bio: "Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart conditions. Specialized in interventional cardiology and preventive cardiac care.",
    consultationFee: 1500,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableTimeSlots: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
    ],
    rating: 4.8,
    totalPatients: 2500,
    profileComplete: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    userId: "doc-2",
    specialization: "Neurology",
    degree: "MBBS, MD (Neurology), DM",
    experience: 12,
    hospital: "Fortis Hospital, Mumbai",
    bio: "Expert neurologist specializing in stroke management, epilepsy, and movement disorders with extensive research background.",
    consultationFee: 2000,
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableTimeSlots: [
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
    ],
    rating: 4.9,
    totalPatients: 1800,
    profileComplete: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  },
  {
    userId: "doc-3",
    specialization: "Orthopedics",
    degree: "MBBS, MS (Orthopedics)",
    experience: 10,
    hospital: "Max Hospital, Bangalore",
    bio: "Orthopedic surgeon with expertise in joint replacement, sports injuries, and spine surgery. Committed to restoring mobility and quality of life.",
    consultationFee: 1200,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
    ],
    rating: 4.7,
    totalPatients: 1500,
    profileComplete: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  },
  {
    userId: "doc-4",
    specialization: "Pediatrics",
    degree: "MBBS, MD (Pediatrics)",
    experience: 8,
    hospital: "AIIMS, New Delhi",
    bio: "Compassionate pediatrician dedicated to child healthcare from infancy through adolescence. Expert in vaccinations and developmental care.",
    consultationFee: 1000,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableTimeSlots: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "03:00 PM",
      "03:30 PM",
    ],
    rating: 4.9,
    totalPatients: 3200,
    profileComplete: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  },
];

export const additionalDoctors: User[] = [
  {
    id: "doc-2",
    email: "neuro@medcare.com",
    password: "doctor123",
    name: "Dr. Priya Sharma",
    phone: "+91 98765 43211",
    role: "doctor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc-3",
    email: "ortho@medcare.com",
    password: "doctor123",
    name: "Dr. Vikram Singh",
    phone: "+91 98765 43212",
    role: "doctor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc-4",
    email: "pediatric@medcare.com",
    password: "doctor123",
    name: "Dr. Ananya Patel",
    phone: "+91 98765 43213",
    role: "doctor",
    createdAt: new Date().toISOString(),
  },
];
