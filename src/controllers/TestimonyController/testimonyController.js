const joi = require('joi');
const _ = require('lodash');
const moment = require('moment');
const { Testimony, Siswa } = require('../../../models');
const exclude = ["createdAt", "updatedAt"];

exports.createTestimony = async (req, res) => {
  try {
    const data = req.body;
    const scheme = joi.object({
      nama: joi.string().min(3).required(),
      message: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };
    const timestamp = moment().format('MMMM Do YYYY');
    await Testimony.create({
      ...data,
      id_siswa: req.userData.id,
      timestamp,
    });
    return res.status(200).send({
      status: 'Success',
      message: 'Testimony Sent'
    });
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getAllTestimony = async (req, res) => {
  try {
    const testimonies = await Testimony.findAll({
      attributes: {
        exclude
      },
    });
    return res.status(200).send({
      status: 'Success',
      data: {
        testimonies
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getTestimonyById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkTestimony = await Testimony.findOne({
      where: {
        id
      }
    })

    if (!checkTestimony) {
      return res.status(404).send({
        status: 'Error',
        message: 'Testimony Not Found',
      })
    }

    return res.status(200).send({
      status: 'Success',
      data: {
        testimony: checkTestimony
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.removeTestimony = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonyExisted = await Testimony.findOne({
      where: {
        id,
      }
    });

    if (!testimonyExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Testimony Not Found',
      });
    }

    await Testimony.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Testimony Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
