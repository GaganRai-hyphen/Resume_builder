const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const multer = require("multer")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173", 
    "https://gen-ai-integrated-resume-builder.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}))


const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


app.use((err, req, res, next) => {
   
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.message
        })
    }

    if (err.message === "Only PDF resumes are supported.") {
        return res.status(400).json({
            message: err.message
        })
    }

  
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app