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
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

function montrePwodwi() {
    // Tcheke si nou gen pwodwi nan memwa a deja
const kach = localStorage.getItem('lisKach');
if (kach) {
    const doneKach = JSON.parse(kach);
    console.log("M ap montre sa k nan memwa a vit!");
    // Isit la nou ka kòmanse desine paj la
}
    var bwat = document.getElementById('lis-pwodwi-dinamik');
    if (!bwat) return;

    // Pon an kòmanse isit la
    const lisRef = ref(db, 'lisPwodwi');
    onValue(lisRef, (snapshot) => {
        const doneFirebase = snapshot.val();
        // 2. Sere kopi a nan memwa a (Liy 61 konsa)
localStorage.setItem('lisKach', JSON.stringify(doneFirebase));
        var kontni = "";

        if (doneFirebase) {
            // Nou boukle nan done Firebase yo
            Object.keys(doneFirebase).forEach((key) => {
                var p = doneFirebase[key];
                
                // Nou asire p.id la match ak ID Firebase la pou fonksyon ou yo pa pèdi
                p.id = key; 

                // --- MEN KOD OU A EGZAKTEMAN JAN L TE YE A ---
                var tiFotoAtik = '<div class="ti-foto-galeri">';
                p.foto.slice(0, 4).forEach(function(f) {
                    tiFotoAtik += '<img src="' + f + '" onclick="chanjeFoto(\'' + p.id + '\', \'' + f + '\', false)">';
                });
                tiFotoAtik += '</div>';

                kontni += '<div class="pwodwi-card">' +
                    '<div class="ti-flech-v" onclick="toggleDeskripsyon(\'' + p.id + '\')">▼</div>' +
                    
                    '<div class="deskrip-overlay" id="rido-' + p.id + '" onclick="toggleDeskripsyon(\'' + p.id + '\')">' +
                        '<h4 style="color:gold;">DESKRIPSYON</h4>' +
                        '<p>' + (p.deskripsyon || "Enfo disponib byento.") + '</p>' +
                        '<p style="font-size:0.7rem; margin-top:10px;">(Teke pou fèmen)</p>' +
                    '</div>' +

                    '<img class="foto-prensipal" id="foto-atik-' + p.id + '" src="' + p.foto[0] + '" onclick="louvriModal(\'' + p.id + '\')">' +
                    tiFotoAtik + 
                    '<div class="enfos-pwodwi">' +
                        '<h3 class="non-pwodwi">' + p.non + '</h3>' +
                        '<div class="pri-seksyon">' +
                            '<span class="pri-rabe">$' + p.pri + '</span>' +
                            '<span class="pri-original">$' + (p.pri * 1.2).toFixed(0) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="kontene-like" onclick="event.stopPropagation(); likePwodwi(\'' + p.id + '\')">' +
                        '<span class="ti-ke" id="ke-' + p.id + '">❤</span>' +
                        '<span class="chif-like" id="count-' + p.id + '">' + (p.likes || 0) + '</span>' +
                    '</div>' +
                '</div>';
                // --- FIN KOD OU A ---
            });

            bwat.innerHTML = kontni;
        }
    });
}

// Rele fonksyon an
montrePwodwi();

// Mete sa yo apre tout kòd montrePwodwi a fini nèt
window.chanjeFoto = chanjeFoto;
window.toggleDeskripsyon = toggleDeskripsyon;

// 4. PANYE (MATCH AK ID panye-badge AK panye-fiks)
function updateBadge() {
    var panyeLis = JSON.parse(localStorage.getItem('panye')) || [];
    var badge = document.getElementById('panye-badge');
    if (badge) {
        badge.innerText = panyeLis.length;
        badge.style.display = panyeLis.length > 0 ? 'block' : 'none';
        
        // Lojik pou l ponpe
        badge.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.5)' },
            { transform: 'scale(1)' }
        ], { duration: 300 });
    }
}

function ouvriPanye() {
    var panyeLis = JSON.parse(localStorage.getItem('panye')) || [];
    var modal = document.getElementById('modal-panye');
    var lisDiv = document.getElementById('lis-panye');
    var totalDiv = document.getElementById('total-live');
    var html = "";
    var total = 0;

    if (panyeLis.length === 0) {
        html = '<p style="text-align:center; color:#888; padding:20px;">Panye a vid.</p>';
    } else {
        panyeLis.forEach(function(item, index) {
            html += '<div style="display:flex; justify-content:space-between; align-items:center; color:white; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">' +
                    '<div><b>' + item.non + '</b><br><span style="color:gold;">$' + item.pri + '</span></div>' +
                    '<i class="fas fa-trash" onclick="retireNanPanye(' + index + ')" style="color:red; cursor:pointer; font-size:18px;"></i>' +
                    '</div>';
            total += parseFloat(item.pri);
        });
    }

    if (lisDiv) lisDiv.innerHTML = html;
    if (totalDiv) totalDiv.innerText = '$' + total.toFixed(2);
    if (modal) modal.style.display = 'flex';
}


function retireNanPanye(index) {
    var panyeLis = JSON.parse(localStorage.getItem('panye')) || [];
    panyeLis.splice(index, 1); // Sa retire sèlman atik ou klike a
    localStorage.setItem('panye', JSON.stringify(panyeLis));
    
    updateBadge(); // Badge la ap desann
    ouvriPanye();  // Panye a ap rafrechi pou montre l efase
}

// 5. sa ki voye nan paj ki moutre non non pwodwi ak enfo yo
window.louvriModal = (id) => {
    window.location.href = 'pwodwi.html?id=' + id;
};
// 6. FÈMEN (MATCH AK NON FONKSYON KI NAN HTML LA)
function fèmènModal() { document.getElementById('modal-pwodwi').style.display = 'none'; }
function fèmenPanye() { document.getElementById('modal-panye').style.display = 'none'; }

function voyeWhatsAppPro() {
    var panye = JSON.parse(localStorage.getItem('panye')) || [];
    if(panye.length === 0) return;
    var mesaj = "Mwen ta renmen kòmande:\n";
    panye.forEach(function(i) { mesaj += "- " + i.non + " ($" + i.pri + ")\n"; });
    window.open("https://wa.me/50937860226?text=" + encodeURIComponent(mesaj));
}

// LANSE
montrePwodwi();
updateBadge();

function ajouteNanPanye(non, pri) {
    // 1. Pran sa k te deja nan panye a
    var panye = JSON.parse(localStorage.getItem('panye')) || [];
    
    // 2. Ajoute nouvo pwodwi a
    panye.push({ non: non, pri: pri });
    
    // 3. Sove l tounen nan memwa a
    localStorage.setItem('panye', JSON.stringify(panye));
    
    // 4. Mizajou ti nimewo ki sou panye a (Badge la)
    updateBadge();
    
    // 5. Bay yon ti mesaj konfimasyon
    alert(non + " ajoute nan panye w!");
}

window.likePwodwi = function(id) {
    let keElem = document.getElementById('ke-' + id);
    let countElem = document.getElementById('count-' + id);
    let currentLikes = parseInt(countElem.innerText) || 0;
    
    // 1. Nou tcheke si moun nan poko like li (IF la obligatwa)
    if (!keElem.classList.contains('active')) {
        // Mete l wouj sou ekran an
        keElem.classList.add('active');
        keElem.style.color = '#ff4d4d'; 
        let nouvoChif = currentLikes + 1;
        countElem.innerText = nouvoChif;

        // Sere nan memwa telefòn nan
        localStorage.setItem('like-' + id, 'wi');

        // Voye l nan Firebase (Koneksyon an nèt)
        update(ref(db, 'lisPwodwi/' + id), { 
            likes: nouvoChif 
        }).catch(err => console.error("Erè Firebase:", err));

    } else {
        // 2. Si l vle retire like la
        keElem.classList.remove('active');
        keElem.style.color = '#666'; 
        let nouvoChif = currentLikes > 0 ? currentLikes - 1 : 0;
        countElem.innerText = nouvoChif;
        
        localStorage.removeItem('like-' + id);
        
        update(ref(db, 'lisPwodwi/' + id), { 
            likes: nouvoChif 
        });
    }
};