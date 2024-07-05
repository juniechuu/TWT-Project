$(document).ready(function () {
    const addbookForm = $("#addbookForm");
  
    let validISBN = false;
    let validTitle = false;
    let validAuthor = false;
    let validGenre = false;
    let validDesc = false;
  
    addbookForm.on("input", addBookFormValidation);
  
    async function addBookFormValidation(event) {
      let validationMsg = "";

      if (event.target.id === "addbookISBN") {
        if ($("#addbookISBN").val().length > 0) {
          validISBN = true;
          $("#addbookISBN").addClass("is-valid");
          $("#addbookISBN").removeClass("is-invalid");
        } else {
          validISBN = false;
          $("#addbookISBN").addClass("is-invalid");
          $("#addbookISBN").removeClass("is-valid");
          $("#reasonInvalid").html("- This field should not be left empty!");
        }
      }
    }
      
  });