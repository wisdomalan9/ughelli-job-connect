const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* TOKEN */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

/* REGISTER */
const register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      businessName,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      res.status(400);
      throw new Error("All required fields must be filled.");
    }

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      res.status(400);
      throw new Error("Email or phone already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "seeker",
      businessName: businessName || "",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        premiumPlan: user.premiumPlan,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* LOGIN */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials.");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      res.status(401);
      throw new Error("Invalid credentials.");
    }

    if (user.isSuspended) {
      res.status(403);
      throw new Error("Account suspended.");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        premiumPlan: user.premiumPlan,
        freeApplicationsLeft: user.freeApplicationsLeft,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* GET PROFILE */
const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE PROFILE */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "fullName",
      "businessName",
      "profileImage",
      "address",
      "bio",
      "location",
      "skills",
      "experience",
      "education",
      "certificates",
      "cvFile",
      "expectedSalary",
      "availability",
      "website",
      "linkedin",
      "companyLogo",
      "companyDescription",
      "workersNeededDefault",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    /* Auto profile strength */
    let score = 20;

    if (req.user.profileImage) score += 10;
    if (req.user.bio) score += 10;
    if (req.user.location) score += 10;
    if (req.user.skills) score += 10;
    if (req.user.experience) score += 10;
    if (req.user.education) score += 10;
    if (req.user.cvFile) score += 15;
    if (req.user.certificates) score += 10;
    if (req.user.linkedin || req.user.website) score += 5;

    if (score > 100) score = 100;

    req.user.profileStrength = score;

    await req.user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
