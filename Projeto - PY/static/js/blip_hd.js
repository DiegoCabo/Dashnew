async function fazBliphd() {
		
    var myHeaders_RN = new Headers();
    myHeaders_RN.append(
      "Authorization",
      "Key YWxhcmVzYXRlbmRodW1hcHJvZDoyRVFxNVRPMWRkSXVYdXQ0SVRhWA=="
    );
    myHeaders_RN.append("Content-Type", "application/json");
  
    var raw_RN = JSON.stringify({
      id: "31e90435-60c9-47b0-800e-4b500cbe8111",
      to: "postmaster@desk.msging.net",
      method: "get",
      uri: "/monitoring/teams",
    });
  
    var requestOptions_RN = {
      method: "POST",
      headers: myHeaders_RN,
      body: raw_RN,
      redirect: "follow",
    };
   
    const response_RN = await fetch(
      "https://grupoconexao.http.msging.net/commands",
      requestOptions_RN
    );
  
    const data_RN = await response_RN.json();
     
    var vetor_RN = Object.entries(data_RN.resource);
    var vetorRN = vetor_RN[2][1];

    for (var i = 0; i <= vetorRN.length; i++) {
      if (vetorRN[i].name == "HelpDesk") {
        var CC_RN_hd = vetorRN[i].closedTickets;
        var CC_RN_open_hd = vetorRN[i].waitingTickets;
        var CC_RN_tma_hd = vetorRN[i].averageAttendanceTime;
        if (vetorRN[i].averageWaitTime == undefined) {
          var CC_RN_wait_hd = "00:00:00";
        } else {
          var CC_RN_wait_hd = vetorRN[i].averageWaitTime;
        }
    
                        var totalHD = CC_RN_hd;
                        var atendidasHD = CC_RN_open_hd;
                        var CC_RN_tme_hd = CC_RN_wait_hd;
                        var CC_RN_tma_hd = CC_RN_tma_hd;
                        console.log(CC_RN_tma_hd)

                        document.getElementById("totalHDblip").innerHTML = totalHD;
                        document.getElementById("total_emEspera").innerHTML = atendidasHD;
                        document.getElementById("total_tme").innerHTML = CC_RN_wait_hd;
                        document.getElementById("total_tma").innerHTML = CC_RN_tma_hd;

                        var waittimeCChd = [
                          CC_RN_wait_hd];
                        var tmatimeCChd = [
                          CC_RN_tma_hd];
  
                        var hms0 = waittimeCChd[0];
                        var a0 = hms0.split(":");
                        var seconds0 = +a0[0] * 60 * 60 + +a0[1] * 60 + +a0[2];
  
                        var tempo =
                          seconds0 * CC_RN_hd/atendidasHD;
  
                        var given_seconds_tme = tempo;
                        var given_seconds_tme_RN = seconds0;
 
                        var hours = Math.floor(given_seconds_tme / 3600);
                        var minutes = Math.floor((given_seconds_tme - hours * 3600) / 60);
                        var seconds = given_seconds_tme - hours * 3600 - minutes * 60;
  
                        var hours_rn = Math.floor(given_seconds_tme_RN / 3600);
                        var minutes_rn = Math.floor((given_seconds_tme_RN - hours_rn * 3600) / 60);
                        var seconds_rn = given_seconds_tme_RN - hours_rn * 3600 - minutes_rn * 60;
  
                        var timeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" +
                          Math.floor(seconds.toString().padStart(2, "0"));
                        var timeString_rn = hours_rn.toString().padStart(2, "0") + ":" + minutes_rn.toString().padStart(2, "0") + ":" +
                          Math.floor(seconds_rn.toString().padStart(2, "0"));
     
  
                        document.getElementById("tme_consolidadoHDblip").innerHTML = timeString;
                        document.getElementById("tme_hd_rn").innerHTML = timeString_rn;

                        var hms0tma = tmatimeCChd[0];
                        var a0tma = hms0tma.split(":");
                        var seconds0tma =
                          +a0tma[0] * 60 * 60 + +a0tma[1] * 60 + +a0tma[2];
  
                        var hms1tma = tmatimeCChd[1];
                        var a1tma = hms1tma.split(":");
                        var seconds1tma =
                          +a1tma[0] * 60 * 60 + +a1tma[1] * 60 + +a1tma[2];
  
                        var hms2tma = tmatimeCChd[2];
                        var a2tma = hms2tma.split(":");
                        var seconds2tma =
                          +a2tma[0] * 60 * 60 + +a2tma[1] * 60 + +a2tma[2];
  
                        var hms3tma = tmatimeCChd[3];
                        var a3tma = hms3tma.split(":");
                        var seconds3tma =
                          +a3tma[0] * 60 * 60 + +a3tma[1] * 60 + +a3tma[2];
  
                        var hms4tma = tmatimeCChd[4];
                        var a4tma = hms4tma.split(":");
                        var seconds4tma =
                          +a4tma[0] * 60 * 60 + +a4tma[1] * 60 + +a4tma[2];
  
                        var tempotma =(seconds0tma * CC_RN_hd + seconds1tma * CC_RN2_hd + seconds2tma * CC_RN3_hd + seconds3tma * CC_RN4_hd +
                            seconds4tma * CC_RN5_hd) / atendidasHD;
  
                        var given_seconds_tma = tempotma;
                        var given_seconds_tma_RN = seconds0tma;
                        var given_seconds_tma_CE = seconds3tma;
                        var given_seconds_tma_SE = (seconds1tma * CC_RN2_hd+seconds2tma * CC_RN3_hd+seconds4tma * CC_RN5_hd)/(CC_RN2_hd+CC_RN3_hd+CC_RN5_hd);
                      
                        var hourstma = Math.floor(given_seconds_tma / 3600);
                        var minutestma = Math.floor(
                          (given_seconds_tma - hourstma * 3600) / 60
                        );
                        var secondstma =
                          given_seconds_tma - hourstma * 3600 - minutestma * 60;
  
                        var timeStringtma =
                          hourstma.toString().padStart(2, "0") +
                          ":" +
                          minutestma.toString().padStart(2, "0") +
                          ":" +
                          Math.floor(secondstma.toString().padStart(2, "0"));
  
                        var hours_tma_rn = Math.floor(given_seconds_tma_RN / 3600);
                        var minutes_tma_rn = Math.floor((given_seconds_tma_RN - hours_tma_rn * 3600) / 60);
                        var seconds_tma_rn = given_seconds_tma_RN - hours_tma_rn * 3600 - minutes_tma_rn * 60;
  
                        var hours_tma_ce = Math.floor(given_seconds_tma_CE / 3600);
                        var minutes_tma_ce = Math.floor((given_seconds_tma_CE - hours_tma_ce * 3600) / 60);
                        var seconds_tma_ce = given_seconds_tma_CE - hours_tma_ce * 3600 - minutes_tma_ce * 60;
  
                        var hours_tma_se = Math.floor(given_seconds_tma_SE / 3600);
                        var minutes_tma_se = Math.floor((given_seconds_tma_SE - hours_tma_se * 3600) / 60);
                        var seconds_tma_se = given_seconds_tma_SE - hours_tma_se * 3600 - minutes_tma_se * 60;
  
                        var timeStringtma_rn = hours_tma_rn.toString().padStart(2, "0") + ":" + minutes_tma_rn.toString().padStart(2, "0") + ":" +
                          Math.floor(seconds_tma_rn.toString().padStart(2, "0"));
                        var timeStringtma_ce = hours_tma_ce.toString().padStart(2, "0") + ":" + minutes_tma_ce.toString().padStart(2, "0") + ":" +
                          Math.floor(seconds_tma_ce.toString().padStart(2, "0"));
                          var timeStringtma_se = hours_tma_se.toString().padStart(2, "0") + ":" + minutes_tma_se.toString().padStart(2, "0") + ":" +
                          Math.floor(seconds_tma_se.toString().padStart(2, "0"));
  
                        document.getElementById("tma_consolidadoHDblip").innerHTML = timeStringtma;   
                        document.getElementById("tma_hd_rn_blip").innerHTML = timeStringtma_rn;
                     }
                    }
                  }
