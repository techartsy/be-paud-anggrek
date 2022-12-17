const joi = require('joi');
const _ = require('lodash');
const { Penilaian, Guru, Siswa } = require('../../../models');
const exclude = ["createdAt", "updatedAt"];
const teacherExclude = [ "no_telpon", "email", "password", "createdAt", "updatedAt"];
const studentExclude = [
  "nik_anak",
  "anak_ke_dari",
  "tinggi_badan",
  "berat_badan",
  "alamat_rumah",
  "penyakit_diderita",
  "penyakit_berat",
  "pantangan_makan",
  "nama_ayah",
  "telpon_ayah",
  "pekerjaan_ayah",
  "pendidikan_ayah",
  "agama_ayah",
  "penghasilan_ayah",
  "nama_ibu",
  "pekerjaan_ibu",
  "telpon_ibu",
  "agama_ibu",
  "pendidikan_ibu",
  "penghasilan_ibu",
  "kartu_keluarga",
  "akta_kelahiran",
  "status_pendaftaran",
  "password",
  "createdAt",
  "updatedAt"
];

exports.getAllAssessment = async (req, res) => {
  try {
    const { query } = req;
    if (!_.isEmpty(query)) {
      if (query.teacher) {
        const assessments = await Penilaian.findAll({
          where: {
            id_guru: query.teacher,
          },
          attributes: {
            exclude
          },
          include: [
            {
              model: Siswa,
              as: 'userAssessment',
              attributes: {
                exclude: studentExclude
              },
            },
            {
              model: Guru,
              as: 'teacherAssessment',
              attributes: {
                exclude: teacherExclude
              }
            }
          ]
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            assessments
          },
        })
      } else if (query.student) {
        const assessments = await Penilaian.findAll({
          where: {
            id_siswa: query.student,
          },
          attributes: {
            exclude
          },
          include: [
            {
              model: Siswa,
              as: 'userAssessment',
              attributes: {
                exclude: studentExclude
              },
            },
            {
              model: Guru,
              as: 'teacherAssessment',
              attributes: {
                exclude: teacherExclude
              }
            }
          ]
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            assessments
          },
        })
      } else {
        return res.status(400).send({
          status: 'Error',
          message: 'Bad Request'
        })
      }
    } else {
      const assessments = await Penilaian.findAll({
        attributes: {
          exclude
        },
        include: [
          {
            model: Siswa,
            as: 'userAssessment',
            attributes: {
              exclude: studentExclude
            },
          },
          {
            model: Guru,
            as: 'teacherAssessment',
            attributes: {
              exclude: teacherExclude
            }
          }
        ]
      });
      return res.status(200).send({
        status: 'Success',
        data: {
          assessments
        },
      })
    }
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkAssessment = await Penilaian.findOne({
      where: {
        id
      },
      attributes: {
        exclude
      },
      include: [
        {
          model: Siswa,
          as: 'userAssessment',
          attributes: {
            exclude: studentExclude
          },
        },
        {
          model: Guru,
          as: 'teacherAssessment',
          attributes: {
            exclude: teacherExclude
          }
        }
      ]
    })

    if (!checkAssessment) {
      return res.status(404).send({
        status: 'Error',
        message: 'Assessment Not Found',
      })
    }

    return res.status(200).send({
      status: 'Success',
      data: {
        assessment: checkAssessment
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.removeAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentExisted = await Penilaian.findOne({
      where: {
        id,
      }
    });

    if (!assessmentExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Assessment Not Found',
      });
    }

    await Penilaian.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Assessment Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}

exports.createAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const scheme = joi.object({
      nama: joi.string().min(3).required(),
      kontak: joi.string().min(3).required(),
      message: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };
    const checkTeacherExisted = await Guru.findOne({
      where: {
        id
      }
    })
    if (!checkTeacherExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Teacher Not Found',
      })
    }

    const checkStudentExisted = await Siswa.findOne({
      where: {
        id: req.userData.id
      }
    })
    if (!checkStudentExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Student Not Found',
      })
    }

    await Penilaian.create({
      id_siswa: req.userData.id,
      id_guru: id,
      message: data.message,
      nama: data.nama,
      kontak: data.kontak,
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Assessment Sent' 
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}
