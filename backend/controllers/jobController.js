const Job = require("../models/Job");

/* =========================
   CREATE JOB
========================= */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      category,
      location,
      salary,
      description,
      requirements,
      applicationRequirement,
      jobType,
      experienceLevel,
    } = req.body;

    if (!title || !company || !category || !location || !description) {
      res.status(400);
      throw new Error("Required fields missing.");
    }

    const job = await Job.create({
      employerId: req.user._id,
      title: title.trim(),
      company: company.trim(),
      category: category.trim(),
      location: location.trim(),
      salary: salary || "Negotiable",
      description: description.trim(),
      requirements: requirements || "",
      applicationRequirement: applicationRequirement || "any",
      jobType: jobType || "full-time",
      experienceLevel: experienceLevel || "none",
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET PUBLIC JOBS
   ?page=1&limit=10
   ?search=sales
   ?category=Retail
   ?location=Ughelli
========================= */
const getJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      status: "active",
    };

    if (req.query.search) {
      filter.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    if (req.query.category) {
      filter.category = {
        $regex: req.query.category,
        $options: "i",
      };
    }

    if (req.query.location) {
      filter.location = {
        $regex: req.query.location,
        $options: "i",
      };
    }

    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate(
        "employerId",
        "businessName employerBadge isVerified"
      )
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SINGLE JOB
========================= */
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "businessName employerBadge isVerified"
    );

    if (!job) {
      res.status(404);
      throw new Error("Job not found.");
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   EMPLOYER MY JOBS
========================= */
const myJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      employerId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE STATUS
========================= */
const updateStatus = async (req, res, next) => {
  try {
    const allowed = [
      "active",
      "paused",
      "closed",
    ];

    if (!allowed.includes(req.body.status)) {
      res.status(400);
      throw new Error("Invalid status.");
    }

    const job = await Job.findOne({
      _id: req.params.id,
      employerId: req.user._id,
    });

    if (!job) {
      res.status(404);
      throw new Error("Job not found.");
    }

    job.status = req.body.status;
    await job.save();

    res.json({
      success: true,
      message: "Job status updated.",
      job,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   RENEW JOB
========================= */
const renewJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employerId: req.user._id,
    });

    if (!job) {
      res.status(404);
      throw new Error("Job not found.");
    }

    const now = new Date();

    let baseDate =
      job.expiresAt && job.expiresAt > now
        ? new Date(job.expiresAt)
        : now;

    baseDate.setDate(
      baseDate.getDate() + 14
    );

    job.expiresAt = baseDate;
    job.status = "active";

    await job.save();

    res.json({
      success: true,
      message: "Job renewed for 14 days.",
      expiresAt: job.expiresAt,
      job,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  myJobs,
  updateStatus,
  renewJob,
};
