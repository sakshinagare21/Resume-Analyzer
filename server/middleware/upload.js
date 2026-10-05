const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.toLowerCase().endsWith('.pdf');

  if (!extension) {
    return cb(new Error('Only PDF files are allowed.'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;