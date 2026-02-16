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

function saveToServer() {
    fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData)
    });
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

/* ================= LOAD ALL FROM SERVER ================= */
function loadAll() {
    fetch("/data")
        .then(res => res.json())
        .then(data => {
            siteData = data;

            loadHOF();
            loadEvents();
            loadTestimonials();
            loadSocialLinks();
            loadQRPreview();
        });
}

/* ================= INDEX SETTINGS ================= */
function saveIndexSettings() {
    const id = document.getElementById("editSection").value;

    siteData.indexSettings[id] = {
        text: editText.value,
        color: editColor.value,
        font: editFont.value,
        align: editAlign.value,
        box: editBox.checked,
        boxColor: editBoxColor.value + "33",
        radius: editRadius.value,
        scope: editScope.value
    };

    saveToServer();
    alert("Saved");
}

/* ================= HOF ================= */
function addHOF() {
    const file = document.getElementById("hofUpload").files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    fetch("/upload-image", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
        siteData.hof.push(data.path);
        saveToServer();
        loadHOF();
    });
}

function loadHOF() {
    let html = "";
    siteData.hof.forEach((img, i) => {
        html += `<div><img src="${img}" width="150"><button onclick="deleteHOF(${i})">Delete</button></div>`;
    });

    if (hofList) hofList.innerHTML = html;
}

function deleteHOF(i) {
    siteData.hof.splice(i, 1);
    saveToServer();
    loadHOF();
}

/* ================= EVENTS ================= */
function addEvent() {
    const title = eventTitle.value;
    const date = eventDate.value;
    const imgFile = eventImageFile.files[0];
    const broFile = brochureFile.files[0];

    const reader1 = new FileReader();
    reader1.onload = e1 => {
        const reader2 = new FileReader();
        reader2.onload = e2 => {
            siteData.events.push({
                title,
                date,
                image: e1.target.result,
                brochure: e2.target.result
            });
            saveToServer();
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
    if (eventList) eventList.innerHTML = html;
}

function deleteEvent(i) {
    siteData.events.splice(i, 1);
    saveToServer();
    loadEvents();
}

/* ================= TESTIMONIALS ================= */
function addTestimonial() {
    const name = testimonialName.value;
    const text = testimonialText.value;
    if (!name || !text) return;

    siteData.testimonials.push({ name, text });
    saveToServer();
    loadTestimonials();
}

function loadTestimonials() {
    let html = "";
    siteData.testimonials.forEach((t, i) => {
        html += `<div>${t.name}<button onclick="deleteTestimonial(${i})">Delete</button></div>`;
    });
    if (testimonialList) testimonialList.innerHTML = html;
}

function deleteTestimonial(i) {
    siteData.testimonials.splice(i, 1);
    saveToServer();
    loadTestimonials();
}

/* ================= SOCIAL ================= */
function addSocialLink() {
    const name = socialName.value;
    const link = socialLink.value;
    if (!name || !link) return;

    siteData.socialLinks.push({ name, link });
    saveToServer();
    loadSocialLinks();
}

function loadSocialLinks() {
    let html = "";
    siteData.socialLinks.forEach((s, i) => {
        html += `<div>${s.name}<button onclick="deleteSocial(${i})">Delete</button></div>`;
    });
    if (socialList) socialList.innerHTML = html;
}

function deleteSocial(i) {
    siteData.socialLinks.splice(i, 1);
    saveToServer();
    loadSocialLinks();
}

/* ================= QR ================= */
function saveQR() {
    const file = qrUpload.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    fetch("/upload-image", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
        siteData.donationQR = data.path;
        saveToServer();
        loadQRPreview();
    });
}

function loadQRPreview() {
    const qr = siteData.donationQR;
    if (qrPreview && qr) qrPreview.innerHTML = `<img src="${qr}" width="120">`;
}

/* ================= NAVIGATION ================= */
/* ================= SECTION NAVIGATION ================= */

window.addEventListener('load', () => {

    const sections = document.querySelectorAll('.section');

    function showSection(id) {
        sections.forEach(sec => {
            if (sec.id === id) sec.classList.add('active');
            else sec.classList.remove('active');
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
