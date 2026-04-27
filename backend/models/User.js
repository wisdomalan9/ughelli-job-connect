const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
role: {
type: String,
enum: ["admin", "employer", "seeker"],
default: "seeker",
index: true,
},

fullName: {
type: String,
required: true,
trim: true,
},

businessName: {
type: String,
default: "",
trim: true,
},

email: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true,
index: true,
},

phone: {
type: String,
required: true,
unique: true,
trim: true,
index: true,
},

password: {
type: String,
required: true,
},

profileImage: {
type: String,
default: "",
},

address: {
type: String,
default: "",
},

bio: {
type: String,
default: "",
},

/* NEW PROFILE FIELDS */

location: {
type: String,
default: "",
},

skills: {
type: String,
default: "",
},

experience: {
type: String,
default: "",
},

education: {
type: String,
default: "",
},

certificates: {
type: String,
default: "",
},

cvFile: {
type: String,
default: "",
},

expectedSalary: {
type: String,
default: "",
},

availability: {
type: String,
default: "",
},

website: {
type: String,
default: "",
},

linkedin: {
type: String,
default: "",
},

companyLogo: {
type: String,
default: "",
},

companyDescription: {
type: String,
default: "",
},

workersNeededDefault: {
type: Number,
default: 1,
},

profileStrength: {
type: Number,
default: 20,
},

eliteVerified: {
type: Boolean,
default: false,
index: true,
},

freeApplicationsLeft: {
type: Number,
default: 3,
},

premiumPlan: {
type: String,
enum: ["free", "plus", "premium"],
default: "free",
index: true,
},

premiumExpiresAt: {
type: Date,
default: null,
},

walletBalance: {
type: Number,
default: 0,
},

employerBadge: {
type: String,
default: "New Employer",
},

jobsPostedCount: {
type: Number,
default: 0,
},

isVerified: {
type: Boolean,
default: false,
index: true,
},

isSuspended: {
type: Boolean,
default: false,
index: true,
},

suspensionReason: {
type: String,
default: "",
},

lastLoginAt: {
type: Date,
default: null,
},
},
{
timestamps: true,
}
);

/* INDEXES */

userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ isSuspended: 1, createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
