const joi = require('joi');
const _ = require('lodash');
const { Admin } = require('../../../models');
const { generateToken } = require('../../utils/jwt');
const { comparePass } = require('../../utils/brcypt');
const exclude = ["password", "createdAt", "updatedAt"];

exports.createAdmin = async (req, res) => {
  try {
    const { username } = req.body;
    const data = req.body;
    const scheme = joi.object({
      username: joi.string().min(5).required(),
      password: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };

    const userCheck = await Admin.findOne({
      where: {
        username,
      },
    });

    if (userCheck) {
      return res.status(400).send({
        status: "Validation Failed",
        message: "Username already Registered",
      });
    }

    const dataAdmin = await Admin.create(data);
    const newData = _.extend(dataAdmin, { role: 1 })
    const token = generateToken(newData);
    return res.status(201).send({
      message: 'Success',
      token
    });
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    Admin.findOne({ where: { username } }).then((admin) => {
      if (!admin || !comparePass(password, admin.password)) {
        return res.status(401).send({
          status: "Validation Failed",
          message: "Invalid Username or Password",
        });
      } else {
        const newData = _.extend(admin, { role: 1 })
        const access_token = generateToken(newData);
        return res.status(200).json({ access_token });
      }
    });
  } catch (err) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  };
};

exports.removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userExisted = await Admin.findOne({
      where: {
        id,
      }
    });

    if (!userExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Admin Not Found',
      });
    }
    await Admin.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Admin Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
