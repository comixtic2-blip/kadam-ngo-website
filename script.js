/* ================= MASTER PASSWORD ================= */
const MASTER_PASSWORD = "hjosxybhi#51657865232144";

/* ================= GLOBAL SITE DATA ================= */
let siteData = {
    hof: [],
    events: [],
    testimonials: [],
    socialLinks: [],
    donationQR: "",
    indexSettings: {}
};

/* ================= SERVER HELPERS ================= */
async function saveToServer() {
    await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData)
    });
}

async function loadFromServer() {
    const res = await fetch("/data");
    siteData = await res.json();
}

/* ================= LOGIN ================= */
function login() {
    const pass = document.getElementById("adminPass").value;

    if (pass === MASTER_PASSWORD) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("dashboard").classList.remove("hidden");
        loadAll();
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("dashboard").classList.remove("hidden");
            loadAll();
        } else {
            alert("Wrong Password");
        }
    })
    .catch(err => alert("Server error " + err));
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
    .then(data => alert(data.success ? "Password Updated" : "Failed"));
}

/* ================= LOAD ALL ================= */
async function loadAll() {
    await loadFromServer();
    loadHOF();
    loadEvents();
    loadTestimonials();
    loadSocialLinks();
    loadQRPreview();
}

/* ================= INDEX SETTINGS ================= */
async function saveIndexSettings() {
    const id = document.getElementById("editSection").value;

    siteData.indexSettings[id] = {
        text: document.getElementById("editText").value,
        color: document.getElementById("editColor").value,
        font: document.getElementById("editFont").value,
        align: document.getElementById("editAlign").value,
        box: document.getElementById("editBox").checked,
        boxColor: document.getElementById("editBoxColor").value + "33",
        radius: document.getElementById("editRadius").value,
        scope: document.getElementById("editScope").value
    };

    await saveToServer();
    alert("Saved");
}

/* ================= HOF ================= */
async function addHOF() {
    const file = document.getElementById("hofUpload").files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/upload-image", { method: "POST", body: formData });
    const data = await res.json();

    siteData.hof.push(data.path);
    await saveToServer();
    loadHOF();
}

function loadHOF() {
    let html = "";
    siteData.hof.forEach((img, i) => {
        html += `<div><img src="${img}" width="150"><button onclick="deleteHOF(${i})">Delete</button></div>`;
    });

    const el = document.getElementById("hofList");
    if (el) el.innerHTML = html;
}

async function deleteHOF(i) {
    siteData.hof.splice(i, 1);
    await saveToServer();
    loadHOF();
}

/* ================= EVENTS ================= */
async function addEvent() {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const imgFile = document.getElementById("eventImageFile").files[0];
    const broFile = document.getElementById("brochureFile").files[0];

    const reader1 = new FileReader();
    reader1.onload = e1 => {
        const reader2 = new FileReader();
        reader2.onload = async e2 => {
            siteData.events.push({
                title,
                date,
                image: e1.target.result,
                brochure: e2.target.result
            });
            await saveToServer();
            loadEvents();
        };
        broFile ? reader2.readAsDataURL(broFile) : reader2.onload({ target: { result: "" } });
    };
    imgFile && reader1.readAsDataURL(imgFile);
}

function loadEvents() {
    let html = "";
    siteData.events.forEach((e, i) => {
        html += `<div>${e.title} (${e.date}) <button onclick="deleteEvent(${i})">Delete</button></div>`;
    });
    const el = document.getElementById("eventList");
    if (el) el.innerHTML = html;
}

async function deleteEvent(i) {
    siteData.events.splice(i, 1);
    await saveToServer();
    loadEvents();
}

/* ================= TESTIMONIALS ================= */
async function addTestimonial() {
    const name = document.getElementById("testimonialName").value;
    const text = document.getElementById("testimonialText").value;
    if (!name || !text) return;

    siteData.testimonials.push({ name, text });
    await saveToServer();
    loadTestimonials();
}

function loadTestimonials() {
    let html = "";
    siteData.testimonials.forEach((t, i) => {
        html += `<div>${t.name}<button onclick="deleteTestimonial(${i})">Delete</button></div>`;
    });
    const el = document.getElementById("testimonialList");
    if (el) el.innerHTML = html;
}

async function deleteTestimonial(i) {
    siteData.testimonials.splice(i, 1);
    await saveToServer();
    loadTestimonials();
}

/* ================= SOCIAL ================= */
async function addSocialLink() {
    const name = document.getElementById("socialName").value;
    const link = document.getElementById("socialLink").value;
    if (!name || !link) return;

    siteData.socialLinks.push({ name, link });
    await saveToServer();
    loadSocialLinks();
}

function loadSocialLinks() {
    let html = "";
    siteData.socialLinks.forEach((s, i) => {
        html += `<div>${s.name}<button onclick="deleteSocial(${i})">Delete</button></div>`;
    });
    const el = document.getElementById("socialList");
    if (el) el.innerHTML = html;
}

async function deleteSocial(i) {
    siteData.socialLinks.splice(i, 1);
    await saveToServer();
    loadSocialLinks();
}

/* ================= QR ================= */
async function saveQR() {
    const file = document.getElementById("qrUpload").files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/upload-image", { method: "POST", body: formData });
    const data = await res.json();

    siteData.donationQR = data.path;
    await saveToServer();
    loadQRPreview();
}

function loadQRPreview() {
    const qr = siteData.donationQR;
    const el = document.getElementById("qrPreview");
    if (el && qr) el.innerHTML = `<img src="${qr}" width="120">`;
}

/* ================= NAVIGATION ================= */
window.addEventListener('load', () => {

    const sections = document.querySelectorAll('.section');

    function showSection(id) {
        sections.forEach(sec => {
            sec.classList.toggle('active', sec.id === id);
        });

        document.querySelector('.main-content').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('onclick').match(/'(\w+)'/)[1];
            showSection(targetId);
        });
    });

    showSection('indexSettings');
});



