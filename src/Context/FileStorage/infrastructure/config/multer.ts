import fs from 'fs';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { collectionIdOrName, recordId } = req.params;
    const directory = path.resolve('./api/files', collectionIdOrName, recordId);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
