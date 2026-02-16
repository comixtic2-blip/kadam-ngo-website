/* ================= MASTER PASSWORD ================= */
// Master/backup password (cannot be changed via panel)
const MASTER_PASSWORD = "hjosxybhi#51657865232144"; // hidden backup

/* ================= LOGIN ================= */
function login() {
    const pass = document.getElementById("adminPass").value;

    // Master password works locally
    if (pass === MASTER_PASSWORD) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("dashboard").classList.remove("hidden");
        loadAll();
        return;
    }

    // Regular password checked via server
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass })
    })
    .then(res => res.json())  // parse JSON safely
    .then(data => {
        if (data.success) {
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("dashboard").classList.remove("hidden");
            loadAll();
        } else {
            alert("Wrong Password");
        }
    })
    .catch(err => alert("Error connecting to server. Make sure you are accessing via server URL.\n" + err));
}

/* ================= CHANGE PASSWORD ================= */
function changePassword() {
    const newPass = document.getElementById("newPassword").value;
    if (!newPass) return;

    fetch("/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert("Password Updated");
        else alert("Failed to update password: " + (data.error || ""));
    })
    .catch(err => alert("Error connecting to server. Make sure you are accessing via server URL.\n" + err));
}

/* ================= OTHER EXISTING FUNCTIONS ================= */
/* No changes made to the rest of script.js to preserve your dashboard functionality */

/* ================= SCROLL TO SECTION ================= */
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

/* ================= INDEX SETTINGS ================= */
function saveIndexSettings() {
    const id = document.getElementById("editSection").value;
    let settings = JSON.parse(localStorage.getItem("indexSettings") || "{}");

    settings[id] = {
        text: document.getElementById("editText").value,
        color: document.getElementById("editColor").value,
        font: document.getElementById("editFont").value,
        align: document.getElementById("editAlign").value,
        box: document.getElementById("editBox").checked,
        boxColor: document.getElementById("editBoxColor").value + "33",
        radius: document.getElementById("editRadius").value,
        scope: document.getElementById("editScope").value
    };

    localStorage.setItem("indexSettings", JSON.stringify(settings));
    alert("Saved");
}

/* ================= HOF ================= */
function addHOF() {
    const file = document.getElementById("hofUpload").files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload-image', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            let hof = JSON.parse(localStorage.getItem("hof") || "[]");
            hof.push(data.path);
            localStorage.setItem("hof", JSON.stringify(hof));
            loadHOF();
        })
        .catch(err => alert('Upload failed: ' + err));
}

function loadHOF() {
    let data = JSON.parse(localStorage.getItem("hof") || "[]");
    let html = "";
    data.forEach((img, i) => {
        html += `<div><img src="${img}" width="150"><button onclick="deleteHOF(${i})">Delete</button></div>`;
    });
    if (document.getElementById("hofList")) document.getElementById("hofList").innerHTML = html;

    if (document.getElementById("hofContainer")) {
        let hofHTML = "";
        data.forEach(img => { hofHTML += `<div class="card"><img src="${img}"></div>`; });
        document.getElementById("hofContainer").innerHTML = hofHTML;
    }
}

function deleteHOF(i) {
    let data = JSON.parse(localStorage.getItem("hof"));
    data.splice(i, 1);
    localStorage.setItem("hof", JSON.stringify(data));
    loadHOF();
}

/* ================= EVENTS ================= */
function addEvent() {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const imgFile = document.getElementById("eventImageFile").files[0];
    const broFile = document.getElementById("brochureFile").files[0];

    const reader1 = new FileReader();
    reader1.onload = e1 => {
        const reader2 = new FileReader();
        reader2.onload = e2 => {
            let data = JSON.parse(localStorage.getItem("events") || "[]");
            data.push({ title, date, image: e1.target.result, brochure: e2.target.result });
            localStorage.setItem("events", JSON.stringify(data));
            loadEvents();
        };
        if (broFile) reader2.readAsDataURL(broFile);
        else reader2.onload({ target: { result: "" } });
    };
    if (imgFile) reader1.readAsDataURL(imgFile);
}

function loadEvents() {
    let data = JSON.parse(localStorage.getItem("events") || "[]");
    let html = "";
    data.forEach((e, i) => { html += `<div>${e.title} (${e.date}) <button onclick="deleteEvent(${i})">Delete</button></div>`; });
    if (document.getElementById("eventList")) document.getElementById("eventList").innerHTML = html;
}

function deleteEvent(i) {
    let data = JSON.parse(localStorage.getItem("events"));
    data.splice(i, 1);
    localStorage.setItem("events", JSON.stringify(data));
    loadEvents();
}

/* ================= TESTIMONIALS ================= */
function addTestimonial() {
    const name = document.getElementById("testimonialName").value;
    const text = document.getElementById("testimonialText").value;
    if (!name || !text) return;
    let data = JSON.parse(localStorage.getItem("testimonials") || "[]");
    data.push({ name, text });
    localStorage.setItem("testimonials", JSON.stringify(data));
    loadTestimonials();
}

function loadTestimonials() {
    let data = JSON.parse(localStorage.getItem("testimonials") || "[]");
    let html = "";
    data.forEach((t, i) => { html += `<div>${t.name}<button onclick="deleteTestimonial(${i})">Delete</button></div>`; });
    if (document.getElementById("testimonialList")) document.getElementById("testimonialList").innerHTML = html;

    if (document.getElementById("testimonialContainer")) {
        let tHTML = "";
        data.forEach(t => { tHTML += `<div class="card"><h3>${t.name}</h3><p>${t.text}</p></div>`; });
        document.getElementById("testimonialContainer").innerHTML = tHTML;
    }
}

/* ================= SOCIAL ================= */
function addSocialLink() {
    const name = document.getElementById("socialName").value;
    const link = document.getElementById("socialLink").value;
    if (!name || !link) return;
    let data = JSON.parse(localStorage.getItem("socialLinks") || "[]");
    data.push({ name, link });
    localStorage.setItem("socialLinks", JSON.stringify(data));
    loadSocialLinks();
}

function loadSocialLinks() {
    let data = JSON.parse(localStorage.getItem("socialLinks") || "[]");
    let html = "";
    data.forEach((s, i) => { html += `<div>${s.name}<button onclick="deleteSocial(${i})">Delete</button></div>`; });
    if (document.getElementById("socialList")) document.getElementById("socialList").innerHTML = html;

    if (document.getElementById("socialContainer")) {
        let sHTML = "";
        data.forEach(s => { sHTML += `<div><a class="socialLink" href="${s.link}" target="_blank">${s.name}</a></div>`; });
        document.getElementById("socialContainer").innerHTML = sHTML;
    }
}

/* ================= QR ================= */
function saveQR() {
    const file = document.getElementById("qrUpload").files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload-image', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("donationQR", data.path);
            loadQRPreview();
        })
        .catch(err => alert('Upload failed: ' + err));
}

function loadQRPreview() {
    const qr = localStorage.getItem("donationQR");
    if (document.getElementById("qrPreview") && qr)
        document.getElementById("qrPreview").innerHTML = `<img src="${qr}" width="120">`;

    if (document.getElementById("donationQR") && qr)
        document.getElementById("donationQR").src = qr;
}

/* ================= LOAD ALL ================= */
function loadAll() {
    loadHOF();
    loadEvents();
    loadTestimonials();
    loadSocialLinks();
    loadQRPreview();
}

/* ================= SECTION NAVIGATION ================= */
const sections = document.querySelectorAll('.section');

function showSection(id) {
    sections.forEach(sec => {
        if (sec.id === id) sec.classList.add('active');
        else sec.classList.remove('active');
    });

    document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('onclick').match(/'(\w+)'/)[1];
        showSection(targetId);
    });
});

window.addEventListener('load', () => {
    showSection('indexSettings');
});
