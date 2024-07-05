$(document).ready(function () {
  const signUpForm = $("#signupForm");

  let validEmail = false;
  let validPass = false;
  let validName = false;
  let validGender = false;
  let validPhone = false;
  let validIC = false;
  let validCity = false;
  let validState = false;
  let validAddress = false;
  let validZip = false;

  signUpForm.on("input", signUpFormValidation);
  signUpForm.on("change", signUpFormValidation);

  function signUpFormValidation(event) {
    let validationMsg = "";

    if (event.target.id === "regisEmail") {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
      const email = event.target.value.trim();
      const emailLength = email.length;
      const emailField = document.getElementById("regisEmail");
      const emailFieldInvalid = document.getElementById("regisEmailInvalid");

      if (!emailRegex.test(email)) {
        validationMsg += "- Please enter a valid email address!<br>";
      }
      if (emailLength < 1) {
        validationMsg += "- This field should not be left empty!<br>";
      }
      if (!emailRegex.test(email) || emailLength < 1) {
        emailField.classList.remove("is-valid");
        emailField.classList.add("is-invalid");
        validEmail = false;
      } else {
        emailField.classList.add("is-valid");
        emailField.classList.remove("is-invalid");
        validEmail = true;
      }
      emailFieldInvalid.innerHTML = validationMsg;
    } else if (
      event.target.id === "regisPassword" ||
      event.target.id === "regisComPassword"
    ) {
      const passField = document.getElementById("regisPassword");
      const cfmPassField = document.getElementById("regisComPassword");
      const passFieldInvalid = document.getElementById("regisPassInvalid");
      const passFieldValid = document.getElementById("regisPassValid");

      if (passField.value.length < 1) {
        validationMsg += "- This field should not be left empty!<br>";
      }
      if (passField.value.length < 9 || passField.value.length > 30) {
        validationMsg += "- Password length: 9-30!<br>";
      }

      if (passField.value !== cfmPassField.value) {
        validationMsg += "- Passwords are not matched!<br>";
      }

      let hasSymbol = false;
      const symbolsRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
      for (let i = 0; i < passField.value.length; i++) {
        const character = passField.value[i];
        if (symbolsRegex.test(character)) {
          hasSymbol = true;
          break;
        }
      }

      let hasUppercase = false;
      for (let i = 0; i < passField.value.length; i++) {
        const character = passField.value[i];
        if (character !== character.toLowerCase()) {
          hasUppercase = true;
          break;
        }
      }

      let hasNumber = false;
      for (let i = 0; i < passField.value.length; i++) {
        const character = passField.value[i];
        if (!isNaN(character)) {
          hasNumber = true;
          break;
        }
      }

      if (
        passField.value.length < 1 ||
        passField.value.length < 9 ||
        passField.value.length > 30 ||
        passField.value !== cfmPassField.value
      ) {
        if (
          passField.value.length > 11 && //Evaluate password strength
          hasSymbol &&
          hasUppercase &&
          hasNumber
        ) {
          validationMsg += "- Password Strength: Strong<br>";
        } else if (passField.value.length > 8) {
          validationMsg += "- Password Strength: Moderate<br>";
        } else {
          validationMsg += "- Password Strength: Weak<br>";
        }

        passFieldInvalid.innerHTML = validationMsg;
        passField.classList.add("is-invalid");
        passField.classList.remove("is-valid");
        cfmPassField.classList.add("is-invalid");
        cfmPassField.classList.remove("is-valid");
        validPass = false;
      } else {
        validationMsg += "- Looks good!<br>";
        if (
          passField.value.length > 11 && //Evaluate password strength
          hasSymbol &&
          hasUppercase &&
          hasNumber
        ) {
          validationMsg += "- Password Strength: Strong<br>";
        } else {
          validationMsg += "- Password Strength: Moderate<br>";
        }
        passFieldValid.innerHTML = validationMsg;
        passField.classList.add("is-valid");
        passField.classList.remove("is-invalid");
        cfmPassField.classList.add("is-valid");
        cfmPassField.classList.remove("is-invalid");
        validPass = true;
      }
    } else if (event.target.id === "regisName") {
      //REGISTER NAME FIELD LENGTH

      const name = event.target.value.trim();
      const nameLength = name.length;
      const nameField = document.getElementById("regisName");
      const nameFieldInvalid = document.getElementById("regisNameInvalid");
      const nameRegex = /[^a-zA-Z\s]/g;
      nameField.value = nameField.value.replace(nameRegex, "");

      if (nameLength < 2 || nameLength > 50) {
        validationMsg += "- Name length: 2-50!<br>";
      }
      if (nameLength < 1) {
        validationMsg += "- This field should not be left empty!<br>";
      }

      nameFieldInvalid.innerHTML = validationMsg;

      if (nameLength < 2 || nameLength > 50 || nameLength < 1) {
        nameField.classList.add("is-invalid");
        nameField.classList.remove("is-valid");
        validName = false;
      } else {
        nameField.classList.remove("is-invalid");
        nameField.classList.add("is-valid");
        validName = true;
      }
    } else if (event.target.id === "regisPhone") {
      const phone = event.target.value.trim();
      const phoneRegex = /^\+\d{10,15}$/;
      const phoneLength = phone.length;
      const phoneField = document.getElementById("regisPhone");
      const phoneFieldInvalid = document.getElementById("regisPhoneInvalid");

      if (!phoneRegex.test(phone)) {
        validationMsg +=
          '- "+" should be include in a length of 10 to 15 phone number!<br>';
      }
      if (phoneLength < 1) {
        validationMsg += "- This field should not be left empty!<br>";
      }

      phoneFieldInvalid.innerHTML = validationMsg;

      if (!phoneRegex.test(phone) || phoneLength < 1) {
        phoneField.classList.add("is-invalid");
        phoneField.classList.remove("is-valid");
        validPhone = false;
      } else {
        phoneField.classList.remove("is-invalid");
        phoneField.classList.add("is-valid");
        validPhone = true;
      }
    } else if (event.target.id === "regisGender") {
      let selectedGender = document.getElementById("regisGender");
      if (
        selectedGender.value === "Male" ||
        selectedGender.value === "Female"
      ) {
        selectedGender.classList.remove("is-invalid");
        selectedGender.classList.add("is-valid");
        validGender = true;
      } else {
        selectedGender.classList.add("is-invalid");
        selectedGender.classList.remove("is-valid");
        validGender = false;
      }
    } else if (event.target.id === "regisIc_num") {
      const IC = event.target.value.trim();
      const ICfield = document.getElementById("regisIc_num");
      const icRegex = /^\d+$/;
      const icInvalid = document.getElementById("regisICInvalid");
      if (!icRegex.test(IC)) {
        validationMsg += 'Student ID should be in numerical values!';

        ICfield.classList.add("is-invalid");
        ICfield.classList.remove("is-valid");

        validIC = false;
      } else {
        ICfield.classList.remove("is-invalid");
        ICfield.classList.add("is-valid");

        validIC = true;
      }
      icInvalid.innerHTML = validationMsg;
    } else if (event.target.id === "regisCity") {
      const cityField = document.getElementById("regisCity");
      const cityInvalid = document.getElementById("regisCityInvalid");

      if (cityField.value.length < 1) {
        validationMsg += "- This field should not be left empty!<br>";
        cityInvalid.innerHTML = validationMsg;
        cityField.classList.add("is-invalid");
        cityField.classList.remove("is-valid");
        validCity = false;
      } else {
        cityField.classList.add("is-valid");
        cityField.classList.remove("is-invalid");
        validCity = true;
      }
    } else if (event.target.id === "regisState") {
      let selectedState = document.getElementById("regisState");
      if (
        selectedState.value === "Johor" ||
        selectedState.value === "Kedah" ||
        selectedState.value === "Kelantan" ||
        selectedState.value === "Malacca" ||
        selectedState.value === "Negeri Sembilan" ||
        selectedState.value === "Pahang" ||
        selectedState.value === "Penang" ||
        selectedState.value === "Perak" ||
        selectedState.value === "Perlis" ||
        selectedState.value === "Sabah" ||
        selectedState.value === "Sarawak" ||
        selectedState.value === "Selangor" ||
        selectedState.value === "Terengganu"
      ) {
        selectedState.classList.remove("is-invalid");
        selectedState.classList.add("is-valid");
        validState = true;
      } else {
        selectedState.classList.add("is-invalid");
        selectedState.classList.remove("is-valid");
        validState = false;
      }
    } else if (event.target.id === "regisAddress") {
      const addressField = document.getElementById("regisAddress");
      const addressInvalid = document.getElementById("regisAddressInvalid");

      if (addressField.value.length < 1) {
        validationMsg += "- This field should not be left empty!<br>";
        addressInvalid.innerHTML = validationMsg;
        addressField.classList.add("is-invalid");
        addressField.classList.remove("is-valid");
        validAddress = false;
      } else {
        addressField.classList.add("is-valid");
        addressField.classList.remove("is-invalid");
        validAddress = true;
      }
    } else if (event.target.id === "regisZipcode") {
      const zipField = document.getElementById("regisZipcode");
      const zipInvalid = document.getElementById("regisZipInvalid");
      if (zipField.value < 10000 || zipField.value > 99999) {
        validationMsg += "- Zipcode should be in exactly 5 digits without!<br>";

        zipField.classList.add("is-invalid");
        zipField.classList.remove("is-valid");

        validZip = false;
      } else {
        zipField.classList.remove("is-invalid");
        zipField.classList.add("is-valid");

        validZip = true;
      }
      zipInvalid.innerHTML = validationMsg;
    }
    const submitBtn = document.getElementById("signUpBtn");
    console.log(
      validEmail,
      validGender,
      validIC,
      validName,
      validPass,
      validPhone,
      validState,
      validZip,
      validAddress,
      validCity
    );
    if (
      validEmail &&
      validGender &&
      validIC &&
      validName &&
      validPass &&
      validPhone &&
      validState &&
      validZip &&
      validAddress &&
      validCity
    ) {
      submitBtn.classList.remove("disabled");
    } else {
      submitBtn.classList.add("disabled");
    }
  }
});
