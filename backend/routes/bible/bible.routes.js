
const express = require('express');
const bibleController = require('../../controllers/bible/bible.controller');
const router = express.Router();


router.get("/:bookName/:chapterNum", bibleController.getVersesInChapter);
router.get("/:bookName", bibleController.getChapters)
router.get("/", bibleController.getBooks);

module.exports = router;