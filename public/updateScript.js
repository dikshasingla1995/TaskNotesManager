let titleUpdate = document.getElementById('titleUpdate')
let descriptionUpdate = document.getElementById('descriptionUpdate')
let dueUpdate = document.getElementById('dueUpdate')
let statusUpdate = document.getElementById('statusUpdate')
let priorityUpdate = document.getElementById('priorityUpdate')
let submitUpdate = document.getElementById('submitUpdate')
submitUpdate.addEventListener('click', updateTaskDetails)

let task = JSON.parse(sessionStorage.getItem("taskData"))

window.onload = function () {
    if (task.status === true) {
        statusUpdate.checked = true
    }
    let priorityTask = 'medium'
    if (task.priority === 3) {
        priorityTask = 'high'
    } else if (task.priority === 1) {
        priorityTask = 'low'
    }
    titleUpdate.value = task.title
    descriptionUpdate.value = task.description
    dueUpdate.value = task.due
    priorityUpdate.value = priorityTask
}

function updateTaskDetails() {
    let taskStatus = false
    if (statusUpdate.checked) {
        taskStatus = true
    }
    let priorityTask = 2
    if (priorityUpdate.value === 'high') {
        priorityTask = 3
    } else if (priorityUpdate.value === 'low') {
        priorityTask = 1
    }
    updateTaskDetailsDB(task.taskId, dueUpdate.value, taskStatus, priorityTask).then(() => {
        location.href = "index.html"
    })
}

async function updateTaskDetailsDB(taskId, due, status, priority) {
    const resp = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ due, status, priority })
    })
}