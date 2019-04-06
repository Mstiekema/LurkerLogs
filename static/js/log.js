let dateAsClock = document.getElementById("dateAsClock");
let rawDate = document.getElementsByClassName("rawDate");
let clockDate = document.getElementsByClassName("clockDate");

if (dateAsClock.checked) {
  setVisibility(rawDate, "none");
} else {
  setVisibility(clockDate, "none");
}


function setVisibility(arr, type) {
  for (let e in arr) {
    if (isNaN(e)) break;
    arr.item(e).style.display = type;
  }
}

dateAsClock.addEventListener('click', function(e) {
  if (this.checked) {
    setVisibility(rawDate, "none");
    setVisibility(clockDate, "inline");
  } else {
    setVisibility(rawDate, "inline");
    setVisibility(clockDate, "none");
  }
});

document.getElementById("selectDate").addEventListener('blur', function(e) {
  document.location += "?date=" + this.value
});
