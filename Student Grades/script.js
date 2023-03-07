"use strict";

const promptButtons = document.querySelector(".prompt-buttons");
const inputFLG = document.querySelector(".input-FLG");
const inputFL = document.querySelector(".input-FL");
const submitBtn1 = document.querySelector(".submit-btn-1");
const submitBtn2 = document.querySelector(".submit-btn-2");
const grade = document.querySelector(".Grade");
const fName1 = document.querySelector(".first-name-1");
const lName1 = document.querySelector(".last-name-1");
const fName2 = document.querySelector(".first-name-2");
const lName2 = document.querySelector(".last-name-2");
const resultContainer = document.querySelector(".result-container");
const result = document.querySelector(".result");
const resultExit = document.querySelector(".exit");

function inputGrade() {
  const inputReq = new XMLHttpRequest();
  inputReq.onload = function () {
    if (inputReq.status == 200) {
      const response = JSON.parse(this.responseText);
      result.textContent = Object.entries(response);
    } else {
      result.textContent = "NOT FOUND";
    }
  };
  inputReq.open("POST", "https://amhep.pythonanywhere.com/grades");
  inputReq.setRequestHeader("Content-Type", "application/json");
  inputReq.setRequestHeader("Accept", "application/json");
  inputReq.send(
    `{"name": "${fName1.value} ${lName1.value}", "grade": ${grade.value}}`
  );
  resultContainer.classList.remove("hidden");
  inputFLG.classList.add("hidden");
  fName1.value = lName1.value = grade.value = "";
  submitBtn1.removeEventListener("click", this);
}

function editGrade() {
  console.log("john");
  const editReq = new XMLHttpRequest();
  editReq.onload = function () {
    if (editReq.status == 200) {
      const response = JSON.parse(this.responseText);
      result.textContent = Object.entries(response);
    } else {
      result.textContent = "NOT FOUND";
    }
  };
  editReq.open(
    "PUT",
    `https://amhep.pythonanywhere.com/grades/${fName1.value}%20${lName1.value}`
  );
  editReq.setRequestHeader("Content-Type", "application/json");
  editReq.setRequestHeader("Accept", "application/json");
  editReq.send(`{"grade": ${grade.value}}`);
  resultContainer.classList.remove("hidden");
  inputFLG.classList.add("hidden");
  fName1.value = lName1.value = grade.value = "";
  submitBtn1.removeEventListener("click", this);
}

function getGrade() {
  const getReq = new XMLHttpRequest();
  getReq.onload = function () {
    if (getReq.status == 200) {
      const response = JSON.parse(this.responseText);
      result.textContent =
        Object.keys(response) + ": " + Object.values(response);
    } else {
      result.textContent = "NOT FOUND";
    }
  };
  getReq.open(
    "GET",
    `https://amhep.pythonanywhere.com/grades/${fName2.value}%20${lName2.value}`
  );
  getReq.send();
  resultContainer.classList.remove("hidden");
  inputFL.classList.add("hidden");
  fName2.value = lName2.value = "";
  submitBtn2.removeEventListener("click", this);
}

function deleteGrade() {
  const delReq = new XMLHttpRequest();
  delReq.onload = function () {
    if (delReq.status == 200) {
      const response = JSON.parse(this.responseText);
      result.textContent = Object.entries(response);
    } else {
      result.textContent = "NOT FOUND";
    }
  };
  delReq.open(
    "DELETE",
    `https://amhep.pythonanywhere.com/grades/${fName2.value}%20${lName2.value}`
  );
  delReq.send();
  resultContainer.classList.remove("hidden");
  inputFL.classList.add("hidden");
  fName2.value = lName2.value = "";
  submitBtn2.removeEventListener("click", this);
}

promptButtons.addEventListener("click", function (e) {
  if (e.target.classList.contains("IG")) {
    inputFLG.classList.remove("hidden");
    submitBtn1.addEventListener("click", inputGrade);
  } else if (e.target.classList.contains("GG")) {
    inputFL.classList.remove("hidden");
    submitBtn2.addEventListener("click", getGrade);
  } else if (e.target.classList.contains("EG")) {
    inputFLG.classList.remove("hidden");
    submitBtn1.addEventListener("click", editGrade);
  } else if (e.target.classList.contains("DG")) {
    inputFL.classList.remove("hidden");
    submitBtn2.addEventListener("click", deleteGrade);
  } else if (e.target.classList.contains("GA")) {
    const getAllReq = new XMLHttpRequest();
    getAllReq.onload = function () {
      if (getAllReq.status == 200) {
        const response = JSON.parse(this.responseText);
        result.textContent = Object.entries(response);
        // for (const [key, value] of Object.entries(response)) {
        //   result.textContent = `${key}: ${value}`;
        // }
      } else {
        result.textContent = "NOT FOUND";
      }
    };
    getAllReq.open("GET", "https://amhep.pythonanywhere.com/grades");
    getAllReq.send();
    resultContainer.classList.remove("hidden");
  }
});

resultExit.addEventListener("click", function () {
  resultContainer.classList.add("hidden");
});
