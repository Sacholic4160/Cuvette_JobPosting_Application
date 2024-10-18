import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },   // Person's name
    email: { type: String, required: true, unique: true },  // Email for login
    password: { type: String, required: true },  // Hashed password
    phone: { type: String },  // Mobile number for verification (optional)
    isEmailVerified: { type: Boolean, default: false },  // Track email verification
    isPhoneVerified: { type: Boolean, default: false },  // Track phone verification
    employeeSize: { type: Number, default: 0 },
    emailOtp: { type: String },
    phoneOtp: { type: String },
    otpExpiry: { type: Date },
    reqId: { type: String, unique: true },
    noOfOtp: { type: Number, default: 0 },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],  // Reference to jobs
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
