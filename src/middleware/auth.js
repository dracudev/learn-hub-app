const { verifyJwt } = require("../utils/jwt");

const jwtAuth = (req, res, next) => {
  const token = req.session && req.session.jwt;
  if (!token) {
    return res.redirect("/login");
  }
  const user = verifyJwt(token);
  if (!user) {
    return res.redirect("/login");
  }

  // Refresh JWT while session is valid
  const newToken = signJwt({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  req.session.jwt = newToken;
  req.user = user;
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("error", {
      title: "Access Denied",
      message: "You don't have permission to access this page.",
      user: req.session.user,
    });
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: `You need ${role} role to access this page.`,
        user: req.session.user,
      });
    }
    next();
  };
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  requireAdmin,
  requireRole,
  redirectIfAuthenticated,
  jwtAuth,
};
