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
  fetchTasks()
}

function setTommorowDate() {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  due.value = today.toISOString().split('T')[0]
}

function fetchTasks() {
  taskList.innerHTML = ''
  getTask().then(res => {
    res.forEach(element => {
      let userData = document.createElement('li')
      userData.innerText = element.title
      taskList.appendChild(userData)
    })
  })
}

function addNewTask() {
  let taskStatus = false
  if (status.value === 'complete') {
    taskStatus = true
  }
  addNewTaskToDB(title.value, description.value, due.value, taskStatus, priority.value)
  fetchTasks()
  setTommorowDate()
  title.value = ''
  description.value = ''
  status.value = 'incomplete'
  priority.value = 'medium'
}

async function getTask() {
  const resp = await fetch('/tasknotes', { method: 'GET' })
  const tasks = await resp.json()
  console.log(tasks)
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