const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
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
  requireAuth,
  requireAdmin,
  requireRole,
  redirectIfAuthenticated,
};
