const adminAuth = (req, res, next) => {
      if (req.user && req.user.role === 'Admin') {
          next();
      } else {
          res.status(403).json({ msg: 'Forbidden: Admin access required' });
      }
  };
  
  module.exports = adminAuth;