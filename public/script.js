let submit = document.getElementById('submit')

submit.onclick = function() {
  getTodos()
}

async function getTodos() {
  const resp = await fetch('/todos', { method: 'GET' })
  const todos = await resp.json()
  console.log(todos)
  return todos
}

async function addNewTodoJson(task, done) {
  const resp = await fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task, done, due: '2020-04-05' })
  })
}
