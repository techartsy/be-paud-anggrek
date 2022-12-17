const joi = require('joi');
const _ = require('lodash');
const { Guru, Siswa, Certificate } = require('../../../models');
const { generateToken } = require('../../utils/jwt');
const { comparePass } = require('../../utils/brcypt');
const exclude = ["password", "createdAt", "updatedAt"];
const PATH_FILE = 'http://localhost:5000/uploads/';

exports.registerTeacher = async (req, res) => {
  try {
    const { email } = req.body;
    const data = req.body;
    const scheme = joi.object({
      nama: joi.string().min(3).required(),
      jabatan: joi.string().min(3).required(),
      email: joi.string().min(5).required(),
      no_telpon: joi.string().min(5).required(),
      password: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };

    const userCheck = await Guru.findOne({
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

    const teacherData = await Guru.create({
      ...data,
      image: PATH_FILE + req.file.filename
    });
    const newData = _.extend(teacherData, { role: 3 })
    const token = generateToken(newData);
    return res.status(201).send({
      message: 'Success',
      token,
      role: 3
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
    Guru.findOne({ where: { email } }).then((teacher) => {
      if (!teacher || !comparePass(password, teacher.password)) {
        return res.status(401).send({
          status: "Validation Failed",
          message: "Invalid Username or Password",
        });
      } else {
        const newData = _.extend(teacher, { role: 3 })
        const access_token = generateToken(newData);
        return res.status(200).json({ access_token, role: 3 });
      }
    });
  } catch (err) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  };
};

exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    let teacher = await Guru.findOne({
      where: {
        id: id
      },
      attributes: {
        exclude
      },
    });

    if (!teacher) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Teacher not Found'
      });
    };
    res.status(200).send({
      status: 'Success',
      data: {
        teacher
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getTeacherProfile = async (req, res) => {
  try {
    const { id } = req.userData;
    let teacher = await Guru.findOne({
      where: {
        id: id
      },
      attributes: {
        exclude
      },
    });
    if (!teacher) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Teacher not Found'
      });
    };
    res.status(200).send({
      status: 'Success',
      data: {
        teacher
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getTeachers = async (req, res) => {
  try {
    let teachers = await Guru.findAll({
      attributes: {
        exclude
      },
    });

    res.status(200).send({
      status: 'Success',
      data: {
        teachers
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.uploadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const checkStudentExisted = await Siswa.findOne({
      where: {
        id
      }
    })
    if (!checkStudentExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Student Not Found',
      })
    }

    const checkTeacherExisted = await Guru.findOne({
      where: {
        id: req.userData.id
      }
    })
    if (!checkTeacherExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Teacher Not Found',
      })
    }

    await Certificate.create({
      id_siswa: id,
      id_guru: req.userData.id,
      file: PATH_FILE + req.file.filename
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Upload Success' 
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}

exports.removeTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const userExisted = await Guru.findOne({
      where: {
        id,
      }
    });

    if (!userExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Teacher Not Found',
      });
    }
    await Guru.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Teacher Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
