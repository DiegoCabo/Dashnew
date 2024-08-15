const url_headcount_sac = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=50`;
const url_headcount_hd = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=51`;
const url_headcount_sac_rn = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=32`;
const url_headcount_sac_ce = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=46`;
const url_headcount_sac_se = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=28`;
const url_headcount_hd_rn = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=33`;
const url_headcount_hd_ce = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=45`;
const url_headcount_hd_se = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=29`;
const url_headcount_ret = `https://cors-anywhere.herokuapp.com/https://grupo-conexao.evolux.io/api/realtime/v1/queue?group_id=39`;

//===============================================================================

async function fazHeadsac() {
    const myHeaders = new Headers();
    myHeaders.append("token", "12bd5463-129d-4d12-bc84-b04d0f7562b5");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_sac, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);
    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
  
    var logadosSAC = (document.getElementById("sacHC").innerHTML = cont);
    var totalhc = document.getElementById("totalHCsac").value;
    var abs = ((logadosSAC / totalhc) * 100).toFixed(1) + "%";
    document.getElementById("percentABSsac").innerHTML = abs;
  }
  //===============================================================================
  
  async function fazHeadhd() {
    const myHeaders = new Headers();
    myHeaders.append("token", "8f36aeaf-eb03-429a-8f1d-e8a7822c906a");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_hd, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    var logadosHD = (document.getElementById("hdHC").innerHTML = cont);
    var totalhchd = document.getElementById("totalHChd").value;
    var abs1 = ((logadosHD / totalhchd) * 100).toFixed(1) + "%";
    document.getElementById("percentABShd").innerHTML = abs1;
  }
  
  //===============================================================================
  async function fazHeadsacrn() {
    const myHeaders = new Headers();
    myHeaders.append("token", "12bd5463-129d-4d12-bc84-b04d0f7562b5");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_sac_rn, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#rnsacHC").html(cont);
  }
  
  //===============================================================================

  async function fazHeadsacce() {
    const myHeaders = new Headers();
    myHeaders.append("token", "8f36aeaf-eb03-429a-8f1d-e8a7822c906a");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_sac_ce, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#cesacHC").html(cont);
  }
  
  //===============================================================================
  
  async function fazHeadsacse() {
    const myHeaders = new Headers();
    myHeaders.append("token", "12bd5463-129d-4d12-bc84-b04d0f7562b5");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_sac_se, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#sesacHC").html(cont);
  }
  
  //===============================================================================

  async function fazHeadhdrn() {
    const myHeaders = new Headers();
    myHeaders.append("token", "12bd5463-129d-4d12-bc84-b04d0f7562b5");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_hd_rn, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#rnhdHC").html(cont);
  }
  
  //===============================================================================

  async function fazHeadhdce() {
    const myHeaders = new Headers();
    myHeaders.append("token", "8f36aeaf-eb03-429a-8f1d-e8a7822c906a");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_hd_ce, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#cehdHC").html(cont);
  }
  
  //===============================================================================
  
  async function fazHeadhdse() {
    const myHeaders = new Headers();
    myHeaders.append("token", "12bd5463-129d-4d12-bc84-b04d0f7562b5");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_hd_se, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#sehdHC").html(cont);
  }
  
  //===============================================================================

  async function fazHeadret() {
    const myHeaders = new Headers();
    myHeaders.append("token", "8f36aeaf-eb03-429a-8f1d-e8a7822c906a");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url_headcount_ret, requestOptions);
    const data = await response.json();
    let vetor = Object.entries(data.data.agents);

    var b = 0;
    for (let i = 0; i < vetor.length; i++) {
      if (vetor[i][1].logged == true) {
        var cont = b++;
      }
    }
    $("#rethdHC").html(cont);
  }
  
  //===============================================================================