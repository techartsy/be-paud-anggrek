const joi = require('joi');
const _ = require('lodash');
const moment = require('moment');
const { Article } = require('../../../models');
const PATH_FILE = 'http://localhost:5000/uploads/';
const exclude = ["createdAt", "updatedAt"];

exports.addArticle = async (req, res) => {
  try {
    const data = req.body;
    const scheme = joi.object({
      title: joi.string().min(5).required(),
      description: joi.string().min(5).required(),
      category: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };
    const timestamp = moment().format('MMMM Do YYYY');
    await Article.create({
      ...data,
      timestamp,
      image: PATH_FILE + req.file.filename
    });
    return res.status(200).send({
      status: 'Success',
      message: 'Article Uploaded'
    });
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.getAllArticle = async (req, res) => {
  try {
    const { query } = req;
    if (!_.isEmpty(query)) {
      if (query.category.toLowerCase() === 'kegiatan') {
        const articles = await Article.findAll({
          attributes: {
            exclude
          },
          where: {
            category: 'kegiatan'
          }
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            articles
          },
        })
      } else if (query.category.toLowerCase() === 'prestasi') {
        const articles = await Article.findAll({
          attributes: {
            exclude
          },
          where: {
            category: 'prestasi'
          }
        });
        return res.status(200).send({
          status: 'Success',
          data: {
            articles
          },
        }) 
      } else {
        return res.status(400).send({
          status: 'Error',
          message: 'Bad Request'
        })
      }
    } else {
      const articles = await Article.findAll({
        attributes: {
          exclude
        }
      });
      return res.status(200).send({
        status: 'Success',
        data: {
          articles
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

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkArticle = await Article.findOne({
      where: {
        id
      }
    })

    if (!checkArticle) {
      return res.status(404).send({
        status: 'Error',
        message: 'Article Not Found',
      })
    }

    return res.status(200).send({
      status: 'Success',
      data: {
        article: checkArticle
      },
    })
  } catch (error) {
    return res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
}

exports.removeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const articleExisted = await Article.findOne({
      where: {
        id,
      }
    });

    if (!articleExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'Article Not Found',
      });
    }
    await Article.destroy({
      where: {
        id,
      }
    });

    return res.status(200).send({
      status: 'Success',
      message: 'Article Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}
