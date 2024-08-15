// Wait for the document to load
document.addEventListener("DOMContentLoaded", function() {
    // Get all the table cells
    var cells = document.querySelectorAll("#id1");
  
    // Iterate through each cell
    cells.forEach(function(cell) {
      // Get the cell's text content and convert it to a number
      var number = parseFloat(cell.textContent);
  
      // Check if the number is greater than 10
      if (number > 10) {
        // Apply the "red-number" class to the cell
        cell.classList.add("red-number");
      }
    });
  });