$(document).ready(function () {
    const addbookForm = $("#addbookForm");

    // Validation variables
    let validISBN = false;
    let validTitle = false;
    let validAuthor = false;
    let validGenre = false;
    let validDesc = false;

    // Feedback messages
    const feedback = {
        addbookISBN: { invalid: "#isbnInvalid", valid: "#isbnValid" },
        addbookTitle: { invalid: "#titleInvalid", valid: "#titleValid" },
        addbookAuthor: { invalid: "#authorInvalid", valid: "#authorValid" },
        addbookGenre: { invalid: "#genreInvalid", valid: "#genreValid" },
        addbookDesc: { invalid: "#descInvalid", valid: "#descValid" }
    };

    // Function to update validation state
    function updateValidationState(input, isValid) {
        const feedbackInvalid = $(feedback[input].invalid);
        const feedbackValid = $(feedback[input].valid);

        if (isValid) {
            feedbackInvalid.hide();
            feedbackValid.show();
        } else {
            feedbackInvalid.show();
            feedbackValid.hide();
        }
    }

    // Function to check all fields and enable/disable submit button
    function checkFormValidity() {
        if (validISBN && validTitle && validAuthor && validGenre && validDesc) {
            $("#MAbtn").prop("disabled", false);
        } else {
            $("#MAbtn").prop("disabled", true);
        }
    }

    // Event listener for input changes
    addbookForm.on("input", "textarea, select", function (event) {
        const id = $(this).attr("id");
        const value = $(this).val().trim();

        switch (id) {
            case "addbookISBN":
                validISBN = value.length > 0;
                break;
            case "addbookTitle":
                validTitle = value.length > 0;
                break;
            case "addbookAuthor":
                validAuthor = value.length > 0;
                break;
            case "addbookGenre":
                validGenre = value !== "";
                break;
            case "addbookDesc":
                validDesc = value.length > 0;
                break;
            default:
                break;
        }

        updateValidationState(id, value.length > 0);
        checkFormValidity();
    });

    // Initial validation check
    checkFormValidity();
});