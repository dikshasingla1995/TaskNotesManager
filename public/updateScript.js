let titleUpdate = document.getElementById('titleUpdate')
let descriptionUpdate = document.getElementById('descriptionUpdate')
let dueUpdate = document.getElementById('dueUpdate')
let statusUpdate = document.getElementById('statusUpdate')
let priorityUpdate = document.getElementById('priorityUpdate')
let submitUpdate = document.getElementById('submitUpdate')
submitUpdate.addEventListener('click', updateTaskDetails)

let task = JSON.parse(sessionStorage.getItem("favoriteMovie"))

window.onload = function () {
    let taskStatus = 'incomplete'
    if (task.status === true) {
        taskStatus = 'complete'
    }
    titleUpdate.value = task.title
    descriptionUpdate.value = task.description
    dueUpdate.value = task.due
    statusUpdate.value = taskStatus
    priorityUpdate.value = task.priority
}

function updateTaskDetails() {
    let taskStatus = false
    if (statusUpdate.value === 'complete') {
        taskStatus = true
    }
    updateTaskDetailsDB(task.taskId,dueUpdate.value,taskStatus,priorityUpdate.value).then(()=>{
        location.replace("index.html")
    })
}

async function updateTaskDetailsDB(taskId, due, status, priority) {
    const resp = await fetch(`/tasknotes/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ due, status, priority })
    })
}