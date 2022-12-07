const joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const { Siswa, Pembayaran, Certificate } = require('../../../models');
const { generateToken } = require('../../utils/jwt');
const { comparePass } = require('../../utils/brcypt');
const exclude = ["password", "createdAt", "updatedAt"];

exports.registerStudent = async (req, res) => {
  try {
    const { email } = req.body;
    let data = req.body;
    const scheme = joi.object({
      nama_lengkap: joi.string().min(5).required(),
      nik_anak: joi.string().min(5).required(),
      email: joi.string().min(5).required(),
      password: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);

    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };

    const userCheck = await Siswa.findOne({
      where: {
        email,
      },
    });

    if (userCheck) {
      return res.status(400).send({
        status: "Validation Failed",
        message: "Email already Registered",
      });
    }

    data.nomor_pendaftaran = moment().format('x');
    const dataStudent = await Siswa.create(data);
    const newData = _.extend(dataStudent, { role: 2 })
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
    const { email, password } = req.body;
    Siswa.findOne({ where: { email } }).then((user) => {
      if (!user || !comparePass(password, user.password)) {
        return res.status(401).send({
          status: "Validation Failed",
          message: "Invalid Email or Password",
        });
      } else {
        const newData = _.extend(user, { role: 2 })
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

exports.getStudents = async (req, res) => {
  try {
    let students = await Siswa.findAll({
      attributes: {
        exclude
      },
      include: [
        {
          model: Pembayaran,
          as: 'userPayment',
          attributes: {
            exclude
          },
        },
        {
          model: Certificate,
          as: 'userCertificate',
          attributes: {
            exclude
          }
        }
      ]
    });

    res.status(200).send({
      status: 'Success',
      data: {
        students
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await Siswa.findOne({
      where: {
        id,
      },
      attributes: {
        exclude,
      },
      include: [
        {
          model: Pembayaran,
          as: 'userPayment',
          attributes: {
            exclude
          },
        },
        {
          model: Certificate,
          as: 'userCertificate',
          attributes: {
            exclude
          }
        }
      ]
    });

    if (!checkId) {
      return res.status(404).send({
        status: 'Failed',
        message: `Student ${id} not Found`,
      });
    };
    res.status(200).send({
      status: 'Success',
      message: `Stuent ${id} Successfully Get`,
      data: {
        student: checkId,
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const userExisted = await Siswa.findOne({
      where: {
        id,
      }
    });

    if (!userExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Student Not Found',
      });
    }
    await Siswa.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Student Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
