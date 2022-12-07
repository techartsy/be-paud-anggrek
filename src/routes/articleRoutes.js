const express = require('express');
const { addArticle, getAllArticle, getArticleById, removeArticle } = require('../controllers/ArticleController/articleController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllArticle);
router.get('/:id', getArticleById);

router.use(authentication);
router.use(adminAuthorization);
router.post('/create', uploadFile('image'), addArticle);
router.delete('/delete/:id', removeArticle);

module.exports = router;
