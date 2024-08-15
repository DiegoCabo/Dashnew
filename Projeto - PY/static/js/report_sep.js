document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // Your code to run since DOM is loaded and ready
});

var data = new Date();
var dia_start = data.getDate();
var dia_end = data.getDate() + 1;
var mes = data.getMonth() + 1;
var year = data.getFullYear();
//var data_start = year + "-" + mes + "-" + dia_start;
//var data_end = year + "-" + mes + "-" + dia_end;

//utilizando api RETENÇÃO

async function fazGET() {
  const myHeaders = new Headers();
  myHeaders.append("token", "91440272-3f9c-45b3-8177-b2dd49c49920");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=39&queue_group_ids=67&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total").innerHTML = data.data[48].calls;
  document.getElementById("pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas").innerHTML = data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;
  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "00") +
    ":" +
    minutes.toString().padStart(2, "00") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "00"));

  document.getElementById("tme").innerHTML = timeString;

  var muda_cor1 = data.data[48].answered_percent;
  if (muda_cor1 > 90) {
    var list1 = document.getElementById("pca").classList;
    list1.remove("ret_pca");
    list1.add("cor_verde");
  } else if (muda_cor1 >= 80) {
    var list1 = document.getElementById("pca").classList;
    list1.remove("ret_pca");
    list1.add("cor_laranja");
  } else {
    var list1 = document.getElementById("pca").classList;
    list1.remove("ret_pca");
    list1.add("cor_vermelho");
  }
}
//===============================================================================

//utilizando api SAC CT

async function fazGET_sac_ct() {
  const myHeaders = new Headers();
  myHeaders.append("token", "c6f2a970-ed25-41e5-8edc-0021f68ff721");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=32&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_ct").innerHTML = data.data[48].calls;
  document.getElementById("pca_ct").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_ct").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_ct").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_ct").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_ct").innerHTML = timeString;

  var muda_cor2 = data.data[48].answered_percent;
  if (muda_cor2 > 90) {
    var list = document.getElementById("pca_ct").classList;
    list.remove("ret_pca");
    list.add("cor_verde");
  } else if (muda_cor2 >= 80) {
    var list = document.getElementById("pca_ct").classList;
    list.remove("ret_pca");
    list.add("cor_laranja");
  } else {
    var list = document.getElementById("pca_ct").classList;
    list.remove("ret_pca");
    list.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var pca = [];
  var head = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }
  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "SAC RN",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150, 0.5)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - SAC RN",
  };
  Plotly.newPlot("sacrn", bd, layout, { scrollZoom: true });

  //==================================TME SAC RN=============================================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - SAC RN",
  };
  Plotly.newPlot("sacrn_tm", bd, layout, { scrollZoom: true });
}

//===============================================================================

//utilizando api SAC CE

async function fazGET_sac_ce() {
  const myHeaders = new Headers();
  myHeaders.append("token", "81caf919-b8e1-47af-bad6-dd1b5b5bc2b1");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=46&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_ce").innerHTML = data.data[48].calls;
  document.getElementById("pca_ce").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_ce").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_ce").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;
  document.getElementsByClassName;
  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_ce").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_ce").innerHTML = timeString;

  var muda_cor3 = data.data[48].answered_percent;
  if (muda_cor3 > 90) {
    var list2 = document.getElementById("pca_ce").classList;
    list2.remove("ret_pca");
    list2.add("cor_verde");
  } else if (muda_cor3 >= 80) {
    var list2 = document.getElementById("pca_ce").classList;
    list2.remove("ret_pca");
    list2.add("cor_laranja");
  } else {
    var list2 = document.getElementById("pca_ce").classList;
    list2.remove("ret_pca");
    list2.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var pca = [];
  var head = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }
  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "SAC CE",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - SAC CE",
  };
  Plotly.newPlot("sacce", bd, layout, { scrollZoom: true });
  //==================================TME+TMA SAC CE=============================================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - SAC CE",
  };
  Plotly.newPlot("sacce_tm", bd, layout, { scrollZoom: true });
}
//===============================================================================

//utilizando api SAC SUD

async function fazGET_sac_sud() {
  const myHeaders = new Headers();
  myHeaders.append("token", "8d4f1854-0f49-4723-96cc-a7e8fff267fb");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=28&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_sud").innerHTML = data.data[48].calls;
  document.getElementById("pca_sud").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_sud").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_sud").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_sud").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_sud").innerHTML = timeString;

  var muda_cor3 = data.data[48].answered_percent;
  if (muda_cor3 > 90) {
    var list3 = document.getElementById("pca_sud").classList;
    list3.remove("ret_pca");
    list3.add("cor_verde");
  } else if (muda_cor3 >= 80) {
    var list3 = document.getElementById("pca_sud").classList;
    list3.remove("ret_pca");
    list3.add("cor_laranja");
  } else {
    var list3 = document.getElementById("pca_sud").classList;
    list3.remove("ret_pca");
    list3.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var pca = [];
  var head = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }
  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "SAC SE",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - SAC SE",
  };
  Plotly.newPlot("sacse", bd, layout, { scrollZoom: true });

  //==================================TME+TMA SAC SE=============================================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - SAC SE",
  };
  Plotly.newPlot("sacse_tm", bd, layout, { scrollZoom: true });
}
//===============================================================================
//https://gist.githubusercontent.com/letanure/3012978/raw/6938daa8ba69bcafa89a8c719690225641e39586/estados-cidades.json
//utilizando api HD CT

async function fazGET_hd_ct() {
  const myHeaders = new Headers();
  myHeaders.append("token", "cb6cd843-81c7-4621-9fea-0ce7e57b3398");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=33&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_hd_ct").innerHTML = data.data[48].calls;
  document.getElementById("pca_hd_ct").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_hd_ct").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_hd_ct").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_hd_ct").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_hd_ct").innerHTML = timeString;
  var muda_cor4 = data.data[48].answered_percent;
  if (muda_cor4 > 90) {
    var list4 = document.getElementById("pca_hd_ct").classList;
    list4.remove("ret_pca");
    list4.add("cor_verde");
  } else if (muda_cor4 >= 80) {
    var list4 = document.getElementById("pca_hd_ct").classList;
    list4.remove("ret_pca");
    list4.add("cor_laranja");
  } else {
    var list4 = document.getElementById("pca_hd_ct").classList;
    list4.remove("ret_pca");
    list4.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 11, 16, 27, 31, 34, 34, 35, 37,
    36, 33, 33, 35, 33, 33, 32, 31, 32, 32, 33, 31, 32, 35, 33, 31, 31, 31, 31,
    28, 21, 17, 11, 8, 4, 2,
  ];
  var pca = [];
  var head = [];

  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }

  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "HD RN",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - HD RN",
  };
  Plotly.newPlot("hdrn", bd, layout, { scrollZoom: true });

  //==================================TME+TMA HD RN=============================================

  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - HD RN ",
  };
  Plotly.newPlot("hdrn_tm", bd, layout, { scrollZoom: true });
}
//===============================================================================

//utilizando api HD CE

async function fazGET_hd_ce() {
  const myHeaders = new Headers();
  myHeaders.append("token", "55ec42aa-9c5d-4e44-8214-77e91ace494e");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=45&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_hd_ce").innerHTML = data.data[48].calls;
  document.getElementById("pca_hd_ce").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_hd_ce").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_hd_ce").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_hd_ce").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_hd_ce").innerHTML = timeString;
  var muda_cor5 = data.data[48].answered_percent;
  if (muda_cor5 > 90) {
    var list5 = document.getElementById("pca_hd_ce").classList;
    list5.remove("ret_pca");
    list5.add("cor_verde");
  } else if (muda_cor5 >= 80) {
    var list5 = document.getElementById("pca_hd_ce").classList;
    list5.remove("ret_pca");
    list5.add("cor_laranja");
  } else {
    list5 = document.getElementById("pca_hd_ce").classList;
    list5.remove("ret_pca");
    list5.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 11, 16, 27, 31, 34, 34, 35, 37,
    36, 33, 33, 35, 33, 33, 32, 31, 32, 32, 33, 31, 32, 35, 33, 31, 31, 31, 31,
    28, 21, 17, 11, 8, 4, 2,
  ];
  var pca = [];
  var head = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }

  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "HD CE",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - HD CE",
  };
  Plotly.newPlot("hdce", bd, layout, { scrollZoom: true });

  //==================================TME+TMA HD CE=============================================

  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - HD CE",
  };
  Plotly.newPlot("hdce_tm", bd, layout, { scrollZoom: true });
}
//===============================================================================

//utilizando api HD SUD

async function fazGET_hd_sud() {
  const myHeaders = new Headers();
  myHeaders.append("token", "e2f7ec90-6b6d-49b3-9ad4-6503228ca8a8");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=29&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_hd_sud").innerHTML = data.data[48].calls;
  document.getElementById("pca_hd_sud").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_hd_sud").innerHTML =
    data.data[48].answered;
  document.getElementById("abandonadas_hd_sud").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_hd_sud").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_hd_sud").innerHTML = timeString;
  var muda_cor6 = data.data[48].answered_percent;
  if (muda_cor6 > 90) {
    var list6 = document.getElementById("pca_hd_sud").classList;
    list6.remove("ret_pca");
    list6.add("cor_verde");
  } else if (muda_cor6 >= 80) {
    var list6 = document.getElementById("pca_hd_sud").classList;
    list6.remove("ret_pca");
    list6.add("cor_laranja");
  } else {
    var list6 = document.getElementById("pca_hd_sud").classList;
    list6.remove("ret_pca");
    list6.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 11, 16, 27, 31, 34, 34, 35, 37,
    36, 33, 33, 35, 33, 33, 32, 31, 32, 32, 33, 31, 32, 35, 33, 31, 31, 31, 31,
    28, 21, 17, 11, 8, 4, 2,
  ];
  var pca = [];
  var head = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }

  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  for (let i = 0; i < data.data.length; i++) {
    head.push(data.data[i].headcount);
  }
  var yArray = vetor;
  var media_hora = vetor2;
  var headcount = head;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "HD SE",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var data4 = {
    x: xArray,
    y: headcount,
    type: "scatter",
    line: { width: 2, color: "black" },
    name: "Headcount",
  };
  var bd = [data1, data2, data3, data4];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - HD SE",
  };
  Plotly.newPlot("hdse", bd, layout, { scrollZoom: true });

  //==================================TME+TMA HD SE =============================================

  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var tme = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 24, 28, 32, 34, 36, 36, 34,
    31, 28, 25, 25, 25, 27, 27, 29, 29, 29, 26, 25, 22, 19, 17, 17, 15, 14, 12,
    10, 7, 0, 0, 0, 0,
  ];
  var tma = [];

  for (let i = 0; i < data.data.length; i++) {
    tme.push(data.data[i].asa / 60);
  }
  for (let i = 0; i < data.data.length; i++) {
    tma.push(data.data[i].avg_talk_time / 60);
  }

  var yArray = tme;
  var yArray2 = tma;

  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "line",
    line: { color: "blue", width: 2, shape: "spline" },
    name: "TME",
  };

  var data2 = {
    x: xArray,
    y: yArray2,
    type: "line",
    line: { color: "red", width: 3, shape: "spline" },
    name: "TMA",
  };

  var bd = [data1, data2];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Tempo de Atendimento" },
    title: "TME x TMA - HD SE",
  };
  Plotly.newPlot("hdse_tm", bd, layout, { scrollZoom: true });
}
//===============================================================================

//utilizando api SAC CONCOLIDADO

async function fazGET_consolidado_sac() {
  const myHeaders = new Headers();
  myHeaders.append("token", "6e5617c6-48aa-484b-a191-ed7cd9e1eced");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=46&queue_group_ids=32&queue_group_ids=28&queue_group_ids=62&queue_group_ids=65&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_consolidadoSAC").innerHTML =
    data.data[48].calls;
  document.getElementById("pca_consolidadoSAC").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_consolidadoSAC").innerHTML =
    data.data[48].answered;
  document.getElementById("abandonadas_consolidadoSAC").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_consolidadoSAC").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_consolidadoSAC").innerHTML = timeString;
  var muda_cor7 = data.data[48].answered_percent;
  if (muda_cor7 > 90) {
    var list7 = document.getElementById("pca_consolidadoSAC").classList;
    list7.remove("ret_pca");
    list7.add("cor_verde");
  } else if (muda_cor7 >= 80) {
    var list7 = document.getElementById("pca_consolidadoSAC").classList;
    list7.remove("ret_pca");
    list7.add("cor_laranja");
  } else {
    var list7 = document.getElementById("pca_consolidadoSAC").classList;
    list7.remove("ret_pca");
    list7.add("cor_vermelho");
  }
  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 35, 117, 142, 168, 179, 180,
    181, 172, 169, 157, 148, 139, 138, 139, 139, 141, 144, 143, 140, 138, 130,
    109, 92, 80, 69, 57, 41, 27, 21, 1, 0, 0, 0,
  ];
  var pca = [];
  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }
  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }
  var yArray = vetor;
  var media_hora = vetor2;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "Consolidado SAC",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var bd = [data1, data2, data3];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - Consolidado SAC",
  };
  Plotly.newPlot("myDiv", bd, layout, { scrollZoom: true });
}
//===============================================================================
async function fazGET_consolidado_hd() {
  const myHeaders = new Headers();
  myHeaders.append("token", "9c68d152-ff24-403a-8e2c-6c90a1295afb");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=45&queue_group_ids=33&queue_group_ids=29&queue_group_ids=63&queue_group_ids=66&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_consolidadoHD").innerHTML=data.data[48].calls;
  document.getElementById("pca_consolidadoHD").innerHTML=data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_consolidadoHD").innerHTML=data.data[48].answered;
  document.getElementById("abandonadas_consolidadoHD").innerHTML=data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_consolidadoHD").innerHTML=timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_consolidadoHD").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("pca_consolidadoHD").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("pca_consolidadoHD").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("pca_consolidadoHD").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }

  //===================
  var xArray = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  var vetor = [];
  var vetor2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 44, 82, 96, 108, 107, 109,
    111, 106, 102, 99, 98, 95, 95, 95, 91, 94, 95, 97, 92, 92, 97, 90, 88, 86,
    85, 79, 75, 54, 41, 21, 15, 9, 5,
  ];
  var pca = [];

  for (let i = 0; i < data.data.length; i++) {
    vetor.push(data.data[i].calls);
  }

  for (let i = 0; i < data.data.length; i++) {
    pca.push(data.data[i].answered_percent.toFixed(1) + "%");
  }

  var yArray = vetor;
  var media_hora = vetor2;
  // Define Data

  var data1 = {
    x: xArray,
    y: yArray,
    type: "lines",
    line: { width: 3, shape: "spline" },
    name: "Consolidado HD",
  };

  var data2 = {
    x: xArray,
    y: media_hora,
    type: "lines",
    line: { color: "red", width: 3, dash: "dot" },
    name: "Média 3 meses",
  };
  var data3 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(125, 138, 150)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };
  var bd = [data1, data2, data3];

  var layout = {
    xaxis: { title: "Hora" },
    yaxis: { title: "Ligações" },
    title: "Volumetria - Consolidado HD",
  };
  Plotly.newPlot("myDiv2", bd, layout, { scrollZoom: true });
}

//===============================================================================
async function fazGET_Alares_SAC() {
  const myHeaders = new Headers();
  myHeaders.append("token", "ca22f124-a862-4f7f-93f8-82130e058d5f");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queues&queue_or_group=queues&queues_ids=1380&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("sacAlares_total").innerHTML = data.data[48].calls;
  document.getElementById("sacAlares_pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("sacAlares_atendidas").innerHTML =
    data.data[48].answered;
  document.getElementById("sacAlares_abandonadas").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("sacAlares_tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("sacAlares_tme").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("sacAlares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("sacAlares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("sacAlares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }
}

//===============================================================================
async function fazGET_Alares_HD() {
  const myHeaders = new Headers();
  myHeaders.append("token", "ca22f124-a862-4f7f-93f8-82130e058d5f");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queues&queue_or_group=queues&queues_ids=1381&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("HDalares_total").innerHTML = data.data[48].calls;
  document.getElementById("HDalares_pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("HDalares_atendidas").innerHTML =
    data.data[48].answered;
  document.getElementById("HDalares_abandonadas").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("HDalares_tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("HDalares_tme").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("HDalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("HDalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("HDalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }
}
//===============================================================================
async function fazGET_Alares_RET() {
  const myHeaders = new Headers();
  myHeaders.append("token", "1fff80f7-5170-46be-b21c-b0c99eff82ad");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=39&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("RETalares_total").innerHTML = data.data[48].calls;
  document.getElementById("RETalares_pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("RETalares_atendidas").innerHTML =
    data.data[48].answered;
  document.getElementById("RETalares_abandonadas").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("RETalares_tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("RETalares_tme").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("RETalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("RETalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("RETalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }
}

//===============================================================================
async function fazGET_Alares_desbloqueio() {
  const myHeaders = new Headers();
  myHeaders.append("token", "1e6c4eb9-5b4c-47f8-b809-c8ce75385581");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queues&queue_or_group=queues&queues_ids=1417&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("DESalares_total").innerHTML = data.data[48].calls;
  document.getElementById("DESalares_pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("DESalares_atendidas").innerHTML =
    data.data[48].answered;
  document.getElementById("DESalares_abandonadas").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("DESalares_tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("DESalares_tme").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("DESalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("DESalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("DESalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }
}

//===============================================================================
async function fazGET_Alares_via() {
  const myHeaders = new Headers();
  myHeaders.append("token", "a466d030-0dfa-496f-b9d1-cdd9edd1ef4d");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queues&queue_or_group=queues&queues_ids=1457&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("VIAalares_total").innerHTML = data.data[48].calls;
  document.getElementById("VIAalares_pca").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("VIAalares_atendidas").innerHTML =
    data.data[48].answered;
  document.getElementById("VIAalares_abandonadas").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("VIAalares_tma").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("VIAalares_tme").innerHTML = timeString;
  var muda_cor8 = data.data[48].answered_percent;
  if (muda_cor8 > 90) {
    var list8 = document.getElementById("VIAalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_verde");
  } else if (muda_cor8 >= 80) {
    var list8 = document.getElementById("VIAalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_laranja");
  } else {
    var list8 = document.getElementById("VIAalares_pca").classList;
    list8.remove("ret_pca");
    list8.add("cor_vermelho");
  }
}
//======================================================================

async function faz_GETretAlares() {
  const myHeaders = new Headers();
  myHeaders.append("token", "91440272-3f9c-45b3-8177-b2dd49c49920");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=67&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("RETalares_total1").innerHTML = data.data[48].calls;
  document.getElementById("RETalares_pca1").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("RETalares_atendidas1").innerHTML =
    data.data[48].answered;
  document.getElementById("RETalares_abandonadas1").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("RETalares_tma1").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("RETalares_tme1").innerHTML = timeString;

}




//===========================CADASTRAR OPERADORES============================================
async function faz_cadastro() {

  var vetor = [45,43,858,923,42,699,17,51,725,38,55,712,697,41,93,740,40,501,53,739,54,39,684,715,200,683,687,88,789,787,809,857,853,851,933,934]

  for (let i = 0; i < vetor.length; i++){

  const myHeaders = new Headers();
  myHeaders.append("token", "91440272-3f9c-45b3-8177-b2dd49c49920");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "levels" : [{"queue_id": [1649,1651,1656,1647,1653,1660,1666,1658], "priority" : 2}]
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/agents/${vetor[i]}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log("SUCESSO", result  ))
    .catch((error) => console.log("error", error));

}
}
//===============================================================================

async function fazGET_produtividade() {
  const myHeaders = new Headers();
  myHeaders.append("token", "91afe8ff-f228-4a36-a27b-8a05a2e288e1");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/agents_performance?start_date=${data_start}T03%3A00%3A00.000Z&end_date=${data_end}T02%3A59%3A59.999Z&entity=queues&queue_or_group=queues&queue_ids=all&agent_ids=all`,
    requestOptions
  );
  const data = await response.json();
  for (let i=0; i < data.data[i].length; i++){
    console.log(data.data.name);
    console.log(data.data.id);
  };

  
}


//===============================================================================
async function fazGET_GERAL() {
  const myHeaders = new Headers();
  myHeaders.append("token", "ca22f124-a862-4f7f-93f8-82130e058d5f");

  var data_start = $("#start").val();
  var data_end = $("#end").val();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=39&queue_group_ids=50&queue_group_ids=51&queue_group_ids=65&queue_group_ids=66&queue_group_ids=67&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("total_geral").innerHTML = data.data[48].calls;
  document.getElementById("pca_geral").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_geral").innerHTML = data.data[48].answered;
  document.getElementById("abandonadas_geral").innerHTML =
    data.data[48].unanswered;

  var given_seconds = data.data[48].avg_talk_time;

  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tma_geral").innerHTML = timeString;

  var given_seconds_tme = data.data[48].asa;

  var hours = Math.floor(given_seconds_tme / 3600);
  var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
  var seconds = given_seconds_tme - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds.toString().padStart(2, "0"));

  document.getElementById("tme_geral").innerHTML = timeString;
}

//===============================================================================

/* const getHours = () => {
  const clock = document.getElementsByClassName("clock")[0];
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const hour = hours < 10 ? `0${hours}` : hours;
  const minute = minutes < 10 ? `0${minutes}` : minutes;
  const second = seconds < 10 ? `0${seconds}` : seconds;
  clock.innerHTML = `${hour}:${minute}:${second}`;
}; */

/* setInterval(() => {
  getHours();
}, 1000); */

setInterval(() => {
  updategeral();
}, 900000);

setInterval(() => {
  updateretecao();
}, 900000);

setInterval(() => {
  update_sac_ct();
}, 900000);

setInterval(() => {
  update_sac_ce();
}, 900000);

setInterval(() => {
  update_sac_sud();
}, 900000);

setInterval(() => {
  update_hd_ct();
}, 900000);

setInterval(() => {
  update_hd_ce();
}, 900000);

setInterval(() => {
  update_hd_sud();
}, 900000);

setInterval(() => {
  updatconsolidsac();
}, 900000);

setInterval(() => {
  fazGET_consolidado_hd();
}, 900000);

setInterval(() => {
  fazBlip();
}, 600000);

setInterval(() => {
  fazBliphd();
}, 600000);

setInterval(() => {
  fazGET_Alares_SAC();
}, 900000);

setInterval(() => {
  fazGET_Alares_HD();
}, 900000);

setInterval(() => {
  fazGET_Alares_RET();
}, 900000);

setInterval(() => {
  fazGET_Alares_desbloqueio();
}, 900000);

setInterval(() => {
  fazGET_Alares_via();
}, 900000);

function update_geral() {
  fazGET_GERAL();
}

function updateretecao() {
  fazGET();
}
function updatconsolidsac() {
  fazGET_consolidado_sac();
}
function updatconsolidhd() {
  fazGET_consolidado_hd();
}
function update_sac_ct() {
  fazGET_sac_ct();
}
function update_sac_ce() {
  fazGET_sac_ce();
}
function update_sac_sud() {
  fazGET_sac_sud();
}
function update_hd_ct() {
  fazGET_hd_ct();
}
function update_hd_ce() {
  fazGET_hd_ce();
}
function update_hd_sud() {
  fazGET_hd_sud();
}

function updateBlip() {
  fazBlip();
}
function updateBliphd() {
  fazBliphd();
}

function updatealares_SAC() {
  fazGET_Alares_SAC();
}

function updatealares_HD() {
  fazGET_Alares_HD();
}
function updatealares_RET() {
  fazGET_Alares_RET();
}

function update_desbloqueio() {
  fazGET_Alares_desbloqueio();
}

function update_segundavia() {
  fazGET_Alares_via();
}
function update_massiva() {
  fazMassiva();
}

function update_encerramento() {
  fazEncerramento();
}

function update_text() {
  fazMensagem();
}
function update_cadastro() {
  faz_cadastro();
}
function produtividade(){
fazGET_produtividade();
}
function updat_RETalares(){
  faz_GETretAlares();
  }


function updategeral() {
  setTimeout(fazGET(), 5000);
  setTimeout(fazGET_consolidado_sac(), 5000);
  setTimeout(fazGET_consolidado_hd(), 5000);
  setTimeout(fazGET_sac_ct(), 7000);
  setTimeout(fazGET_sac_ce(), 5000);
  setTimeout(fazGET_sac_sud(), 5000);
  setTimeout(fazGET_hd_ct(), 5000);
  setTimeout(fazGET_hd_ce(), 7000);
  setTimeout(fazGET_hd_sud(), 5000);
  setTimeout(fazGET_Alares_SAC(), 5000);
  setTimeout(fazGET_Alares_HD(), 7000);
  setTimeout(fazGET_Alares_RET(), 5000);
  setTimeout(fazGET_Alares_desbloqueio(), 5000);
  setTimeout(fazGET_Alares_via(), 7000);
  setTimeout(update_geral(), 5000);
  setTimeout(faz_GETretAlares(), 5000);
}
