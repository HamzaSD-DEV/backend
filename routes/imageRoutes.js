const express = require('express');
const router = express.Router();
const multer = require('multer');
const {ref,storage,uploadBytes,getDownloadURL} = require('../middleware/firebase');
const Image = require('../models/imageModel');

const lstorage = multer.memoryStorage();
const upload = multer({ lstorage });
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Upload the image to Firebase Storage

        const imageFile = req.file.originalname;
        const file = req.file
        const folderName='images/'
        let httpsReference =''
        const storageFolder = ref(storage,folderName+imageFile)

        await uploadBytes(storageFolder, file.buffer,imageFile).then( (snapshot) => {
        });

        await getDownloadURL(storageFolder)
            .then((url) => {
                httpsReference = url;
                console.log('Uploaded a blob or file!',httpsReference);
            })
            .catch((error) => {

                switch (error.code) {
                    case 'storage/object-not-found':
                        // File doesn't exist
                        break;
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                }
            });
        // Save the image details to MongoDB
        const newImage = new Image({
            imageUrl: httpsReference,
            filename: req.file.originalname,
            owner : "64bd864e7578c3cf01e59622"
        });
        const savedImage = await newImage.save();

        return res.status(201).json(savedImage);
    } catch (err) {
        console.error('Error saving image link:', err);
        return res.status(500).json({ error: 'Failed to upload image link' });
    }
});

module.exports = router;
