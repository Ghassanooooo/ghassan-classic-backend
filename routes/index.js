const express = require("express");

const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");
const ejs = require("ejs");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  fs.readFile(
    path.join(__dirname, "..", "documents", "data", "workoutData.json"),
    (err, data) => {
      let workoutJsonData = JSON.parse(data);
      res.render("index", workoutJsonData);
    }
  );
});

router.get("/download", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "fitness-program.pdf"));
});

router.post("/purchasing-program-user-data", function(req, res, next) {
  //user Data
  console.log(req.body);
  const { name, weight } = req.body;
  fs.readFile(
    path.join(__dirname, "..", "documents", "data", "workoutData.json"),
    (err, dataJson) => {
      let workoutJsonData = JSON.parse(dataJson);
      console.log(workoutJsonData);
      ejs.renderFile(
        path.join(__dirname, "..", "views", "index.ejs"),
        { ...workoutJsonData, name, weight },
        (err, data) => {
          let options = {
            height: "11.25in",
            width: "8.5in",
            header: {
              height: "1mm"
            },
            footer: {
              height: "1mm"
            }
          };
          pdf.create(data, options).toFile("fitness-program.pdf", err => {
            if (err) {
              console.log(err);
              res.json({ success: false });
            }
            res.json({ success: true });
            console.log("the pdf file created");
          });
        }
      );
    }
  );
});

module.exports = router;
