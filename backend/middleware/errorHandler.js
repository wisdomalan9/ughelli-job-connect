const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    res.statusCode &&
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  let message =
    err.message ||
    "Internal Server Error";

  /* =========================
     BAD OBJECT ID
  ========================= */
  if (err.name === "CastError") {
    statusCode = 404;
    message =
      "Resource not found.";
  }

  /* =========================
     DUPLICATE KEY
  ========================= */
  if (err.code === 11000) {
    statusCode = 400;

    const field =
      Object.keys(
        err.keyValue || {}
      )[0] || "Field";

    message = `${field} already exists.`;
  }

  /* =========================
     VALIDATION ERROR
  ========================= */
  if (
    err.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    const errors =
      Object.values(
        err.errors || {}
      ).map(
        (item) =>
          item.message
      );

    message =
      errors.join(", ") ||
      "Validation failed.";
  }

  /* =========================
     JWT ERRORS
  ========================= */
  if (
    err.name ===
      "JsonWebTokenError" ||
    err.name ===
      "TokenExpiredError"
  ) {
    statusCode = 401;
    message =
      "Invalid or expired token.";
  }

  /* =========================
     RESPONSE
  ========================= */
  const isDev =
    process.env.NODE_ENV ===
    "development";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(isDev && {
      error: err.name,
      stack: err.stack,
    }),
  });
};

module.exports =
  errorHandler;
