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

//=======================================================================
async function fazGET_Geral() {
  const response = await fetch(`/update_geral`);
  const data = await response.json();
  document.getElementById("valor_recebidas").innerHTML = data[0]["Total"];
  document.getElementById("valor_atendidas").innerHTML = data[0]["atendidas"];
  document.getElementById("valor_pca").innerHTML = data[0]["Percent"];
  document.getElementById("valor_aband").innerHTML = data[0]["Natendidas"];
  document.getElementById("valor_tme").innerHTML = data[0]["tme"];
  document.getElementById("valor_tma").innerHTML = data[0]["tma"];

  document.getElementById("total_consolidadoSAC").innerHTML =
    data[1]["TotalSAC"];
  document.getElementById("atendidas_consolidadoSAC").innerHTML =
    data[1]["atendidasSAC"];
  document.getElementById("pca_consolidadoSAC").innerHTML =
    data[1]["PercentSAC"];
  document.getElementById("abandonadas_consolidadoSAC").innerHTML =
    data[1]["NatendidasSAC"];
  document.getElementById("tme_consolidadoSAC").innerHTML = data[1]["tmeSAC"];
  document.getElementById("tma_consolidadoSAC").innerHTML = data[1]["tmaSAC"];

  document.getElementById("total_consolidadoHD").innerHTML = data[2]["TotalHD"];
  document.getElementById("atendidas_consolidadoHD").innerHTML =
    data[2]["atendidasHD"];
  document.getElementById("pca_consolidadoHD").innerHTML = data[2]["PercentHD"];
  document.getElementById("abandonadas_consolidadoHD").innerHTML =
    data[2]["NatendidasHD"];
  document.getElementById("tme_consolidadoHD").innerHTML = data[2]["tmeHD"];
  document.getElementById("tma_consolidadoHD").innerHTML = data[2]["tmaHD"];

  /*document.getElementById("total_consolidadowebby").innerHTML = data[3]["Totalwebby"];
  document.getElementById("atendidas_consolidadowebby").innerHTML =
    data[3]["atendidaswebby"];
  document.getElementById("pca_consolidadowebby").innerHTML = data[3]["Percentwebby"];
  document.getElementById("abandonadas_consolidadowebby").innerHTML =
    data[3]["Natendidaswebby"];
  document.getElementById("tme_consolidadowebby").innerHTML = data[3]["tmewebby"];
  document.getElementById("tma_consolidadowebby").innerHTML = data[3]["tmawebby"];
} */
}

//===============================================================================

async function fazGET_produtividade() {
  const response = await fetch(`/operador`);
  const data = await response.json();
  const tabelaBody = document.getElementById("tabelaBody");

  for (let i = 0; i < data.length; i++) {
    const rowData = data[i];
    const row = tabelaBody.insertRow();

    const loginCell = row.insertCell(0);
    loginCell.textContent = rowData.login;

    const operadorCell = row.insertCell(1);
    operadorCell.textContent = rowData.operador;

    const quantCell = row.insertCell(2);
    quantCell.textContent = rowData.quant;

    const ocupadoCell = row.insertCell(3);
    ocupadoCell.textContent = rowData.ocupado;

    const tmaCell = row.insertCell(4);
    tmaCell.textContent = rowData.tma;

    const duracaoCell = row.insertCell(5);
    duracaoCell.textContent = rowData.duracao;
  }
}
//===============================================================================

async function fazPESQUISA() {
  const response = await fetch("/pesquisa_demanda");
  const banco = await response.json();
  const assunto = Object.values(banco["data"]);
  const contagem = Object.values(banco["quantidade"]);
  const dataa = [];

  for (let i = 0; i < assunto.length; i++) {
    const dataNumerica = assunto[i];
    dataa.push(dataNumerica);
  }

  const xarray = dataa;
  const yarray = contagem;

  const data1 = [
    {
      x: xarray,
      y: yarray,
      type: "bar",
      text: yarray,
      marker: {
        color: yarray.map((value) => (value > 20000 ? "#FF0000" : "#7B68EE")),
      },
    },
  ];
  var config = {
    displaylogo: false, // Oculta o logotipo do Plotly
    displayModeBar: false // Isso remove a barra de ferramentas
  };
  const layout1 = {
    height: 340,
    title: "Bloqueios",
    colorway: ["#7B68EE"],
    //plot_bgcolor: "#272727",
    //paper_bgcolor: "#272727",
    font: {
      color: "#2b2b2b",
    },
  };

  Plotly.newPlot("myDiv", data1, layout1, config);
}
//===============================================================================

async function fazPESQUISA_REPORT() {
  try {
    const response = await fetch("/pesquisa_demandaReport1");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco = await response.json();
    const assunto = Object.values(banco["Assunto"]);
    const contagem = Object.values(banco["Contagem"]);

    const xarray = assunto;
    const yarray = contagem;

    const data = [
      {
        labels: xarray,
        values: yarray,
        text: yarray,
        textinfo: "label+text",
        type: "pie",
        hole: 0.4,
      },
    ];

    const layout = {
      title: "Assuntos",
      height: 380,
      width: 800,
      plot_bgcolor: "#272727",
      paper_bgcolor: "#272727",
      colorway: ["#7B68EE", "#9680f2", "#ad98f5", "#c3b1f8", "#d8cbfb"],
      showlegend: false,
      font: {
        color: "#00fa97",
      },
    };

    Plotly.newPlot("myDiv", data, layout);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT_SAC() {
  try {
    const response = await fetch("/pesquisa_demandaReport_sac");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco = await response.json();
    const assunto = Object.values(banco["Assunto"]);
    const contagem = Object.values(banco["Contagem"]);

    const xarray = assunto;
    const yarray = contagem;

    const data = [
      {
        labels: xarray,
        values: yarray,
        text: yarray,
        textinfo: "label+text",
        type: "pie",
        hole: 0.4,
      },
    ];

    const layout = {
      title: "Assuntos SAC ALARES",
      height: 380,
      width: 800,
      plot_bgcolor: "#272727",
      paper_bgcolor: "#272727",
      colorway: ["#7B68EE", "#9680f2", "#ad98f5", "#c3b1f8", "#d8cbfb"],
      showlegend: false,
      font: {
        color: "#00fa97",
      },
    };

    Plotly.newPlot("myDiv_SAC", data, layout);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT_WEBBY() {
  try {
    const response = await fetch("/pesquisa_demandaReport_webby");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco = await response.json();
    const assunto = Object.values(banco["Assunto"]);
    const contagem = Object.values(banco["Contagem"]);

    const xarray = assunto;
    const yarray = contagem;

    const data = [
      {
        labels: xarray,
        values: yarray,
        text: yarray,
        textinfo: "label+text",
        type: "pie",
        hole: 0.4,
      },
    ];

    const layout = {
      title: "Assuntos Webby",
      height: 380,
      width: 800,
      plot_bgcolor: "#272727",
      paper_bgcolor: "#272727",
      colorway: ["#7B68EE", "#9680f2", "#ad98f5", "#c3b1f8", "#d8cbfb"],
      showlegend: false,
      font: {
        color: "#00fa97",
      },
    };

    Plotly.newPlot("myDiv1_SAC", data, layout);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT1() {
  try {
    const response = await fetch("/pesquisa_demandaReport2");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["Cidade"]);
    const contagem1 = Object.values(banco1["Contagem1"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
      },
    ];

    const layout1 = {
      height: 380,
      width: 880,
      title: "Internet Sem Acesso Por Cidade",
      colorway: ["#7B68EE"],
      plot_bgcolor: "#272727",
      paper_bgcolor: "#272727",
      font: {
        color: "#00fa97",
      },
    };

    Plotly.newPlot("myDiv1", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT2() {
  try {
    const response = await fetch("/pesquisa_demandaReport3");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["Uf"]);
    const contagem1 = Object.values(banco1["Contagem1"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
      },
    ];

    const layout1 = {
      height: 380,
      width: 1700,
      title: "Internet Sem Acesso Por Estado - Top 15",
      colorway: ["#7B68EE"],
      plot_bgcolor: "#272727",
      paper_bgcolor: "#272727",
      font: {
        color: "#00fa97",
      },
    };

    Plotly.newPlot("myDiv2", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}

//===============================================================================

async function fazPESQUISA_REPORT_planilha() {
  try {
    const response = await fetch("/pesquisa_demandaReport_planilha");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco = await response.json();
    const assunto = Object.values(banco["Assunto"]);
    const contagem = Object.values(banco["Contagem"]);

    const xarray = assunto;
    const yarray = contagem;

    const data = [
      {
        labels: xarray,
        values: yarray,
        type: "pie",
        hole: 0.4,
      },
    ];

    const layout = {
      title: "Assunto",
      height: 380,
      width: 600,
      colorway: ["#7B68EE", "#9680f2", "#ad98f5", "#c3b1f8", "#d8cbfb"],
    };

    Plotly.newPlot("myDiv", data, layout);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT_planilha1() {
  try {
    const response = await fetch("/pesquisa_demandaReport_planilha2");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["Cidade"]);
    const contagem1 = Object.values(banco1["Contagem1"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
      },
    ];

    const layout1 = {
      height: 380,
      width: 880,
      title: "Internet Sem Acesso Por Cidade",
      colorway: ["#7B68EE"],
    };

    Plotly.newPlot("myDiv1", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazPESQUISA_REPORT_planilha2() {
  try {
    const response = await fetch("/pesquisa_demandaReport_planilha3");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["Cidade"]);
    const contagem1 = Object.values(banco1["Contagem1"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
      },
    ];

    const layout1 = {
      height: 380,
      width: 1600,
      title: "Internet Sem Acesso Por Cidade - Top 15",
      colorway: ["#7B68EE"],
    };

    Plotly.newPlot("myDiv2", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}

//===============================================================================
function fazGET_exportar() {
  var exportButton = document.getElementById("export-button");
  var table = document.getElementById("example");

  exportButton.addEventListener("click", function () {
    var tableHTML = table.outerHTML.replace(/ /g, "%20");
    var downloadLink = document.createElement("a");
    downloadLink.href = "data:application/vnd.ms-excel," + tableHTML;
    downloadLink.download = "Operadores.xls";
    downloadLink.click();
  });
}

//===============================================================================
async function fazGET_Filas() {
  const response = await fetch(`/update_filas`);
  const data = await response.json();

  //SAC
  document.getElementById("valor_espera").innerHTML = data[0];
  document.getElementById("valor_chamando").innerHTML = data[1];
  document.getElementById("valor_pausado").innerHTML = data[2];
}

//===============================================================================

async function usoValidacao() {
  const response = await fetch(`/validacaoUSO`);
  const data = await response.json();
  console.log(data.info1);

  const imgUSO = document.getElementById('imgUSO');
  imgUSO.src = '';

  const img = document.createElement('img');
  img.width = 80;
  img.height = 80;
  img.margin = 30;
  
  if (data.info1 === 'Not Data') {
    img.src = '/static/img/triste.png';
  } else {
    img.src = '/static/img/feliz.png';
  }

  imgUSO.appendChild(img);
}

//===============================================================================

async function zapValidacao() {
  const response = await fetch(`/validacaoZAP`);
  const data = await response.json();

  const imgzap = document.getElementById('zap');
  const imgyt = document.getElementById('yt');
  
  // Limpa o conteúdo atual dos elementos
  imgzap.innerHTML = '';
  imgyt.innerHTML = '';

  // Criação das imagens
  const imgZap = document.createElement('img');
  imgZap.width = 80;
  imgZap.height = 80;
  imgZap.margin = 30; // Correção: use style.margin para definir a margem

  const imgYt = document.createElement('img');
  imgYt.width = 80;
  imgYt.height = 80;
  imgYt.margin = 30; // Correção: use style.margin para definir a margem

  // Condição para imagem do WhatsApp
  if (data.info2 >= '70%') {
    imgZap.src = '/static/img/triste.png';
  } else {
    imgZap.src = '/static/img/feliz.png';
  }

  // Condição para imagem do YouTube
  if (data.info3 >= '70%') {
    imgYt.src = '/static/img/triste.png';
  } else {
    imgYt.src = '/static/img/feliz.png';
  }

  // Adiciona as imagens aos elementos correspondentes
  imgzap.appendChild(imgZap);
  imgyt.appendChild(imgYt);
}


//===============================================================================
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
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=65&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();

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
    `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?start_date=${data_start}T03%3A00%3A00.000000Z&end_date=${data_end}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=66&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00`,
    requestOptions
  );
  const data = await response.json();

  document.getElementById("total_consolidadoHD").innerHTML =
    data.data[48].calls;
  document.getElementById("pca_consolidadoHD").innerHTML =
    data.data[48].answered_percent.toFixed(1) + "%";
  document.getElementById("atendidas_consolidadoHD").innerHTML =
    data.data[48].answered;
  document.getElementById("abandonadas_consolidadoHD").innerHTML =
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

  document.getElementById("tma_consolidadoHD").innerHTML = timeString;

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
}
//===============================================================================

async function fazGET_GRAFICO() {
  const response = await fetch("/grafico_index");
  const data = await response.json();

  var xArray = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
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
  var pca = [];
  // Ajuste a série de "Ligações Recebidas" para mostrar apenas os dados disponíveis
  for (let i = 0; i < data.length - 1; i++) {
    vetor.push(data[i]["Total"]);
  }
  var data1 = {
    x: xArray.slice(0, vetor.length),
    y: vetor,
    type: "lines",
    line: { color: "#00fa97", width: 3, shape: "spline" },
    name: "Recebidas",
  };

  for (let i = 0; i < data.length - 1; i++) {
    pca.push(data[i]["Percent"] + "%");
  }
/*
  // Calcule a média exponencial de 4 períodos
  var smoothingFactor = 2 / (3 + 1);
  var exponentialAverage = [vetor[0]];
  for (let i = 1; i < vetor.length; i++) {
    exponentialAverage[i] = vetor[i] * smoothingFactor + exponentialAverage[i - 1] * (1 - smoothingFactor);
  }

  // Ajuste a linha da média exponencial para mostrar apenas os dados disponíveis
   
   
  var data3 = {
    x: xArray.slice(0, exponentialAverage.length),
    y: exponentialAverage,
    type: "lines",
    line: { color: "red", width: 3, shape: "spline" },
    name: "Média Exponencial 4 períodos",
  };
*/
  var data2 = {
    x: xArray,
    y: pca,
    type: "bar",
    marker: { color: "rgb(123,104,238, 0.5)", width: 1 },
    text: pca.map(String),
    textposition: "auto",
    hoverinfo: "none",
    name: "PCA",
  };

  var bd = [data1, data2];
  var config = {
    displaylogo: false, // Oculta o logotipo do Plotly
    displayModeBar: false // Isso remove a barra de ferramentas
  };
  var layout = {
    height: 340,
    title: "Volumetria",
    yaxis: { title: "Ligações" },
    //plot_bgcolor: "#272727",
    //paper_bgcolor: "#272727",
    font: {
      color: "#2b2b2b",
    },
    displayModeBar: false // Isso remove a barra de ferramentas
  };

  Plotly.newPlot("render_grafico", bd, layout,config);
}
//===============================================================================
async function escalados_logados() {

  const response = await fetch("/logados");
  const data = await response.json();

  const table = $('#tbody').DataTable();

  // Limpar o conteúdo existente da tabela
  table.clear();

  // Iterar sobre os dados e adicionar as linhas à tabela
  for (const key in data.Setor) {
    const rowData = [
      data.Setor[key],
      data.Escalados[key],
      data.Logados[key],
      data.abs[key],
      data.hora[key]
    ];

    // Adicionar a linha à tabela usando o DataTables
    table.row.add(rowData);
  }

  // Atualizar a tabela para refletir as alterações
  table.draw();
}
//===============================================================================


document.addEventListener('DOMContentLoaded', () => {
  setInterval(() => {
    fazGET_Filas();
  }, 60000);

  setInterval(() => {
    fazGET_GRAFICO();
  }, 60000);
  
  setInterval(() => {
    fazGET_Geral();
  }, 60000);
  
  setInterval(() => {
    updatconsolidsac();
  }, 900000);
  
  setInterval(() => {
    fazGET_consolidado_hd();
  }, 900000);
  setInterval(() => {
    fazGetChat();
  }, 60000);
  

  setInterval(() => {
    fazGet_produtividadeUso();
  }, 60000);
  
  setInterval(() => {
    monitorarVariavel();
  }, 20000);

  setInterval(() => {
    fazGET_GRAFICO();
  }, 60000);
  
  setInterval(() => {
    fazGET_Geral();
  }, 60000);
  
  setInterval(() => {
    fazGET_produtividade();
  }, 3600000);
});

//===============================FUNÇÔES================================================
function update_filas() {
  fazGET_Filas();
}

function updatgeral() {
  fazGET_Geral();
}

function updatprodutividade() {
  fazGET_produtividade();
}

function demanda() {
  fazPESQUISA();
}

function pausachat() {
  fazGet_produtividadeUso();
}

function demanda_report() {
  fazPESQUISA_REPORT();
  fazPESQUISA_REPORT1();
  fazPESQUISA_REPORT2();
}

function demanda_report_SAC() {
  fazPESQUISA_REPORT_SAC();
  fazPESQUISA_REPORT_WEBBY();
}

function demanda_report_planilha() {
  fazPESQUISA_REPORT_planilha();
  fazPESQUISA_REPORT_planilha1();
  fazPESQUISA_REPORT_planilha2();
}

function exportar() {
  fazGET_exportar();
}

function chat() {
  fazGetChat();
}

function updatconsolidsac() {
  fazGET_consolidado_sac();
}
function updatconsolidhd() {
  fazGET_consolidado_hd();
}

function updateGrafico() {
  fazGET_GRAFICO();
}

function validaUSO(){
  usoValidacao();
}
function validaZAP(){
  zapValidacao();
}

function escalados(){
  escalados_logados();
}

function chat() {
  fazGetChat();
}
function alertas(){
  fazGetAlertas();
}


//=================================REQUESTS USO==============================================

async function fazGetChat() {
  const response = await fetch("/teste");

  const data = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const table = doc.getElementById("tb_1");
  const rows = table.querySelectorAll("tbody tr");

  const departmentData = [];
  for (const row of rows) {
    const departmentCell = row.querySelector("td:nth-child(1)"); // Select first cell (department)
    const department = departmentCell.textContent.trim();
    if (department === "HELP DESK" || department === "SAC") {
      const qtyCell = row.querySelector("td:nth-child(2)"); // Select second cell (quantity)
      const qtylogados = row.querySelector("td:nth-child(5)");
      const qtyDispo = row.querySelector("td:nth-child(6)");
      const qty = parseInt(qtyCell.textContent.trim());
      const qtdL = parseInt(qtylogados.textContent.trim());
      const qtdD = parseInt(qtyDispo.textContent.trim());
      departmentData.push({ department, qty, qtdL, qtdD });
    }
    if (department === "HELP DESK WEBBY" || department === "SAC WEBBY") {
      const qtyCell = row.querySelector("td:nth-child(2)"); // Select second cell (quantity)
      const qtylogados = row.querySelector("td:nth-child(5)");
      const qtyDispo = row.querySelector("td:nth-child(6)");
      const qty = parseInt(qtyCell.textContent.trim());
      const qtdL = parseInt(qtylogados.textContent.trim());
      const qtdD = parseInt(qtyDispo.textContent.trim());
      departmentData.push({ department, qty, qtdL, qtdD });
    }
  }

  let total1 = 0;
  let total2 = 0;
  let totalLogados = 0;
  let totalLogados2 = 0;
  let qtyDispo = 0;
  let qtyDispo2 = 0;


  for (let i = 0; i < departmentData.length; i++) {
    // Check if department property exists and add value if defined
    if (departmentData[i].hasOwnProperty("department")) {
      if (departmentData[i].department === "SAC" || departmentData[i].department === "HELP DESK") {
        // Check if qty property exists and add value if defined
        if (departmentData[i].hasOwnProperty("qty")) {
          total1 += departmentData[i].qty;
        } else {
          total1 += 0; // Set to 0 if qty is not defined
        }
        // Check if qtdL property exists and add value if defined
        if (departmentData[i].hasOwnProperty("qtdL")) {
          totalLogados += departmentData[i].qtdL;
        } else {
          totalLogados += 0; // Set to 0 if qtdL is not defined
        }
        if (departmentData[i].hasOwnProperty("qtdD")) {
          qtyDispo += departmentData[i].qtdD;
        } else {
          qtyDispo += 0; // Set to 0 if qtdL is not defined
        }
      } else if (departmentData[i].department === "SAC WEBBY" || departmentData[i].department === "HELP DESK WEBBY") {
        // Check if qty property exists and add value if defined
        if (departmentData[i].hasOwnProperty("qty")) {
          total2 += departmentData[i].qty;
        } else {
          total2 += 0; // Set to 0 if qty is not defined
        }
        // Check if qtdL property exists and add value if defined
        if (departmentData[i].hasOwnProperty("qtdL")) {
          totalLogados2 += departmentData[i].qtdL;
        } else {
          totalLogados2 += 0; // Set to 0 if qtdL is not defined
        }
      
      if (departmentData[i].hasOwnProperty("qtdD")) {
        qtyDispo2 += departmentData[i].qtdD;
      } else {
        qtyDispo2 += 0; // Set to 0 if qtdL is not defined
      }
    } else {
      // If department property does not exist, set both total1, total2, and totalLogados to 0
      total1 = 0;
      total2 = 0;
      totalLogados = 0;
      totalLogados2 = 0;
      qtyDispo = 0;
      qtyDispo2 = 0;
      break;
    }
  }
  }

  document.getElementById("chatTotal").innerHTML = total1;
  document.getElementById("chatTME").innerHTML = total2;
  document.getElementById("chatTotalLogados").innerHTML = totalLogados;
  document.getElementById("chatTotalLogados2").innerHTML = totalLogados2;
  document.getElementById("chatDispo").innerHTML = qtyDispo;
  document.getElementById("chatDispo2").innerHTML = qtyDispo2;
}

//=================================REQUESTS USO PRODUTIVIDADE==============================================

async function fazGet_produtividadeUso() {
  const data_start = document.getElementById('data_start').value;
  const data_end = document.getElementById('data_end').value;

  const response = await fetch('/tempoPausa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data_start, data_end })
  });

  const data = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const table = $('#tbody1').DataTable();
  table.clear();

  const rows = doc.getElementById("tb2").getElementsByTagName("tbody")[0].getElementsByTagName("tr");

  for (const row of rows) {
    const rowData = [
      row.getElementsByTagName('td')[0].innerHTML,
      row.getElementsByTagName('td')[1].innerHTML,
      row.getElementsByTagName('td')[2].innerHTML,
      row.getElementsByTagName('td')[3].innerHTML,
      row.getElementsByTagName('td')[4].innerHTML,
      row.getElementsByTagName('td')[5].innerHTML,
      row.getElementsByTagName('td')[6].innerHTML,
      row.getElementsByTagName('td')[7].innerHTML
    ];
        // Convert the login and logout times to minutes
    const [loginHours, loginMinutes, loginSeconds] = rowData[2].split(':').map(Number);
    const [logoutHours, logoutMinutes, logoutSeconds] = rowData[3].split(':').map(Number);
    const loginMinutes2 = loginHours * 60 + loginMinutes + Math.ceil(loginSeconds / 60);
    const logoutMinutes3 = logoutHours * 60 + logoutMinutes + Math.ceil(logoutSeconds / 60);

    // Calculate the total time worked
    const totalMinutes = logoutMinutes3 - loginMinutes2;
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMinutesRemainder = totalMinutes % 60;
    const totalTimeWorked = `${totalHours.toString().padStart(2, '0')}:${totalMinutesRemainder.toString().padStart(2, '0')}`;

    // Add the new column with the total time worked
    rowData.push(totalTimeWorked);
    // Convert the time string to minutes
    const [hours, minutes, seconds] = rowData[4].split(':').map(Number);
    const totalMinutes4 = hours * 60 + minutes + Math.ceil(seconds / 60);

    // Check if the total minutes is greater than 20
    if (totalMinutes4 > 20) {
      // Add the CSS styles for background color and text color
      rowData[4] = `<span style="background-color: red; color: white;">${rowData[4]}</span>`;
    }
    table.row.add(rowData);
  }

  table.draw();
}
//======================================================================================
async function fazGetAlertas() {
  const response = await fetch("/alertas");
  const data = await response.json();

  var table = $('#tbody2').DataTable()
      table.clear();

  for (const key in data.alertas) {
    const rowData = [
    data.alertas[key], 
    data.impactados[key]];
    table.row.add(rowData);
      
      // Atualizar a tabela para refletir as alterações
      if (parseInt(data.impactados) > 100) {
        // Add the CSS styles for background color and text color
        rowData[1] = `<span style="background-color: red; color: white;">${rowData[1]}</span>`;
      }
    }
      table.draw();

    }
//

// Inicializa o vetor no Local Storage
if (!localStorage.getItem("valor_pca")) {
  localStorage.setItem("espera_voz", "[]");
  localStorage.setItem("espera_chat", "[]");
  localStorage.setItem("valor_pca", "[]");

}

function showAlert(valor) {
  var alertDiv = document.getElementById("alerta1");
  alertDiv.style.display = "block";

  var messageDiv = document.getElementById("mensagem_warning");
  alertDiv.style.display = "block";

  // Cria a mensagem com a imagem
  var message = `Atenção! ao PCA ${valor} Valor está caindo! <img src="/static/img/Animation - 1723321581006.gif" alt="" width="45px" height="45px">`;
  messageDiv.innerHTML = message;

  // Ocultar o alerta após 5 segundos
  setTimeout(function () {
    alertDiv.style.display = "none";
  }, 20000);
}

function showAlert1(valor) {
  var alertDiv = document.getElementById("alerta1");
  alertDiv.style.display = "block";

  var messageDiv = document.getElementById("mensagem_up");
  alertDiv.style.display = "block";

  // Cria a mensagem com a imagem
  var message = `Atenção! ao PCA ${valor} Valor está subindo! <img src="/static/img/Animation - 1723321375236.gif" alt="" width="45px" height="45px">`;
  messageDiv.innerHTML = message;

  // Ocultar o alerta após 5 segundos
  setTimeout(function () {
    alertDiv.style.display = "none";
  }, 20000);
}

function showAlert3() {
  var alertDiv = document.getElementById("alerta1");
  alertDiv.style.display = "block";

  var messageDiv = document.getElementById("mensagem_espera_voz");
  alertDiv.style.display = "block";

  // Cria a mensagem com a imagem
  var message = `Atenção ao tamanho da <h4>FILA NO VOZ</h4>, valor está subindo! <img src="/static/img/Animation - 1723321581006.gif" alt="" width="45px" height="45px">`;
  messageDiv.innerHTML = message;

  // Ocultar o alerta após 5 segundos
  setTimeout(function () {
    alertDiv.style.display = "none";
  }, 20000);
}


function monitorarVariavel() {
  // Obter o valor da variável
  var valorPca = document.getElementById("valor_pca").textContent;
  var valorEspera_voz = document.getElementById("valor_espera").textContent;
  var valorEspera_chat = document.getElementById("chatTotal").textContent;

  // Obter o vetor do Local Storage
  var vetorPca = JSON.parse(localStorage.getItem("valor_pca"));
  var vetorEspera_voz = JSON.parse(localStorage.getItem("espera_voz"));
  var vetorEspera_chat = JSON.parse(localStorage.getItem("espera_chat"));
  // Adicionar o novo valor ao vetor
  vetorPca.push(valorPca);
  vetorEspera_voz.push(valorEspera_voz);
  vetorEspera_chat.push(valorEspera_chat);
  // Atualizar o vetor no Local Storage
  localStorage.setItem("valor_pca", JSON.stringify(vetorPca));
  localStorage.setItem("espera_voz", JSON.stringify(vetorEspera_voz));
  localStorage.setItem("espera_chat", JSON.stringify(vetorEspera_chat));

  var mediaMovel =
    (parseFloat(vetorPca[vetorPca.length]) +
      parseFloat(vetorPca[vetorPca.length - 1])+parseFloat(vetorPca[vetorPca.length - 2])) /
    3;
  var valorMaisRecente = parseFloat(vetorPca[vetorPca.length]);
  if (mediaMovel < valorMaisRecente) {
    showAlert(mediaMovel);
  } else {
    showAlert1(valorPca);
  }
  if (parseInt(vetorEspera_voz[vetorEspera_voz.length])>=50){
    showAlert3()
  }
}

