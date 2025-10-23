function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }
    next();
  };
}

module.exports = roleMiddleware;
