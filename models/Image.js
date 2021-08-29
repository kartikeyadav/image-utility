const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sizeInBytes: {
        type: Number,
        required: true,
        max: 1048576
    },
    mimetype: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    path: {
        type: String
    }
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;