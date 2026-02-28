// 1. SIDEBAR (MATCH AK HTML OU)
var sidebar = document.getElementById('sidebar');
var btnTout = document.getElementById('btn-tout');
var btnClose = document.getElementById('btn-close');

if(btnTout) { btnTout.onclick = function() { sidebar.classList.add('active'); }; }
if(btnClose) { btnClose.onclick = function() { sidebar.classList.remove('active'); }; }

// 2. SLIDER BANNER (MATCH AK KLAS .slide OU A)
var currentSlide = 0;
var slides = document.querySelectorAll('.slide');
function nextSlide() {
    if(slides.length === 0) return;
    for(var i=0; i<slides.length; i++) { slides[i].classList.remove('active'); }
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
if(slides.length > 0) { setInterval(nextSlide, 5000); }


function chanjeFoto(id, sous, eskeSeModal) {
    var idFoto = eskeSeModal ? 'gwo-foto-modal' : 'foto-atik-' + id;
    var el = document.getElementById(idFoto);
    if(el) el.src = sous;
}

// Fonksyon pou louvri oswa fèmen rido deskripsyon an
function toggleDeskripsyon(id) {
    var rido = document.getElementById('rido-' + id);
    if (rido.classList.contains('active')) {
        rido.classList.remove('active');
    } else {
        rido.classList.add('active');
    }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPX2vLomJjA5taIsBhPz2WrENIcffYsDE",
  authDomain: "haizones.firebaseapp.com",
  databaseURL: "https://haizones-default-rtdb.firebaseio.com",
  projectId: "haizones",
  storageBucket: "haizones.appspot.com",
  messagingSenderId: "100455950809",
  appId: "1:100455950809:web:97fe90e664b26c7abc51c8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FONKSYON POU MONTRE PWODWI (VÈSYON ULTIMATE) ---
function montrePwodwi() {
    var bwat = document.getElementById('lis-pwodwi-dinamik');
    if (!bwat) return;

    // 1. SKELETON: Si memwa a vid (premye fwa), montre bwat gri yo
    const kach = localStorage.getItem('lisKach');
    if (!kach) {
        var skeletons = "";
        for (var i = 0; i < 6; i++) { skeletons += '<div class="skeleton-card"></div>'; }
        bwat.innerHTML = skeletons;
    } else {
        // 2. CACHE: Afiche yo IEDYATMAN
        desinePwodwiHTML(JSON.parse(kach), bwat);
        
        // AJOUTE SA ISIT LA POU L TOUNEN ALA SEGOND
        const pos = localStorage.getItem('scrollPos');
        if (pos) {
            window.scrollTo(0, parseInt(pos));
        }
    }

    // 3. FIREBASE: Konekte nan background pou rale sa k nèf
    const lisRef = ref(db, 'lisPwodwi');
    onValue(lisRef, (snapshot) => {
        const doneFirebase = snapshot.val();
        if (doneFirebase) {
            localStorage.setItem('lisKach', JSON.stringify(doneFirebase));
            desinePwodwiHTML(doneFirebase, bwat);
            restoreScroll(); // Pou l toujou nan bon plas la
        }
    });
}

// --- MOTÈ KI DESINE HTML LA (Tout fonksyon ou yo anndan l) ---
function desinePwodwiHTML(doneFirebase, bwat) {
    var kontni = "";
    Object.keys(doneFirebase).forEach((key) => {
        var p = doneFirebase[key];
        p.id = key; 

        let teLike = localStorage.getItem('like-' + p.id);
let koulèKè = teLike ? '#ff4d4d' : '#666';

        var tiFotoAtik = '<div class="ti-foto-galeri">';
        p.foto.slice(0, 4).forEach(function(f) {
            tiFotoAtik += '<img src="' + f + '" loading="lazy" onclick="chanjeFoto(\'' + p.id + '\', \'' + f + '\', false)">';
        });
        tiFotoAtik += '</div>';

        kontni += '<div class="pwodwi-card">' +
            '<div class="ti-flech-v" onclick="toggleDeskripsyon(\'' + p.id + '\')">▼</div>' +
            '<div class="deskrip-overlay" id="rido-' + p.id + '" onclick="toggleDeskripsyon(\'' + p.id + '\')">' +
                '<h4 style="color:gold;">DESKRIPSYON</h4>' +
                '<p>' + (p.deskripsyon || "Enfo disponib byento.") + '</p>' +
                '<p style="font-size:0.7rem; margin-top:10px;">(Teke pou fèmen)</p>' +
            '</div>' +
            '<img class="foto-prensipal" loading="lazy" id="foto-atik-' + p.id + '" src="' + p.foto[0] + '" onclick="louvriModal(\'' + p.id + '\')">' +
            tiFotoAtik + 
            '<div class="enfos-pwodwi">' +
                '<h3 class="non-pwodwi">' + p.non + '</h3>' +
                '<div class="pri-seksyon">' +
                    '<span class="pri-rabe">$' + p.pri + '</span>' +
                    '<span class="pri-original">$' + (p.pri * 1.2).toFixed(0) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="kontene-like" onclick="event.stopPropagation(); likePwodwi(\'' + p.id + '\')">' +
                '<span class="ti-ke" id="ke-' + p.id + '" style="color:' + koulèKè + '">❤</span>' +
                '<span class="chif-like" id="count-' + p.id + '">' + (p.likes || 0) + '</span>' +
            '</div>' +
            '<div class="p-rating">★ ★ ★ ★ ★ <span style="color:#8E8E93; font-size:0.7rem;">5.0</span></div>'+
        '</div>';
    });
    bwat.innerHTML = kontni;
}

window.louvriModal = (id) => {
    // Nou itilize Math.floor pou asire n se yon chif won n ap sove
    const koteMwenYe = Math.floor(window.pageYOffset || document.documentElement.scrollTop || window.scrollY);
    localStorage.setItem('scrollPos', koteMwenYe); 
    
    console.log("Mwen sove pozisyon sa a anvan m ale:", koteMwenYe); // Pou n verifye nan console la
    window.location.href = 'pwodwi.html?id=' + id;
};

function restoreScroll() {
    const pos = localStorage.getItem('scrollPos');
    if (pos && pos !== "0") {
        // Yon ti delè tou piti (50ms) sifi kounye a
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(pos),
                behavior: 'instant' 
            });
            localStorage.removeItem('scrollPos'); // Efase l apre sa nèt
        }, 5); 
    }
}
// LANSE PWOGRAM NAN
montrePwodwi();



// Mete sa yo apre tout kòd montrePwodwi a fini nèt
window.chanjeFoto = chanjeFoto;
window.toggleDeskripsyon = toggleDeskripsyon;
// --- 4. BADGE (Konte KALITE pwodwi: 99 iPhone = 1) ---
function updateBadge() {
    var panyeLis = JSON.parse(localStorage.getItem('panyen')) || [];
    var badge = document.getElementById('panye-badge');
    
    if (badge) {
        // Lojik ou vle a: Nou jis pran "length" lis la (konbe kalite atik)
        var totalKalite = panyeLis.length; 

        badge.innerText = totalKalite;
        badge.style.display = totalKalite > 0 ? 'block' : 'none';

        if (totalKalite > 0) {
            badge.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.5)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });
        }
    }
}

// --- 5. OUVRI PANYEN (Lojik: Non Pwodwi + Kantite) ---
function ouvriPanyen() {
    var panyeLis = JSON.parse(localStorage.getItem('panyen')) || [];
    var modal = document.getElementById('modal-panyen'); 
    var lisHTML = document.getElementById('lis-panyen');
    var totalHTML = document.getElementById('total-live');
    
    var total = 0;
    var kontni = "";

    panyeLis.forEach(function(item, index) {
        var kanti = item.kantite || 1;
        var priLiy = parseFloat(item.pri) * kanti;
        total += priLiy;

        kontni += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #444; padding-bottom:8px; color:white;">
                <div>
                    <p style="margin:0; font-size:14px; font-weight:bold;">${item.non}</p>
                    <p style="margin:0; font-size:13px; color:gold;">Kantite: ${kanti}</p>
                </div>
                <div style="text-align:right;">
                    <p style="margin:0; font-weight:bold;">$${priLiy.toFixed(0)}</p>
                    <button onclick="retireAtik(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:18px;">✕</button>
                </div>
            </div>`;
    });

    if (lisHTML) lisHTML.innerHTML = kontni || "<p style='text-align:center; color:#ccc;'>Ajoue kouya pou w pwofite!</p>";
    if (totalHTML) totalHTML.innerText = "$" + total.toFixed(0);
    if (modal) modal.style.display = 'flex';
}

// --- 6. RETIRE ATIK ---
function retireAtik(index) {
    var panyeLis = JSON.parse(localStorage.getItem('panyen')) || [];
    panyeLis.splice(index, 1);
    localStorage.setItem('panyen', JSON.stringify(panyeLis));
    ouvriPanyen();
    updateBadge();
}

updateBadge();



// 6. FÈMEN (MATCH AK NON FONKSYON KI NAN HTML LA)
function fèmènModal() { document.getElementById('modal-pwodwi').style.display = 'none'; }
function fèmenPanyen() { document.getElementById('modal-panyen').style.display = 'none'; }

function voyeWhatsAppPro() {
    var panyen = JSON.parse(localStorage.getItem('panyen')) || [];
    if (panyen.length === 0) return alert("Panye w la vid!");
    
    // Nou deklare emoji yo kòm varyab pou asire yo vwayaje byen
    var chèk = "\u2705"; // ✅
    var liy = "\u2501";  // ━
    var panyenEmoji = "\u203C"; // ‼ oswa sèvi ak yon senp zetwal *
    var flèch = "\u2570\u2500\u25B6"; // ╰─▶
    
    var mesaj = chèk + "LÒD KONFIMASYON HAIZONE MULTI-SERVICES " + chèk + "\n";
    mesaj += "━━━━━━━━━━━━━━━━━━━\n\n";
    
    var total = 0;
    
    panyen.forEach(function(i) {
        var kanti = i.kantite || 1;
        var priLiy = parseFloat(i.pri) * kanti;
        
        mesaj += "* " + i.non.toUpperCase() + "\n";
        mesaj += "  " + flèch + " Kantite: " + kanti + " - Pri: $" + priLiy.toFixed(0) + "\n";
        
        total += priLiy;
    });
    
    mesaj += "\n━━━━━━━━━━━━━━━━━━━\n";
    mesaj += "TOTAL POU TOUT ATIK YO: $" + total.toFixed(0) + " USD\n";
    mesaj += "━━━━━━━━━━━━━━━━━━━\n\n";
    mesaj += "Haizone Multi-Services/ JHIMMY EDVAR";
    
    var nimewo = "50937860226";
    // Nou itilize encodeURIComponent sou tout mesaj la nèt
    var url = "https://wa.me/" + nimewo + "?text=" + encodeURIComponent(mesaj);
    window.open(url);
}




// Mete fonksyon sa a anba nèt nan script.js ou
window.likePwodwi = function(id) {
    const keElem = document.getElementById('ke-' + id);
    const countElem = document.getElementById('count-' + id);
    const pwodwiRef = ref(db, 'lisPwodwi/' + id + '/likes');
    
    // Tcheke nan memwa telefòn lan si moun nan te deja Like
    const teLike = localStorage.getItem('like-' + id);

    if (!teLike) {
        // --- MOUN NAN POTKO LIKE: N ap ajoute 1 ---
        runTransaction(pwodwiRef, (currentLikes) => {
            return (currentLikes || 0) + 1;
        }).then(() => {
            localStorage.setItem('like-' + id, 'wi'); // Sove nan memwa
            if (keElem) keElem.style.color = '#ff4d4d'; // Kè a vin wouj
        }).catch((err) => console.error("Firebase Like Error:", err));

    } else {
        // --- MOUN NAN TE DEJA LIKE: N ap retire 1 ---
        runTransaction(pwodwiRef, (currentLikes) => {
            return Math.max(0, (currentLikes || 0) - 1); // Pa janm desann pi ba pase 0
        }).then(() => {
            localStorage.removeItem('like-' + id); // Retire nan memwa
            if (keElem) keElem.style.color = '#666'; // Kè a tounen gri
        }).catch((err) => console.error("Firebase Unlike Error:", err));
    }
};


// 1. FONKSYON POU OUVRI/FÈMEN TI RIDO YO (ACCORDION)
window.toggleSub = function(id) {
    const el = document.getElementById(id);
    const toutSub = document.querySelectorAll('.sub-menu');
    const trigger = el.parentElement.querySelector('.menu-trigger');
    const toutTriggers = document.querySelectorAll('.menu-trigger');
    
    // Si l te deja ouvri, nou jis fèmen l
    if (el.classList.contains('open')) {
        el.classList.remove('open');
        trigger.classList.remove('active-trigger');
        return;
    }

    // Fèmen tout lòt yo pou sa rete klasik
    toutSub.forEach(sub => sub.classList.remove('open'));
    toutTriggers.forEach(trig => trig.classList.remove('active-trigger'));
    
    // Ouvri sa nou klike a
    el.classList.add('open');
    trigger.classList.add('active-trigger');
};

// 2. MOTÈ FILTRE A (Pou rale pwodwi nan Kach la)
window.filtrePwodwi = function(moKle) {
    const bwat = document.getElementById('lis-pwodwi-dinamik');
    const kachRaw = localStorage.getItem('lisKach');
    
    if (!kachRaw) {
        console.log("Kach la vid baz!");
        return;
    }

    const kach = JSON.parse(kachRaw);
    const doneFiltre = {};

    Object.keys(kach).forEach(key => {
        const p = kach[key];
        // Nou tcheke si mo a nan Non, Kategori, oswa Tags
        const nonMatches = p.non.toLowerCase().includes(moKle.toLowerCase());
        const katMatches = p.kategori && p.kategori.toLowerCase().includes(moKle.toLowerCase());
        
        if (nonMatches || katMatches) {
            doneFiltre[key] = p;
        }
    });

    // Sèvi ak fonksyon ki desine a ki nan script ou a deja
    if (typeof desinePwodwiHTML === "function") {
        desinePwodwiHTML(doneFiltre, bwat);
    }
    
    // Fèmen sidebar a otomatikman apre klik la
    fèmenSidebar();
};

// 3. FONKSYON POU FÈMEN SIDEBAR A NÈT
window.fèmenSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay-sidebar');
    if(sidebar) sidebar.classList.remove('active');
    if(overlay) overlay.style.display = 'none';
};

window.montreToutPwodwi = function() {
    const bwat = document.getElementById('lis-pwodwi-dinamik');
    const kachRaw = localStorage.getItem('lisKach');
    
    if (kachRaw) {
        const kach = JSON.parse(kachRaw);
        desinePwodwiHTML(kach, bwat); // Li remete tout pwodwi yo nèt
    }
    
    fèmenSidebar(); // Li fèmen meni an pou kliyan an ka wè rezilta a
};


// Sa a debloke bouton an pou l ka klike
window.ouvriPanyen = ouvriPanyen;
window.fèmenPanyen = fèmenPanyen;
window.retireAtik = retireAtik;
window.voyeWhatsAppPro = voyeWhatsAppPro;