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


$(document).ready(function () {
    setInterval(function () {
        $(".highlight").fadeIn(5000).fadeOut(5000, function () {
            $(this).fadeIn(5000);
        });
    }, 10 * 60 * 1000); // 10 minutos em milissegundos
});

for (var i = 0 ; i <= $('#example').length; i++){
    if ($('#teste').val() >= 100){
        example[i].classList.toggle(".red");
    }

}

/*
ACARAPE
AGUAÍ
ÁGUAS DA PRATA
ALFENAS
ALTEROSA
AQUIRAZ
ARACATI
ARACOIABA
ARARAS
AREADO
ARÊS
ATIBAIA
BAEPENDI
BANDEIRA DO SUL
BATURITÉ
BEBERIBE
BELO HORIZONTE
BOM JESUS DA PENHA
BOTELHOS
BRASÓPOLIS
BREJINHO
CABO VERDE
CACHOEIRA DE MINAS
CACONDE
CALDAS
CAMBUQUIRA
CAMPANHA
CAMPESTRE
CAMPOS GERAIS
CANGUARETAMA
CANINDÉ
CARMO DA CACHOEIRA
CARMO DE MINAS
CASA BRANCA
CASCAVEL
CAUCAIA
CHOROZINHO
CONCEIÇÃO DO RIO VERDE
CONTAGEM
CRISTINA
CRUZÍLIA
DIVINOLÂNDIA
DIVISA NOVA
DOM VIÇOSO
ELÓI MENDES
ESPÍRITO SANTO DO PINHAL
ESTIVA GERBI
EUNÁPOLIS
EUSÉBIO
FAMA
FORTALEZA
FORTIM
GOIANINHA
GUARANÉSIA
GUAXUPÉ
HORIZONTE
IBITIÚRA DE MINAS
IPUIÚNA
ITAITINGA
ITAJUBÁ
ITAMONTE
ITANHANDU
ITAPAGÉ
ITAPIPOCA
ITOBI
JESUÂNIA
JOÃO PESSOA
JURUAIA
LAMBARI
LAVRAS
LIMEIRA
LIMOEIRO DO NORTE
LUMINÁRIAS
MACAÍBA
MACHADO
MARACANAÚ
MARANGUAPE
MARIA DA FÉ
MOCOCA
MOGI GUAÇU
MOGI MIRIM
MONSENHOR PAULO
MONTE ALEGRE
MONTE BELO
MONTE SANTO DE MINAS
MORADA NOVA
MUZAMBINHO
NATAL
NÍSIA FLORESTA
NOVA CRUZ
NOVA RESENDE
PACAJUS
PACATUBA
PACOTI
PARACURU
PARAGUAÇU
PARAIPABA
PARAISÓPOLIS
PARNAMIRIM
PASSA QUATRO
PEDRALVA
POÇOS DE CALDAS
PORTO SEGURO
POUSO ALEGRE
POUSO ALTO
QUIXADÁ
QUIXERAMOBIM
REDENÇÃO
RIO CLARO
RUSSAS
SANTA CRUZ CABRÁLIA
SANTA RITA DE CALDAS
SANTA RITA DO SAPUCAÍ
SANTO ANTÔNIO
SANTO ANTÔNIO DO JARDIM
SÃO BENTO ABADE
SÃO GONÇALO DO AMARANTE
SÃO GONÇALO DO SAPUCAÍ
SÃO JOÃO DA BOA VISTA
SÃO JOSÉ DE MIPIBU
SÃO JOSÉ DO RIO PARDO
SÃO LOURENÇO
SÃO PAULO
SÃO PEDRO
SÃO PEDRO DA UNIÃO
SÃO SEBASTIÃO DA BELA VISTA
SÃO SEBASTIÃO DA GRAMA
SÃO SEBASTIÃO DO RIO VERDE
SÃO THOMÉ DAS LETRAS
SENADOR GEORGINO AVELINO
SERRANIA
SOLEDADE DE MINAS
TAMBAÚ
TAPIRATIBA
TIBAU DO SUL
TRAIRI
TRÊS CORAÇÕES
TRÊS PONTAS
VARGEM GRANDE DO SUL
VARGINHA
VIRGÍNIA*/

function fazGET_manbo(){

  const tamanhoColuna = document.querySelectorAll("td#cidade").length;

  for (let i = 0; i < tamanhoColuna; i++) {

    const cidade = document.querySelectorAll("td#cidade")[i].textContent;
    if (cidade == "NATAl"){
        window.open("https://manbo.go.akamai-access.com/outage/edit/31", "_blank");
    }else{  
        console.log("Desculpe, estamos sem nenhuma");
    }
  }
}

async function fazGET30(){
  try {
    const response = await fetch("/grafico30");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["bairro"]);
    const contagem1 = Object.values(banco1["quantidade"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
        marker:{
          color: [],
        }
      },
    ];

    const layout1 = {
      height: 380,
      width: 1850,
      title: "Contatos por Cidade/Bairro",
    };

    const corVermelha = "#FF0000";
    const corPadrao = "#7B68EE";
    const gold = "#FFD700";
    const amarelo ="#FFFF00";

    for (let i = 0; i < yarray1.length; i++) {
      data1[0].marker.color.push(yarray1[i] >= 20 ? corVermelha : corPadrao);
    }
    
    Plotly.newPlot("myDiv2", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fazGET60(){
  try {
    const response = await fetch("/grafico60");
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados da API");
    }
    const banco1 = await response.json();
    const assunto1 = Object.values(banco1["cidade_ibge"]);
    const contagem1 = Object.values(banco1["count"]);

    const xarray1 = assunto1;
    const yarray1 = contagem1;

    const data1 = [
      {
        x: xarray1,
        y: yarray1,
        type: "bar",
        text: yarray1,
        marker: {
          color:[],
        }
      },
    ];

    const layout1 = {
      height: 380,
      width: 1850,
      title: "Derivações por Cidade",
    };

    const corVermelha = "#FF0000";
    const corPadrao = "#7B68EE";

    for (let i = 0; i < yarray1.length; i++) {
      data1[0].marker.color.push(yarray1[i] > 5 ? corVermelha : corPadrao);
    }

    Plotly.newPlot("myDiv3", data1, layout1);
  } catch (error) {
    console.error("Erro:", error);
  }
}
/*
async function fazGET_caminhos() {
  const response = await fetch(`/caminhos`);
  const data = await response.json();

  const tbody = document.getElementById('tabelaBody');

  // Limpar o conteúdo existente da tabela
  tbody.innerHTML = '';

  // Iterar sobre os dados e criar as linhas da tabela
  for (const key in data.assunto) {
    const row = document.createElement('tr');

    const cellAssunto = document.createElement('td');
    cellAssunto.textContent = data.assunto[key];

    const cellContrato = document.createElement('td');
    cellContrato.textContent = data.contrato[key];

    const cellBairro = document.createElement('td');
    cellBairro.textContent = data.bairro[key];

    const cellCidadeRegistro = document.createElement('td');
    cellCidadeRegistro.textContent = data.cidade_registro[key];

    const cellUF = document.createElement('td');
    cellUF.textContent = data.uf[key];

    const cellKey = document.createElement('td');
    cellKey.textContent = data.key[key];

    // Adicionar as células à linha
    row.appendChild(cellAssunto);
    row.appendChild(cellContrato);
    row.appendChild(cellBairro);
    row.appendChild(cellCidadeRegistro);
    row.appendChild(cellUF);
    row.appendChild(cellKey);

    // Adicionar a linha à tabela
    tbody.appendChild(row);
  }
}
*/
async function fazGET_caminhos() {
  const response = await fetch(`/caminhos`);
  const data = await response.json();

  const table = $('#tbody').DataTable();

  // Limpar o conteúdo existente da tabela
  table.clear();

  // Iterar sobre os dados e adicionar as linhas à tabela
  for (const key in data.data_cadastro) {
    const rowData = [
      new Date(data.data_cadastro[key]),
      data.hora_cadastro[key],
      data.assunto[key],
      data.contrato[key],
      data.bairro[key],
      data.cidade_registro[key],
      data.uf[key],
      new Date(data.data_processamento[key]),
      data.key[key]
    ];

    // Adicionar a linha à tabela usando o DataTables
    table.row.add(rowData);
  }

  // Atualizar a tabela para refletir as alterações
  table.draw();
}

$(document).ready(function() {
  $('#tbody').DataTable();
});

function caminhos(){
  fazGET_caminhos();
}

function grafico30(){
  fazGET30();
}

setInterval(() => {
  fazGET_caminhos();
}, 300000);

setInterval(() => {
  grafico30();
}, 300000);

function grafico60(){
  fazGET60();
}

setInterval(() => {
  grafico60();
}, 300000);

