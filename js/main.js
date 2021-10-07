"use strict";

const get = (target) => {
  return document.querySelector(target);
};

const INPUT = get("#input");
const CBTN = get("#c-btn");
const INNER_CONTAINER = get("#inner-container");

const useMic = () => {
  let recognition = new webkitSpeechRecognition();

  recognition.continous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (e) => {
    var transcription = "";

    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        transcription = e.results[i][0].transcript;
        INPUT.value = transcription[0].toUpperCase() + transcription.slice(1);
        recognition.stop();
      }
    }
  };

  recognition.start();
};

const list = () => {
  INNER_CONTAINER.innerHTML = "";

  for (let item in localStorage) {
    if (!isNaN(item)) {
      let template = `
      <div class="border-top border-white p-3 rounded task-container" id="${item}">
        <span class="lead">
          ${localStorage.getItem(item).replace(/^\([0-9]+\)/, "")}
        </span>
        <button class="btn btn-success float-end"><i class="fas fa-check"></i></button>
      </div>`;

      INNER_CONTAINER.innerHTML += template;
    }
  }
};

const addEvents = () => {
  INNER_CONTAINER.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "I") {
      removeTask(e.target.parentNode.getAttribute("id"));
      reload();
    }
  });
};

const reload = () => {
  list();
  INPUT.value = "";
};

const addTask = () => {
  let id = localStorage.length + 1;

  if (INPUT.value.length !== 0) {
    localStorage.setItem(id, `(${id})${INPUT.value}`);
    reload();
  }
};

const removeTask = (id) => {
  localStorage.removeItem(id);
};

const initApp = () => {
  get("#r-btn").addEventListener("click", () => {
    INPUT.value = "";
    useMic();
  });

  CBTN.addEventListener("click", addTask);

  addEvents();

  list();
};

window.addEventListener("DOMContentLoaded", initApp);
