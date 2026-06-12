Features
Patient Features
User registration and authentication with profile photo upload
Browse doctors by specialization and experience
View doctor profiles and available time slots
Book appointments with symptom description
Appointment queue with serial numbers
Real-time appointment status tracking
Request appointment cancellation
Online payments (UPI/Cash support)
Email confirmations with PDF receipts
Appointment history and payment history
Responsive UI with dark mode support
Doctor Features
Doctor registration and profile management
Manage daily appointments
View patient details and symptoms
Update appointment status:
Waiting
Confirmed
In Progress
Completed
Cancelled
Process cancellation requests (Approve/Reject)
Availability and schedule management
Dashboard analytics
View daily earnings and statistics
System Features
JWT authentication with HTTP-only cookies
Role-based access control (Patient / Doctor / Admin)
Redis caching for frequently accessed data
Queue-based request handling using BullMQ
Background workers for email notifications and PDF generation
Rate limiting and request throttling
Cloudinary image storage
Real-time synchronization
Automatic retry mechanism for failed jobs
Centralized error handling
Logging and monitoring support
Scalable architecture for high traffic
Input validation (Frontend + Backend)
Duplicate booking prevention
Queue management with serial numbers
High Scalability Features
Redis Integration

Used for:

Caching doctor lists
Caching doctor profiles
Session management
Temporary OTP storage
Reducing database load
Message Queue (BullMQ)

Handles heavy tasks asynchronously:

Email notifications
PDF receipt generation
Payment confirmation
Appointment reminders
Cancellation notifications
Background processing
Background Workers

Separate workers process jobs independently:

User Request
      ↓
Next.js API
      ↓
Redis Queue (BullMQ)
      ↓
Worker Process
      ↓
Email / PDF / Notifications

This prevents API delays during high traffic.

Architecture
Client
   ↓
Next.js Frontend
   ↓
API Routes
   ↓
Authentication Middleware
   ↓
Redis Cache
   ↓
MongoDB
   ↓
BullMQ Queue
   ↓
Worker Services
   ↓
Email / PDF / Notifications
Tech Stack
Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
Framer Motion
Lucide React
Backend
Next.js API Routes
TypeScript
Server Actions
Database
MongoDB Atlas
Mongoose ODM
Caching Layer
Redis
Queue System
BullMQ
ioredis
Background Processing
Worker Threads
BullMQ Workers
Authentication
JWT
bcryptjs
HTTP-only Cookies
File Storage
Cloudinary
Email Service
Resend API
PDF Generation
PDFKit
Payment Integration
Razorpay
UPI Support
Monitoring & Logging
Winston
Morgan
Validation
Zod
Security
Helmet
Rate Limiting
Input Sanitization
MongoDB Injection Protection
Deployment
Vercel
MongoDB Atlas
Redis Cloud
Railway (Workers)
Getting Started
Prerequisites
Node.js 18+ and npm/yarn
MongoDB Atlas account (or local MongoDB)
Redis instance (local or Redis Cloud)
Cloudinary account for image storage
Resend account for email service
Razorpay account for payments (optional)

Installation Steps
1. Clone the repository
git clone <your-repo-url>
cd hospital-appointment

2. Install dependencies
npm install

3. Configure environment variables
cp .env.example .env.local

Edit .env.local with your actual credentials:

MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital-appointment
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secure-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=MedCare <noreply@yourdomain.com>
RAZORPAY_KEY_ID=your_razorpay_key (optional)
RAZORPAY_KEY_SECRET=your_razorpay_secret (optional)

4. Seed the database (optional)
npm run seed

5. Start Redis server (if local)
redis-server

6. Start development server
npm run dev

7. Open browser
http://localhost:3000

Available Scripts
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npm run clean        # Clean build cache
npm run worker       # Start background worker

Demo Credentials
After running npm run seed, use these credentials:

Patient Account
Email: patient@medcare.com
Password: passe (5 characters)

Doctor Account
Email: doctor@medcare.com
Password: docto (5 characters)

Validation Rules
Registration
Name: 5-20 characters (letters and spaces only)
Email: Letters only (@, . allowed), maximum 20 characters
Phone: Exactly 10 digits (auto-prefixed with +91)
Password: Exactly 5 characters
Photo: Required (max 5MB, jpg/png/gif)

Login
Email: Same format as registration
Password: Exactly 5 characters
Advanced Production Features
Performance Optimization
Redis caching
Database indexing
Pagination
Lazy loading
Image optimization
Code splitting
Server Components
Reliability
Automatic retry mechanism
Queue-based architecture
Background workers
Graceful error handling
Request validation
Security
HTTP-only cookies
JWT authentication
bcrypt password hashing
Environment variables
Rate limiting
CORS configuration
Secure headers
Scalability
Redis cache layer
Message queue architecture
Horizontal scaling support
Worker separation
Stateless APIs
Async processing

Environment Variables
Required Variables
MONGODB_URI - MongoDB connection string
JWT_SECRET - Secret key for JWT (min 32 characters)
JWT_EXPIRES_IN - Token expiration (e.g., 7d)
CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
CLOUDINARY_API_KEY - Cloudinary API key
CLOUDINARY_API_SECRET - Cloudinary API secret
RESEND_API_KEY - Resend email API key
RESEND_FROM_EMAIL - Sender email address

Optional Variables
REDIS_URL - Redis connection URL (default: localhost:6379)
RAZORPAY_KEY_ID - Razorpay payment gateway key
RAZORPAY_KEY_SECRET - Razorpay secret key
NODE_ENV - Environment (development/production)

Database Models
User Model
_id: ObjectId
name: String (5-20 chars)
email: String (unique, lowercase)
password: String (hashed)
phone: String (+91xxxxxxxxxx)
role: Enum (patient, doctor)
photo: String (Cloudinary URL)
createdAt: Date

DoctorProfile Model
_id: ObjectId
userId: ObjectId (ref: User)
specialization: String
experience: Number (years)
consultationFee: Number
availableSlots: Array of time slots
image: String (Cloudinary URL)
rating: Number (0-5)
about: String

Appointment Model
_id: ObjectId
patientId: ObjectId (ref: User)
patientName: String
patientEmail: String
patientPhone: String
doctorId: ObjectId (ref: User)
doctorName: String
date: String (YYYY-MM-DD)
timeSlot: String (e.g., "10:00 AM - 10:30 AM")
serialNumber: Number
status: Enum (waiting, confirmed, in-progress, completed, cancelled)
symptoms: String
notes: String (optional)
consultationFee: Number
paymentMethod: Enum (cash, upi)
paymentStatus: Enum (pending, paid)
emailSent: Boolean
cancelRequest: Object
  message: String
  requestedAt: Date
  status: Enum (pending, rejected)
createdAt: Date

Deployment Guide
Deploy to Vercel
1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

2. Import to Vercel
- Go to vercel.com
- Click "Import Project"
- Select your GitHub repository
- Configure project settings

3. Add Environment Variables
Add all variables from .env.local in Vercel dashboard

4. Deploy
Vercel will automatically build and deploy

Deploy Workers Separately (Railway/Render)
Workers should run on a separate instance for scalability:
- Deploy worker code to Railway/Render
- Set same environment variables
- Ensure Redis connection is accessible

Production Checklist
Database
 MongoDB Atlas cluster created
 Database user with proper permissions
 IP whitelist configured (allow all: 0.0.0.0/0)
 Connection string tested

Redis
 Redis instance running (local or cloud)
 Connection tested
 Max memory policy set

Security
 Strong JWT_SECRET (32+ characters)
 HTTPS enabled (automatic on Vercel)
 CORS configured properly
 Rate limiting enabled
 Environment variables set

Services
 Cloudinary account created and configured
 Resend account verified and API key active
 Payment gateway configured (if using)

Testing
 Registration flow tested
 Login flow tested
 Appointment booking tested
 Email delivery tested
 PDF generation tested
 Payment flow tested

Monitoring
Error tracking setup (optional: Sentry)
Logging configured
Database backups scheduled
Performance monitoring enabled
Folder Structure
hospital-appointment/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── doctor/
│   │   ├── patient/
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── middleware/
│   ├── services/
│   ├── types/
│   ├── utils/
│   │
│   ├── lib/
│   │   ├── db/
│   │   ├── auth/
│   │   ├── cache/
│   │   ├── queue/
│   │   ├── email/
│   │   ├── payment/
│   │   ├── pdf/
│   │   └── cloudinary/
│   │
│   ├── workers/
│   │   ├── emailWorker.ts
│   │   ├── pdfWorker.ts
│   │   ├── reminderWorker.ts
│   │   └── paymentWorker.ts
│   │
│   ├── models/
│   ├── scripts/
│   └── types/
│
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── README.md
├── SECURITY.md
└── PRE-PUSH-CHECKLIST.md


## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Error: MongooseServerSelectionError
```
Solution:
- Check MONGODB_URI in .env.local
- Verify network access in MongoDB Atlas (whitelist IP)
- Ensure database user has proper permissions

**Redis Connection Failed**
```
Error: Redis connection to localhost:6379 failed
```
Solution:
- Start Redis server: `redis-server`
- Or use Redis Cloud and update REDIS_URL
- Check firewall settings

**Cloudinary Upload Failed**
```
Error: Invalid Cloudinary credentials
```
Solution:
- Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
- Check cloud name spelling
- Ensure account is active

**Email Not Sending**
```
Error: Resend API authentication failed
```
Solution:
- Verify RESEND_API_KEY is correct
- Check sender email is verified in Resend dashboard
- Ensure API key has send permissions

**JWT Token Invalid**
```
Error: jwt malformed
```
Solution:
- Clear browser cookies
- Ensure JWT_SECRET matches between sessions
- Check token expiration settings

**Port Already in Use**
```
Error: Port 3000 is already in use
```
Solution:
```bash
# Find process
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

## Performance Optimization Tips

1. **Enable Redis Caching**
   - Reduces database queries
   - Faster response times
   - Better scalability

2. **Database Indexing**
   - Index frequently queried fields
   - Composite indexes for complex queries
   - Monitor index usage

3. **Image Optimization**
   - Compress images before upload
   - Use Cloudinary transformations
   - Lazy load images

4. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based splitting (automatic in Next.js)
   - Reduce initial bundle size

5. **Server Components**
   - Use React Server Components where possible
   - Reduces client-side JavaScript
   - Faster initial page load

## Security Best Practices

- ✅ Never commit .env.local or .env files
- ✅ Use strong, unique JWT_SECRET (32+ characters)
- ✅ Enable rate limiting in production
- ✅ Validate all user inputs (frontend + backend)
- ✅ Use HTTPS in production (automatic on Vercel)
- ✅ Implement CORS properly
- ✅ Hash passwords with bcrypt
- ✅ Store tokens in HTTP-only cookies
- ✅ Sanitize database queries
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Enable MongoDB authentication
- ✅ Restrict database network access
- ✅ Monitor for security vulnerabilities

## Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Test database connection
npm run seed

# Test email service
node src/scripts/test-email.ts
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linter
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused
- Use async/await over promises
- Handle errors properly

## Roadmap

### Planned Features
- [ ] Multi-language support (i18n)
- [ ] SMS notifications via Twilio
- [ ] Video consultation integration
- [ ] Advanced analytics dashboard
- [ ] Prescription management
- [ ] Medicine reminder system
- [ ] Health records storage
- [ ] Insurance integration
- [ ] Mobile app (React Native)
- [ ] Admin panel for hospital management
- [ ] Appointment rating and reviews
- [ ] Doctor availability calendar
- [ ] Automated appointment reminders
- [ ] Invoice generation
- [ ] Report generation

### Known Issues
- Appointment cancellation requires manual approval
- No automatic refund for cancelled appointments
- Limited payment gateway options
- No offline mode support

## FAQ

**Q: Can I use this for production?**
A: Yes, but ensure you:
- Use production-grade databases
- Enable proper security measures
- Set up monitoring and logging
- Test thoroughly before launch

**Q: How do I add more doctors?**
A: Doctors can register through `/auth/register?role=doctor` or use the seed script.

**Q: Can patients book multiple appointments?**
A: Yes, patients can book multiple appointments with different doctors or same doctor for different dates.

**Q: How are appointment slots managed?**
A: Doctors set their available slots in their profile. Booked slots are automatically marked unavailable.

**Q: What happens if payment fails?**
A: Appointment is created with payment status "pending". Patient can retry payment later.

**Q: Can I customize the validation rules?**
A: Yes, update validation logic in `src/components/auth/AuthForm.tsx` (frontend) and API routes (backend).

**Q: How to backup the database?**
A: Use MongoDB Atlas automated backups or `mongodump` for manual backups.

**Q: Is there a mobile app?**
A: Not yet. Currently web-responsive. Mobile app planned for future.

## Support & Contact

- **Issues**: Create an issue on GitHub
- **Email**: support@medcare.com (replace with your email)
- **Documentation**: Check API.md for detailed API docs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- MongoDB for reliable database solution
- Redis for high-performance caching
- Cloudinary for image management
- Resend for email delivery
- All open-source contributors

---

**Made with ❤️ for better healthcare management**

Last Updated: June 12, 2026
