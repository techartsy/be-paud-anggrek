const joi = require('joi');
const _ = require('lodash');
const moment = require('moment');
const { Certificate, Guru, Siswa } = require('../../../models');
const PATH_FILE = 'http://localhost:5000/uploads/';
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

exports.getAllCertificate = async (req, res) => {
  try {
    const { query } = req;
    if (!_.isEmpty(query)) {
      if (query.teacher) {
        const certificates = await Certificate.findAll({
          where: {
            id_guru: query.teacher,
          },
          attributes: {
            exclude
          },
          include: [
            {
              model: Siswa,
              as: 'studentData',
              attributes: {
                exclude: studentExclude
              },
            },
            {
              model: Guru,
              as: 'teacherData',
              attributes: {
                exclude: teacherExclude
              }
            }
          ]
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            certificates
          },
        })
      } else if (query.student) {
        const certificates = await Certificate.findAll({
          where: {
            id_siswa: query.student,
          },
          attributes: {
            exclude
          },
          include: [
            {
              model: Siswa,
              as: 'studentData',
              attributes: {
                exclude: studentExclude
              },
            },
            {
              model: Guru,
              as: 'teacherData',
              attributes: {
                exclude: teacherExclude
              }
            }
          ]
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            certificates
          },
        })
      } else {
        return res.status(400).send({
          status: 'Error',
          message: 'Bad Request'
        })
      }
    } else {
      const certificates = await Certificate.findAll({
        attributes: {
          exclude
        },
        include: [
          {
            model: Siswa,
            as: 'studentData',
            attributes: {
              exclude: studentExclude
            },
          },
          {
            model: Guru,
            as: 'teacherData',
            attributes: {
              exclude: teacherExclude
            }
          }
        ]
      });
      return res.status(200).send({
        status: 'Success',
        data: {
          certificates
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

exports.getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkCertificate = await Certificate.findOne({
      where: {
        id
      },
      attributes: {
        exclude
      },
      include: [
        {
          model: Siswa,
          as: 'studentData',
          attributes: {
            exclude: studentExclude
          },
        },
        {
          model: Guru,
          as: 'teacherData',
          attributes: {
            exclude: teacherExclude
          }
        }
      ]
    })

    if (!checkCertificate) {
      return res.status(404).send({
        status: 'Error',
        message: 'Certificate Not Found',
      })
    }

    return res.status(200).send({
      status: 'Success',
      data: {
        certificate: checkCertificate
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.removeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificateExisted = await Certificate.findOne({
      where: {
        id,
      }
    });

    if (!certificateExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Certificate Not Found',
      });
    }

    await Certificate.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Certificate Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
