const multer = require('multer');

const uploadTemp = multer({ dest: 'tmp' });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage });

module.exports = {
  uploadStorage,
  uploadTemp,
};
