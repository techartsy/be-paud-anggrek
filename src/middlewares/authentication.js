const { verifyToken } = require("../utils/jwt");
const { Admin, Guru, Siswa } = require("../../models");

const authentication = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send({
      status: "Failed",
      message: "User Unauthenticated",
    });
  }
  try {
    const token = header.replace("Bearer ", "");
    const verified = verifyToken(token);

    if (verified) {
      if (verified.role === 3) {
        Guru.findOne({
          where: {
            id: verified.id,
          },
        })
          .then((data) => {
            if (data) {
              req.userData = verified;
              next();
            } else {
              res.status(404).send({
                status: "Failed",
                message: "User not Found",
              });
            }
          })
          .catch((error) => {
            res.status(500).send({
              status: "Failed",
              message: "Internal Server Error",
            });
          });
      } else if (verified.role === 2) {
        Siswa.findOne({
          where: {
            id: verified.id,
          },
        })
          .then((data) => {
            if (data) {
              req.userData = verified;
              next();
            } else {
              res.status(404).send({
                status: "Failed",
                message: "User not Found",
              });
            }
          })
          .catch((error) => {
            res.status(500).send({
              status: "Failed",
              message: "Internal Server Error",
            });
          });
      } else if (verified.role === 1) {
        Admin.findOne({
          where: {
            id: verified.id,
          },
        })
          .then((data) => {
            if (data) {
              req.userData = verified;
              next();
            } else {
              res.status(404).send({
                status: "Failed",
                message: "User not Found",
              });
            }
          })
          .catch((error) => {
            res.status(500).send({
              status: "Failed",
              message: "Internal Server Error",
            });
          });
      }
    } else {
      res.status(401).send({
        status: "Failed",
        message: "User Unauthenticated",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

module.exports = authentication;
