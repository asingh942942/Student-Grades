"use strict";

const stu_name = document.querySelector(".student-name");
const grade = document.querySelector(".grade");
const submitBtn = document.querySelector(".submitBtn");

const get_stu_name = document.querySelector(".get-student-name");
const get_submitBtn = document.querySelector(".get-submitBtn");

const del_stu_name = document.querySelector(".del-student-name");
const del_submitBtn = document.querySelector(".del-submitBtn");

const get_all_submitBtn = document.querySelector(".get-all-submitBtn");

const resultBox = document.querySelector(".result-box");
const result = document.querySelector(".results");
const exit = document.querySelector(".exit");

function inputGrade() {
  handleResults();
  fetch("/grades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: stu_name.value, grade: Number(grade.value) }),
    // body: '{"name": "Will Taft", "grade": 25}' <---- could also do this since it's also a JSON string
  })
    .then((response) => response.json()) // json() returns a promise that turns the response from the fetch request from json into a js object
    .then((data) => handleData(data))
    .catch((error) => {
      console.error("Error:", error);
    });

  resultBox.classList.remove("hidden");
  stu_name.value = grade.value = "";
  submitBtn.removeEventListener("click", this);
}

function getGrade() {
  handleResults();
  fetch(`/grades/${get_stu_name.value}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => (result.innerHTML = `<span class="entry">${data}</span>`))
    .catch((error) => console.error("Error:", error));

  resultBox.classList.remove("hidden");
  get_stu_name.value = "";
  get_submitBtn.removeEventListener("click", this);
}

function deleteGrade() {
  handleResults();
  fetch(`/grades/${del_stu_name.value}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data == "Not Found") {
        result.innerHTML = `<span class="entry">Not Found</span>`;
      } else handleData(data);
    })
    .catch((error) => console.error("Error:", error));

  resultBox.classList.remove("hidden");
  del_stu_name.value = "";
  del_submitBtn.removeEventListener("click", this);
}

function getAllGrades() {
  handleResults();
  fetch("/grades/all", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => handleData(data))
    .catch((error) => console.error("Error:", error));

  resultBox.classList.remove("hidden");
  get_all_submitBtn.removeEventListener("click", this);
}

function handleData(data) {
  for (const entry of Object.entries(data)) {
    const [key, value] = entry;
    result.innerHTML += `<span class="entry">${key}: ${value}</span>`;
  }
}

function handleResults() {
  resultBox.classList.add("hidden");
  result.innerHTML = "";
}

submitBtn.addEventListener("click", inputGrade);
get_submitBtn.addEventListener("click", getGrade);
del_submitBtn.addEventListener("click", deleteGrade);
get_all_submitBtn.addEventListener("click", getAllGrades);
resultBox.addEventListener("click", handleResults);
