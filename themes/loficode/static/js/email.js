function showContact() {
  document.querySelector("dialog").showModal();
  let elem = document.getElementById("dec-contact");
  let email = atob("aGVsbG9AZ3ZvbHBlLmNvbQo=");
  elem.text = email;
  elem.href = "mailto:" + email;
}
