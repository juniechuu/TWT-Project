function getDateAfter(days) {
  var today = new Date(); // Get today's date

  // Calculate the date after adding the number of days
  var afterDate = new Date(today);
  afterDate.setDate(today.getDate() + days);

  // Get the components of the afterDate
  var day = afterDate.getDate();
  var month = afterDate.getMonth() + 1; // JavaScript months are 0-based
  var year = afterDate.getFullYear();

  // Format the date as YYYY-MM-DD
  var formattedDate = month + "-" + day + "-" + year;

  return formattedDate;
}

function convertTo12HourFormat(timeStr) {
  // Split the time string into hours, minutes, and seconds
  let [hours, minutes] = timeStr.split(":").slice(0, 2);

  // Convert hours from string to number
  hours = parseInt(hours);

  // Determine AM or PM
  let period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' should be '12'

  // Format the time as 'h:mm AM/PM'
  let formattedTime = hours + ":" + minutes + " " + period;

  return formattedTime;
}

function combineAddress(record) {
  let addressParts = [record[8], record[9], record[10], record[11]];
  let combinedAddress = addressParts.filter((part) => part !== "").join(", ");
  return combinedAddress;
}

function getDateAfterUnf(days) {
  var today = new Date(); // Get today's date

  // Calculate the date after adding the number of days
  var afterDate = new Date(today);
  afterDate.setDate(today.getDate() + days);

  // Get the components of the afterDate
  var day = afterDate.getDate();
  var month = afterDate.getMonth() + 1; // JavaScript months are 0-based
  var year = afterDate.getFullYear();

  // Format the date as YYYY-MM-DD
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}
