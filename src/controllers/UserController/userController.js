const joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const { Siswa, Pembayaran, Certificate } = require('../../../models');
const { generateToken } = require('../../utils/jwt');
const { comparePass } = require('../../utils/brcypt');
const exclude = ["password", "createdAt", "updatedAt"];
const PATH_FILE = 'http://localhost:5000/uploads/';

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
      token,
      role: 2,
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
        return res.status(200).json({ access_token, role: 2 });
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
          as: 'studentData',
          attributes: {
            exclude
          }
        }
      ]
    });

    return res.status(200).send({
      status: 'Success',
      data: {
        students
      },
    });

  } catch (error) {
    return res.status(500).send({
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
          as: 'studentData',
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
    return res.status(200).send({
      status: 'Success',
      message: `Stuent ${id} Successfully Get`,
      data: {
        student: checkId,
      },
    });

  } catch (error) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.userData;
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
          as: 'studentData',
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
    return res.status(200).send({
      status: 'Success',
      message: `Stuent ${id} Successfully Get`,
      data: {
        student: checkId,
      },
    });

  } catch (error) {
    return res.status(500).send({
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

    const paymentExisted = await Pembayaran.findOne({
      where: {
        id_siswa: id
      }
    })

    if (paymentExisted) {
      await Pembayaran.destroy({
        where: {
          id_siswa: id
        }
      })
    }

    const certificateExisted = await Certificate.findOne({
      where: {
        id_siswa: id
      }
    })

    if (certificateExisted) {
      await Certificate.destroy({
        where: {
          id_siswa: id
        }
      })
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
    return res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}

exports.uploadDocs = async (req, res) => {
  try {
    const { id } = req.userData;
    const checkStudent = await Siswa.findOne({
      where: {
        id,
      }
    })
    if (!checkStudent) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User Not Found'
      })
    }

    let docs;
    if (req.files) {
      for (const item of req.files) {
        docs = {
          ...docs,
          [item.fieldname]: PATH_FILE + item.filename,
        };
      }
    }
    const updatedStudent = await Siswa.update(docs, {
      where: {
        id
      }
    })

    if (!_.isEmpty(updatedStudent)) {
      const invoiceData = {
        id_siswa: id,
        kode_pembayaran: checkStudent.nomor_pendaftaran,
        status: 'pending'
      }
      await Pembayaran.create(invoiceData);
    }

    return res.status(200).send({
      status: 'Success',
      message: 'Document Uploaded',
      data: {
        kode_pembayaran: checkStudent.nomor_pendaftaran,
      }
    })
  } catch (error) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}

exports.profileFulfillment = async (req, res) => {
  try {
    const { id } = req.userData;
    let dataUpdate = {
      ...req.body,
    };

    if (req.file) {
      dataUpdate = {
        ...dataUpdate,
        foto_murid: PATH_FILE + req.file.filename,
      }
    }

    await Siswa.update(dataUpdate, {
      where: {
        id
      }
    })
    return res.status(200).send({
      status: 'Success',
      message: 'Data Updated'
    })
  } catch (error) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}
