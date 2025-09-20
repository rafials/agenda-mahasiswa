let jadwal = [];
let tugas = [];

// ------------------ Fungsi Tambah Jadwal ------------------
function tambahJadwal() {
  let matkul = document.getElementById("matkul").value;
  let hari = document.getElementById("hari").value;
  let jam = document.getElementById("jam").value;
  let ruangan = document.getElementById("ruangan").value;
  let dosen = document.getElementById("dosen").value;

  if (matkul && hari && jam) {
    jadwal.push([matkul, hari, jam, ruangan, dosen, 3]); // 3 = SKS default
    simpanData();
    tampilkanDashboard();
  } else {
    alert("Isi semua data jadwal!");
  }
}

// ------------------ Fungsi Tambah Tugas ------------------
function tambahTugas() {
  let namaTugas = document.getElementById("tugas").value;
  let deadline = document.getElementById("deadline").value;

  if (namaTugas && deadline) {
    tugas.push({ nama: namaTugas, deadline: deadline, selesai: false });
    simpanData();
    tampilkanDashboard();
  } else {
    alert("Isi semua data tugas!");
  }
}

// ------------------ Local Storage ------------------
function simpanData() {
  localStorage.setItem("jadwal", JSON.stringify(jadwal));
  localStorage.setItem("tugas", JSON.stringify(tugas));
}

function loadData() {
  if (localStorage.getItem("jadwal")) {
    jadwal = JSON.parse(localStorage.getItem("jadwal"));
  }
  if (localStorage.getItem("tugas")) {
    tugas = JSON.parse(localStorage.getItem("tugas"));
  }
}

// ------------------ Dashboard Hari Ini ------------------
function tampilkanDashboard() {
  let today = new Date();
  let hariList = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  let hariIni = hariList[today.getDay()];

  let jadwalHariIni = jadwal.filter(j => j[1].toLowerCase() === hariIni.toLowerCase());

  document.getElementById("jadwal-hari-ini").innerHTML = "<h3>Jadwal Hari " + hariIni + "</h3>" +
    (jadwalHariIni.length > 0 ? jadwalHariIni.map(j => 
      `<p>${j[0]} - ${j[2]} @${j[3]} (${j[4]})</p>`).join("") : "<p>Tidak ada kuliah</p>");

  let tugasBelum = tugas.filter(t => !t.selesai);
  document.getElementById("tugas-belum").innerHTML = "<h3>Tugas Belum Selesai</h3>" +
    (tugasBelum.length > 0 ? tugasBelum.map(t => `<p>${t.nama} (Deadline: ${t.deadline})</p>`).join("") : "<p>Tidak ada tugas</p>");

  let totalSKS = jadwal.reduce((acc, j) => acc + j[5], 0);
  document.getElementById("total-sks").innerHTML = "<h3>Total SKS: " + totalSKS + "</h3>";

  let alertBox = "";
  tugasBelum.forEach(t => {
    let d = new Date(t.deadline);
    let selisih = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    if (selisih <= 2) {
      alertBox += `<p style="color:red">⚠️ Deadline tugas ${t.nama} tinggal ${selisih} hari!</p>`;
    }
  });
  document.getElementById("alert").innerHTML = alertBox;
}

// ------------------ Fitur Jadwal Mingguan ------------------
function openModal() {
  const hariList = ["Senin","Selasa","Rabu","Kamis","Jumat"];
  const today = new Date();
  const hariIni = hariList[(today.getDay() + 6) % 7]; // konversi biar cocok

  let jadwalHTML = "<h2>📅 Jadwal Mingguan</h2>";

  hariList.forEach(hari => {
    jadwalHTML += `<h3 style="color:#b388ff;">${hari}</h3>`;
    let jadwalHari = jadwal.filter(j => j[1].toLowerCase() === hari.toLowerCase());
    if (jadwalHari.length === 0) {
      jadwalHTML += `<p style="color:gray;">Tidak ada kuliah</p>`;
    } else {
      jadwalHari.forEach(j => {
        jadwalHTML += `
          <div class="jadwal-card ${hari === hariIni ? 'today' : ''}">
            <b>${j[0]}</b><br>
            ${j[2]} | ${j[3]}<br>
            <small>${j[4]}</small>
          </div>
        `;
      });
    }
  });

  document.getElementById("jadwal-hari-ini").innerHTML = jadwalHTML;
}

// ------------------ Quotes Motivasi ------------------
const quotes = [
  "Study smarter, not harder.",
  "Small progress is still progress.",
  "Consistency beats motivation.",
  "Knowledge is power.",
  "One day at a time."
];
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("quote").innerText = quotes[Math.floor(Math.random() * quotes.length)];
});

// ------------------ Init ------------------
loadData();
tampilkanDashboard();
