const express = require("express");
const mongoose = require("mongoose");
const users = require("../models/user");
const questions = require("../models/question");
const { default: validator } = require("validator");

exports.checkAnswer = async (req, res) => {
  const uId = req.params.uId;
  const qsId = req.params.qsId;
  const answer = req.body.answer;

  if (uId == null || qsId == null) {
    return res
      .json({
        status: 400,
        message: "Uid and Question Id is required",
        result: null,
      })
      .end();
  } else {
    questions.findById(qsId).exec((error, result) => {
      if (result == null)
        res
          .json({
            status: 400,
            message: "Couldn't find the question ",
            result: null,
          })
          .end();
      else {
        if (
          validator.equals(
            validator.trim(result.answer),
            validator.trim(answer)
          )
        ) {
          users.findOneAndUpdate(
            { uId: uId },
            {
              highestLevelPlayed: result.level,
            },
            { useFindAndModify: false },
            (err, updateResult) => {
              console.log(result);
              if (err)
                return res
                  .json({
                    status: 500,
                    message: "Server Error",
                    result: error,
                  })
                  .end();
              else
                res.status(200).json({
                  status: res.statusCode,
                  message: "OK",
                  result: {
                    message: `User Completed level ${result.level}`,
                    isAnswereCorreect: true,
                  },
                });
            }
          );
        } else {
          res.json({
            status: 400,
            message: "The Answer given is Wrong",
            result: {
              message: "Please check your answer",
              isAnswereCorreect: false,
            },
          });
        }
      }
    });
  }
};
