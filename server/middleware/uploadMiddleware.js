const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to uploads/ directory (images will be saved as uploads/filename.jpg)
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Check file extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check MIME types (be more lenient as browsers can send different MIME types)
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  console.log(`File upload - Name: ${file.originalname}, MIME: ${file.mimetype}, Extension valid: ${extname}, MIME valid: ${mimetype}`);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.log(`File rejected - Name: ${file.originalname}, MIME: ${file.mimetype}`);
    cb(new Error(`Images only! Please upload an image file (jpeg, jpg, png, gif, webp). Received: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }, // 5MB limit
});

module.exports = { upload };
