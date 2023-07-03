/*
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const upload = multer({ dest: 'uploads/' });

// Create mongoose schema for an Image
const ImageSchema = new Schema({
    img: { data: Buffer, contentType: String }
});

// Create mongoose model for an Image
const Image = mongoose.model('Image', ImageSchema);

mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('myImage'), (req, res, next) => {
    let newImg = fs.readFileSync(req.file.path);
    let encImg = newImg.toString('base64');

    let finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encImg, 'base64')
    };

    let newImage = new Image(finalImg);

    newImage.save((err, result) => {
        if (err) return console.error(err);
        console.log(result);
        res.redirect('/');
    });
});

*/
