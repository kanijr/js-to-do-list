export class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }

  static #list = []
  static #count = 0

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  static #block = null
  static #template = null
  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.task-list')

    this.#input = document.querySelector(
      '.task-form__input',
    )

    this.#button = document.querySelector(
      '.task-form__button',
    )

    this.#button.onclick = this.#handleAdd

    this.#loadData()

    this.#render()
  }

  static #handleAdd = () => {
    const value = this.#input.value

    if (value.length > 1) {
      this.#createTaskData(value)
      this.#input.value = ''
      this.#saveData()
      this.#render()
    }
  }

  static #render = () => {
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerText = 'Список задач пустий'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)

        this.#block.append(el)
      })
    }
  }

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)

    const [id, text, btnDo, btnCancel] = el.children

    id.innerText = data.id + '.'

    text.innerText = data.text

    btnCancel.onclick = this.#handleCancel(data)

    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      el.classList.toggle('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const res = this.#toggleDone(data.id)

    if (res === false || res === true) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      this.#saveData()
    }
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((data) => data.id === id)
    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }

  static #handleCancel = (data) => () => {
    if (confirm('Видалити задачу?')) {
      const res = this.#deleteById(data.id)

      if (res) {
        this.#render()
        this.#saveData()
      }
    }
  }

  static #deleteById = (id) => {
    this.#list = this.#list.filter((data) => data.id !== id)
    return true
  }
}

Todo.init()

window.todo = Todo
