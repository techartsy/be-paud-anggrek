const Admin = require('../../models').Admin;
const { verifyToken } = require('../utils/jwt');

const adminAuthorization = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send({
      status: "Failed",
      message: "User Unauthenticated",
    });
  }
  try {
    const header = req.headers.authorization;
    const token = header.replace("Bearer ", "");
    const decoded = verifyToken(token);
    console.log(decoded, '<<<<<<<< decoded');
    const { id } = decoded;

    const adminData = await Admin.findOne({
      where: {
        id,
      },
    });
    if (!adminData) {
      return res.status(404).send({
        status: 'Error',
        message: 'User Unregistered'
      });
    } else if (decoded.role !== 1) {
      return res.status(403).send({
        status: 'Error',
        message: 'Forbidden Access'
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = adminAuthorization;
