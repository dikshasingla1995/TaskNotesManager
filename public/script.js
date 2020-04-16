let title = document.getElementById('title')
let description = document.getElementById('description')
let due = document.getElementById('due')
let status = document.getElementById('status')
let priority = document.getElementById('priority')
let filterValue = document.getElementById('filterValue')
let filter = document.getElementById('filter')
let submit = document.getElementById('submit')

submit.addEventListener('click', addNewTask)
filter.addEventListener('click', GetTask)

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
  let priorityTask = 'medium'
  if (task.priority === 3) {
    priorityTask = 'high'
  } else if (task.priority === 1) {
    priorityTask = 'low'
  }
  return $(`
  <div class="card border-success">
    <div class="card-body">
      <div id = "${task.taskId}" class="row" onclick = "showTaskNotes(${task.taskId})">
        <div class="col-sm" id="title">${task.title}</div>
        <div class="col-sm" id="description">${task.description}</div>
        <div class="col-sm" id="due">${task.due}</div>
        <div class="col-sm" id="status">${taskStatus}</div>
        <div class="col-sm" id="priority">${priorityTask}</div>
        <div class="col-sm">
          <button id="update" class="btn btn-primary" onclick = "UpdateTask(${task.taskId})">Update</button>
        </div> 
      </div>
      <ul class="list-group list-group-flush" id= "${task.taskId}notesList">
      </ul>
    </div>
  </div>
  <br>`)
}

//updating task details(completed)
function UpdateTask(taskId) {
  getTaskWithId(taskId).then((task) => {
    sessionStorage.setItem("taskData", JSON.stringify(task))
    location.href = "updateTask.html"
  })
}

// to show notes of each task(completed)
function showTaskNotes(taskId) {
  let userList = document.getElementById(`${taskId}notesList`)
  userList.innerHTML = ''
  getTaskNotesWithId(taskId).then(task => {
    task.All_Notes.forEach(note => {
      let userData = document.createElement('li')
      userData.setAttribute('class','list-group-item')
      userData.innerText = note.text
      userList.appendChild(userData)
    })
    let divElement = document.createElement('div')
    divElement.setAttribute('id', `${taskId}div`)
    divElement.setAttribute('class', 'form-row align-items-center')
    let divElement1 = document.createElement('div')
    divElement1.setAttribute('class', 'col-sm-8 my-1')
    let divElement2 = document.createElement('div')
    divElement2.setAttribute('class', 'col-auto my-1')
    let noteInput = document.createElement('input')
    noteInput.setAttribute('type', 'text')
    noteInput.setAttribute('id', `${taskId}noteText`)
    noteInput.setAttribute('class', 'form-control')
    let addButton = document.createElement('input')
    addButton.setAttribute('type', 'button')
    addButton.setAttribute('value', 'Add New Note')
    addButton.setAttribute('class', 'btn btn-primary')
    addButton.setAttribute('onclick', `AddNewNoteToTask(${taskId})`)
    divElement1.appendChild(noteInput)
    divElement2.appendChild(addButton)
    divElement.appendChild(divElement1)
    divElement.appendChild(divElement2)
    userList.appendChild(divElement)
  })
}

// to add new note to task(completed)
function AddNewNoteToTask(taskId) {
  let noteText = document.getElementById(`${taskId}noteText`)
  if(noteText.value === ''){
    return false
  }
  addNewNoteWithTask(taskId, noteText.value).then(() => {
    showTaskNotes(taskId)
  })
}

//to get all task from db(completed)
function GetTask() {
  let taskList = $('#taskList')
  taskList.empty()
  getTask().then(tasks => {
    switch (filterValue.value) {
      case 'ascending':
        tasks.sort((a, b) => (a.due > b.due) ? 1 : -1)
        break
      case 'descending':
        tasks.sort((a, b) => (a.due < b.due) ? 1 : -1)
        break
      case 'priority':
        tasks.sort((x, y) => Number(y.priority) - Number(x.priority))
        break
      case 'status':
        tasks.sort((x, y) => Number(x.status) - Number(y.status))
        break
      default:
    }
    tasks.forEach(task => {
      taskList.append(createTask(task))
    })
  })
}

// adding task to db(completed)
function addNewTask() {
  if (title.value === '') {
    return false
  }
  let taskStatus = false
  if (status.value === 'complete') {
    taskStatus = true
  }
  let priorityTask = 2
  if (priority.value === 'high') {
    priorityTask = 3
  } else if (priority.value === 'low') {
    priorityTask = 1
  }
  addNewTaskToDB(title.value, description.value, due.value, taskStatus, priorityTask)
  GetTask()
  setTommorowDate()
  title.value = ''
  description.value = ''
  status.value = 'incomplete'
  priority.value = 'medium'
}

//(completed)
async function getTask() {
  const resp = await fetch('/api/tasks', { method: 'GET' })
  const tasks = await resp.json()
  return tasks
}

//(completed)
async function addNewTaskToDB(title, description, due, status, priority) {
  const resp = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, due, status, priority })
  })
}

//(completed)
async function getTaskWithId(taskId) {
  const resp = await fetch(`/api/tasks/${taskId}`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

//(completed)
async function getTaskNotesWithId(taskId) {
  const resp = await fetch(`/api/tasks/${taskId}/notes`, {
    method: 'GET',
  })
  const task = await resp.json()
  return task
}

//(completed)
async function addNewNoteWithTask(taskId, noteText) {
  const resp = await fetch(`/api/tasks/${taskId}/notes`, {
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