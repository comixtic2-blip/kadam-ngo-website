const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= PASSWORD SETUP ================= */
const PASSWORD_FILE = path.join(__dirname, 'password.json');

if (!fs.existsSync(PASSWORD_FILE)) {
    fs.writeFileSync(PASSWORD_FILE, JSON.stringify({ password: "Kadamfoundation@87906" }));
}

function getPassword() {
    return JSON.parse(fs.readFileSync(PASSWORD_FILE)).password;
}

function setPassword(newPass) {
    fs.writeFileSync(PASSWORD_FILE, JSON.stringify({ password: newPass }));
}

/* ================= API ROUTES ================= */

// LOGIN
app.post("/login", (req, res) => {
    const entered = req.body.password;
    res.json({ success: entered === getPassword() });
});

// UPDATE PASSWORD
app.post("/update-password", (req, res) => {
    const newPass = req.body.newPass;
    if (!newPass) {
        return res.status(400).json({ success: false });
    }

    setPassword(newPass);
    res.json({ success: true });
});

// UPDATE INDEX
app.post('/update-index', (req, res) => {
    const newContent = req.body.content;
    fs.writeFile('index.html', newContent, err => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

/* ================= IMAGE UPLOAD ================= */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false });
    }

    res.json({ path: '/uploads/' + req.file.filename });
});

/* ================= STATIC FILES ================= */
app.use(express.static(__dirname));

/* ================= START SERVER ================= */
app.listen(port, '0.0.0.0', () => {
    console.log("Server running on port " + port);
});
