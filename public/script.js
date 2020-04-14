let title = document.getElementById('title')
let description = document.getElementById('description')
let due = document.getElementById('due')
let status = document.getElementById('status')
let priority = document.getElementById('priority')
let submit = document.getElementById('submit')
if(submit != null){
  submit.addEventListener('click', addNewTask)
}
window.onload = function () {
  setTommorowDate()
  GetTask()
}

// creating task on window(completed)
function createTask(task) {
  let taskStatus = 'incomplete'
  if (task.status === true) {
    taskStatus = 'complete'
  }
  return $(`
  <div id = "${task.taskId}" >
    <div class="row" onclick = "showTaskNotes(${task.taskId})">
      <div class="col-sm" id="title">${task.title}</div>
      <div class="col-sm" id="description">${task.description}</div>
      <div class="col-sm" id="due">${task.due}</div>
      <div class="col-sm" id="status">${taskStatus}</div>
      <div class="col-sm" id="priority">${task.priority}</div>
    </div>
    <button id="update" onclick = "UpdateTask(${task.taskId})">Update</button>
  </div>
  <div id= "${task.taskId}notesList"></div>
  <br>`)
}

//updating task details
function UpdateTask(taskId) {
  getTaskWithId(taskId).then((task)=>{
    sessionStorage.setItem("favoriteMovie", JSON.stringify(task))
    location.replace("updateTask.html")
  })
}

// to show notes of each task(completed)
function showTaskNotes(taskId) {
  let userList = document.getElementById(`${taskId}notesList`)
  userList.innerHTML = ''
  getTaskNotesWithId(taskId).then(task => {
    task.All_Notes.forEach(note => {
      let userData = document.createElement('li')
      userData.innerText = note.text
      userList.appendChild(userData)
    })
    let divElement = document.createElement('div')
    divElement.setAttribute('id', `${taskId}div`)
    let noteInput = document.createElement('input')
    noteInput.setAttribute('type', 'text')
    noteInput.setAttribute('id', `${taskId}noteText`)
    let addButton = document.createElement('input')
    addButton.setAttribute('type', 'button')
    addButton.setAttribute('value', 'Add New Note')
    addButton.setAttribute('onclick', `AddNewNoteToTask(${taskId})`)
    divElement.appendChild(noteInput)
    divElement.appendChild(addButton)
    userList.appendChild(divElement)
  })
  /*let notesList = $(`#${taskId}notesList`)
  notesList.empty()
  getTaskNotesWithId(taskId).then(task => {
    task.All_Notes.forEach(note =>{
      notesList.append(createNote(note))
    })
  })*/
}

// to add new note to task(completed)
function AddNewNoteToTask(taskId) {
  let noteText = document.getElementById(`${taskId}noteText`)
  addNewNoteWithTask(taskId, noteText.value).then(() => {
    showTaskNotes(taskId)
  })
}

//to get all task from db(completed)
function GetTask() {
  let taskList = $('#taskList')
  taskList.empty()
  getTask().then(tasks => {
    //sort list by due date descending tasks.sort((a, b) => (a.due < b.due) ? 1 : -1)
    //sort list by due date ascending tasks.sort((a, b) => (a.due > b.due) ? 1 : -1)
    //sort by status tasks.sort((x, y) => Number(x.status) - Number(y.status))
    //sort by priority
    tasks.forEach(task => {
      taskList.append(createTask(task))
    })
  })
}

// adding task to db(completed)
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

//(completed)
async function getTask() {
  const resp = await fetch('/tasknotes', { method: 'GET' })
  const tasks = await resp.json()
  return tasks
}

//(completed)
async function addNewTaskToDB(title, description, due, status, priority) {
  const resp = await fetch('/tasknotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, due, status, priority })
  })
}

//(completed)
async function getTaskWithId(taskId) {
  const resp = await fetch(`/tasknotes/${taskId}`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

//(completed)
async function getTaskNotesWithId(taskId) {
  const resp = await fetch(`/tasknotes/${taskId}/notes`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

//(completed)
async function addNewNoteWithTask(taskId, noteText) {
  const resp = await fetch(`/tasknotes/${taskId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: noteText })
  })
}

//(completed)
function setTommorowDate() {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  due.value = today.toISOString().split('T')[0]
}