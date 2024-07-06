$(document).ready(function () {
    const removeBookForm = $("#removebook");
    let validTitle = false;
    let validDesc = false;

    // Fetch book titles and populate dropdown
    $.ajax({
        url: '/get_books',
        type: 'GET',
        success: function(data) {
            var dropdown = $('#dropdownId');
            data.forEach(function(book) {
                dropdown.append($('<option>', {
                    value: book.book_title,
                    text: book.book_title
                }));
            });
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });

    removeBookForm.on("input", validateForm);

    removeBookForm.on("submit", function(event) {
        if (!validTitle || !validDesc) {
            event.preventDefault();
        }
    });

    function validateForm(event) {
        let targetId = event.target.id;

        if (targetId === "dropdownId") {
            validTitle = $("#dropdownId").val() !== "";
            toggleValidationClass("#dropdownId", validTitle);
        } else if (targetId === "reasonDelete") {
            validDesc = $("#reasonDelete").val().trim() !== "";
            toggleValidationClass("#reasonDelete", validDesc);
        }

        $("#MAbtn").prop("disabled", !(validTitle && validDesc));
    }

    function toggleValidationClass(selector, isValid) {
        if (isValid) {
            $(selector).removeClass("is-invalid").addClass("is-valid");
        } else {
            $(selector).removeClass("is-valid").addClass("is-invalid");
        }
    }
});