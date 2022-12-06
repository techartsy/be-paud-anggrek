const joi = require('joi');
const _ = require('lodash');
const moment = require('moment');
const { Gallery } = require('../../../models');
const PATH_FILE = 'http://localhost:5000/uploads/';
const exclude = ["createdAt", "updatedAt"];

exports.addGallery = async (req, res) => {
  try {
    const data = req.body;
    const scheme = joi.object({
      title: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };
    const timestamp = moment().format('MMMM Do YYYY');
    await Gallery.create({
      ...data,
      timestamp,
      image: PATH_FILE + req.file.filename
    });
    return res.status(200).send({
      status: 'Success',
      message: 'Gallery Uploaded'
    });
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getAllGallery = async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      attributes: {
        exclude
      }
    });
    return res.status(200).send({
      status: 'Success',
      data: {
        galleries
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkGallery = await Gallery.findOne({
      where: {
        id
      }
    })

    if (!checkGallery) {
      return res.status(404).send({
        status: 'Error',
        message: 'Gallery Not Found',
      })
    }

    return res.status(200).send({
      status: 'Success',
      data: {
        gallery: checkGallery
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}
