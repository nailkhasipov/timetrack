'use strict';

let current, timer;
let storage = JSON.parse(localStorage.getItem('storage') ) ||
              {'tasks': []};

if (storage.tasks[0] && storage.tasks[0].endAt === null) {
  current = storage.tasks[0];
  start();
}

updateView();

function start(create) {
  if (create) {
    current = {
      title: document.querySelector('#input').value,
      startAt: Date.now(),
      endAt: null
    }

    storage.tasks.unshift(current);
    localStorage.setItem('storage', JSON.stringify(storage));
  }

  timer = setInterval(function() {
    document.getElementById('timer').innerText = getDuration(current);
  }, 1000);

  updateView();
}

function stop() {
  current.endAt = Date.now();
  clearInterval(timer);
  localStorage.setItem("storage", JSON.stringify(storage));

  current = null;
  updateView();

  document.querySelector('#timer').innerHTML = '00:00';
  document.querySelector('#input').value = '';
}

function deleteTask(id) {
  storage.tasks.splice(id, 1);
  localStorage.setItem("storage", JSON.stringify(storage));
  updateView();
}

function updateTitle() {
  if (current) {
    current.title = document.querySelector('#input').value;
    localStorage.setItem("storage", JSON.stringify(storage));
  }
}

function updateView() {
  if (current) {
    document.querySelector('#input').value = current.title;
  }
  drawActions();
  drawTable();
}

function buildRow(task, index) {
  let li = document.createElement('li');
  li.id = index;
  li.className = 'task';
  li.innerHTML = '<span class="title">' + task.title + '</span>' + 
                  '<span class="time">' + getDuration(task) + '</span>';

  let mc = new Hammer(li);
  mc.on('swipeleft', function(ev) {
    deleteTask(li.id);
  });

  return li;
}

function drawTable() {
  document.querySelector('#list').innerHTML = '';
  storage.tasks.forEach(function(task, index) {
    if (task.endAt === null) return;
    document.querySelector('#list').prepend(buildRow(task, index));
  });
}

function drawActions() {
  let startAction = document.createElement("i");
  startAction.className = 'f7-icons';
  startAction.innerText = 'play';
  startAction.onclick = function() {
    start(true);
  }

  let stopAction = document.createElement("i");
  stopAction.className = 'f7-icons';
  stopAction.innerText = 'pause';
  stopAction.onclick = function() {
    stop();
  }

  document.getElementById("actions").innerHTML = "";

  if (current) {
    document.getElementById("actions").appendChild(stopAction);
  } else {
    document.getElementById("actions").appendChild(startAction);
  }
}

function getDuration(task) {
  let end = task.endAt || Date.now();
  let date = new Date(end - task.startAt);

  return zeroPad(date.getMinutes(), 2) + ':' + zeroPad(date.getSeconds(), 2);
}

function zeroPad(number, width) {
  var string = String(number);
  while (string.length < width)
    string = '0' + string;
  return string;
}