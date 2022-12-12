const joi = require('joi');
const _ = require('lodash');
const { Siswa, Pembayaran } = require('../../../models');
const exclude = ["createdAt", "updatedAt"];
const PATH_FILE = 'http://localhost:5000/uploads/';
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

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    let payment = await Pembayaran.findOne({
      where: {
        id: id
      },
      attributes: {
        exclude
      },
      include: [
        {
          model: Siswa,
          as: 'userPayment',
          attributes: {
            exclude: studentExclude
          },
        },
      ]
    });

    if (!payment) {
      return res.status(404).send({
        status: 'Failed',
        message: 'payment not Found'
      });
    };
    res.status(200).send({
      status: 'Success',
      data: {
        payment
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getPayments = async (req, res) => {
  try {
    const { query } = req;
    if (!_.isEmpty(query)) {
      if (query.student) {
        let payments = await Pembayaran.findAll({
          where: {
            id_siswa: query.student
          },
          attributes: {
            exclude
          },
          include: [
            {
              model: Siswa,
              as: 'userPayment',
              attributes: {
                exclude: studentExclude
              },
            },
          ]
        });

        return res.status(200).send({
          status: 'Success',
          data: {
            payments
          },
        });
      }
    } else {
      let payments = await Pembayaran.findAll({
        attributes: {
          exclude
        },
        include: [
            {
              model: Siswa,
              as: 'userPayment',
              attributes: {
                exclude: studentExclude
              },
            },
          ]
      });
      return res.status(200).send({
        status: 'Success',
        data: {
          payments
        },
      });
    }

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.removePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const checkPayment = await Pembayaran.findOne({
      where: {
        id,
      }
    });

    if (!checkPayment) {
      return res.status(404).send({
        status: 'Error',
        message: 'Transaction Not Found',
      });
    }
    await Pembayaran.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Payment Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}

exports.paymentFulfillment = async (req, res) => {
  try {
    const { id } = req.userData;
    const data = req.body;
    const scheme = joi.object({
      nama_bank: joi.string().required(),
      nama_pengirim: joi.string().required(),
      metode_pembayaran: joi.string().required(),
      kode_pembayaran: joi.string().required(),
    });
    const { error } = scheme.validate(data);

    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };

    const checkPaymentExisted = await Pembayaran.findOne({
      where: {
        id_siswa: id
      }
    })
    if (!checkPaymentExisted) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Payment Not Found'
      })
    }

    if (checkPaymentExisted.kode_pembayaran !== data.kode_pembayaran) {
      return res.status(400).send({
        status: 'Failed',
        message: 'Kode Pembayaran Invalid'
      })
    }

    const updatedData = {
      ...data,
      status: 'waiting approval',
      pembayaran_pertama: PATH_FILE + req.file.filename
    }

    const updatedPayment = await Pembayaran.update(updatedData, {
      where: {
        id_siswa: id,
        kode_pembayaran: data.kode_pembayaran,
      }
    })
    if (!_.isEmpty(updatedPayment)) {
      const registerStatus = {
        status_pendaftaran: 'waiting approval'
      }
      await Siswa.update(registerStatus, {
        where: {
          id
        }
      })
    }
    return res.status(200).send({
      status: 'Success',
      message: 'Payment Updated'
    })

  } catch (error) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}

exports.paymentUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const scheme = joi.object({
      status: joi.string().required(),
    });
    const { error } = scheme.validate(data);

    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };

    const checkPayment = await Pembayaran.findOne({
      where: {
        id
      }
    })
    if (!checkPayment) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Payment Not Found'
      })
    }
    
    const updatedPayment = await Pembayaran.update(data, {
      where: {
        id
      }
    })

    if (updatedPayment) {
      const studentStatus = {
        status_pendaftaran: data.status,
      }
      await Siswa.update(studentStatus, {
        where: {
          id: checkPayment.id_siswa
        }
      })
    }
    
    return res.status(200).send({
      status: 'Success',
      message: 'Payment Updated'
    })

  } catch (error) {
    console.log(error, '<<< error')
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
}
