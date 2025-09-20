let jadwal = [];
let tugas = [];
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
function tampilkanDashboard() {
  let today = new Date();
  let hariList = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  let hariIni = hariList[today.getDay()];

  let jadwalHariIni = jadwal.filter(j => j[1].toLowerCase() === hariIni.toLowerCase());

  document.getElementById("jadwal-hari-ini").innerHTML = "<h3>Jadwal Hari " + hariIni + "</h3>" +
    (jadwalHariIni.length > 0 ? jadwalHariIni.map(j => `<p>${j[0]} - ${j[2]} @${j[3]} (${j[4]})</p>`).join("") : "<p>Tidak ada kuliah</p>");

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
loadData();
tampilkanDashboard();