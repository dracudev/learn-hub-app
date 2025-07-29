const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    res.status(429);
    res.render("error", {
      title: "Error",
      user: req.session.user,
      error: {
        status: 429,
        message: "Too many requests, please try again later.",
      },
    });
  },
});

module.exports = {
  helmetMiddleware,
  limiter,
};
