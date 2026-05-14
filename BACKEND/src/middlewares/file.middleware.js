const multer = require("multer")

const ALLOWED_RESUME_MIME_TYPES = new Set([
    "application/pdf"
])

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_RESUME_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error("Only PDF resumes are supported."))
        }
        return cb(null, true)
    },
})

module.exports = upload