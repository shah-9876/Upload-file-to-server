const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173'], // Allow requests from local host and frontend application
  credentials: true
}));
app.use(express.json());

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/Images')));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/Images");
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'public/Images', req.file.filename);

  // Schedule file deletion after 1 minute (60000 milliseconds)
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File deleted: ${filePath}`);
      }
    });
  }, 60000); // 1 minute

  res.status(200).send('File uploaded successfully');
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
