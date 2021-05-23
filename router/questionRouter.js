const express = require("express");
const questionController = require("../controllers/questionController");
const router = express.Router();

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(questionController.createQuestions);

router.route("/:id").get(questionController.getQuestion);

module.exports = router;