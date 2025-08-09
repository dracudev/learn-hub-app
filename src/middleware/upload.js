const multer = require("multer");
const { put } = require("@vercel/blob");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

async function uploadToVercelBlob(file) {
  if (!file) throw new Error("No file provided");
  const uniqueName = `profile-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${file.originalname.replace(/[^.]+/, "")}`;
  const { url } = await put(`uploads/${uniqueName}`, file.buffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.mimetype,
  });
  return url;
}

module.exports = {
  upload,
  uploadSingle: upload.single("profilePicture"),
  uploadFields: upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  uploadToVercelBlob,
};
