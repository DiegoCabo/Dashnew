$(document).ready(function() {
  $('#example').DataTable({
    "language": {
      "lengthMenu": "Mostrando _MENU_ por página",
      "zeroRecords": "Nenhum registro - desculpe",
      "info": "Mostrando página _PAGE_ de _PAGES_",
      "infoEmpty": "Nenhum registro encontrado",
      "infoFiltered": "(filtered from _MAX_ total)",
      "search": "Buscar",
      "oPaginate": {
        "sFirst": "Primeiro",
        "sPrevious": "Anterior",
        "sNext": "Seguinte",
        "sLast": "Último"
      },
    }
  });
});


function showLoadingPopup() {
    // Exibe o popup
    var popup = document.getElementById("loadingPopup");
    popup.style.display = "block";

    // Simule um carregamento (substitua isso por sua lógica de carregamento)
    setTimeout(function() {
        // Após o carregamento, oculta o popup
        popup.style.display = "none";
    }, 150000); // Neste exemplo, aguardamos 3 segundos, mas você deve ajustar o tempo conforme necessário
}


function fazGET_exportar_Operador(){

  var exportButton = document.getElementById("export-button");
  var table = document.getElementById("example");

  exportButton.addEventListener("click", function() {
    var tableHTML = table.outerHTML.replace(/ /g, "%20");
    var downloadLink = document.createElement("a");
    downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;
    downloadLink.download = 'Operadores_pausas.xls';
    downloadLink.click();
  });
}


function exportar(){
  fazGET_exportar_Operador();
}
