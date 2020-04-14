let title = document.getElementById('title')
let description = document.getElementById('description')
let due = document.getElementById('due')
let status = document.getElementById('status')
let priority = document.getElementById('priority')
let taskList = document.getElementById('task-list')
let submit = document.getElementById('submit')
submit.addEventListener('click', addNewTask)

window.onload = function () {
  setTommorowDate()
  GetTask()
}

function createTask(task) {
  let taskStatus = 'incomplete'
  if (task.status === true) {
    taskStatus = 'complete'
  }
  return $(`
  <div class="row" id = "${task.taskId}" onclick = "showTaskNotes(${task.taskId})">
    <div class="col-sm" id="title">${task.title}</div>
    <div class="col-sm" id="description">${task.description}</div>
    <div class="col-sm" id="due">${task.due}</div>
    <div class="col-sm" id="status">${taskStatus}</div>
    <div class="col-sm" id="priority">${task.priority}</div>
    <button id="update" onclick = "UpdateTask(${task.taskId})">Update</button>
  </div>
  <div id= "${task.taskId}notesList"></div>
  <br>`)
}

function showTaskNotes(taskId) {
  let userList = document.getElementById(`${taskId}notesList`)
  userList.innerHTML = ''
  getTaskNotesWithId(taskId).then(task => {
    task.All_Notes.forEach(note =>{
      let userData = document.createElement('li')
      userData.innerText = note.text
      userList.appendChild(userData)
    })
    
  })
  /*let notesList = $(`#${taskId}notesList`)
  notesList.empty()
  getTaskNotesWithId(taskId).then(task => {
    task.All_Notes.forEach(note =>{
      notesList.append(createNote(note))
    })
  })*/
}

function UpdateTask(taskId) {
  getTaskWithId(taskId).then(task => {
    console.log(task)
  })
}

function GetTask() {
  let taskList = $('#taskList')
  taskList.empty()
  getTask().then(tasks => {
    tasks.forEach(task => {
      taskList.append(createTask(task))
    })
  })
}

function addNewTask() {
  let taskStatus = false
  if (status.value === 'complete') {
    taskStatus = true
  }
  addNewTaskToDB(title.value, description.value, due.value, taskStatus, priority.value)
  GetTask()
  setTommorowDate()
  title.value = ''
  description.value = ''
  status.value = 'incomplete'
  priority.value = 'medium'
}

async function getTask() {
  const resp = await fetch('/tasknotes', { method: 'GET' })
  const tasks = await resp.json()
  return tasks
}

async function addNewTaskToDB(title, description, due, status, priority) {
  const resp = await fetch('/tasknotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, due, status, priority })
  })
}

async function getTaskWithId(taskId) {
  const resp = await fetch(`/tasknotes/${taskId}`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

async function getTaskNotesWithId(taskId) {
  const resp = await fetch(`/tasknotes/${taskId}/notes`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

function setTommorowDate() {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  due.value = today.toISOString().split('T')[0]
}