// package for handling environment variables
require("dotenv").config()

// app framework
const express = require("express");
const app = express();

// ODM package for mapping to the mongodb database
const mongoose = require("mongoose");

// database connection 
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB Atlas..."))
    .catch((error) => console.log(error));


// middleware for setting the static folder
app.use(express.static("public"));

// middleware for handling json in request body
app.use(express.json());
// middlware for handling url-encoded payloads
app.use(express.urlencoded({ extended: true }));

// setting views directory
app.set("views", "./views");
// setting view engine
app.set("view engine", "ejs");


// middleware for handlig file uploads
const multer = require("multer");

const upload = multer({ dest: "uploads/" });


const Image = require("./models/Image");

app.get("/", (req, res) => {
    res.render("home", { images: [], title: "Image Upload" });
});

app.get("/api/images", (req, res) => {
    Image.find({}, (err, images) => {
        if (err) {
            console.log(err);
            res.status(500).send("[Error]: Could not fetch images.");
        } else {
            res.render("home", { images: images, title: "Image Upload" });
        }
    });
});

app.get("/api/images/:id", (req, res) => {
    const id = req.params.id;

    Image.findById(id, (err, image) => {
        if (err) {
            console.log(err);
            res.status(404).send("Image not found");
        }
        else {
            res.render("image", { img: image, title: image.name});
        }
    });
});


const fs = require("fs");
const path = require("path");

app.post("/api/images", upload.single("imageFile"), (req, res, next) => {
    
    const file = req.file;
    let fileObject = {
        name: file.originalname,
        sizeInBytes: file.size,
        path: `./uploads/${file.filename}`,
        mimetype: file.mimetype,
        image: {
            data: fs.readFileSync(`./uploads/${file.filename}`),
            contentType: file.mimetype
        }
    }

    fileObject = new Image(fileObject);

    fileObject.save((err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("An error occurred while uploading.")
        }
        else {
            fs.promises.unlink(`./uploads/${file.filename}`);
            res.status(200).redirect("/");
        }
     });
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>console.log(`Server listening on port: ${PORT}...`));