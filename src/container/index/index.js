export class Todo {
  //ключ для локального сховища local.Storage
  static #NAME = 'todo'

  // для зберігання данних в локальному сховиші
  //записуємо по this.#NAME певне значення
  //через JSON.stringify перетворюємо в JSON
  // і туди передаємо об'єкт, в якому є список та count
  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }
  // через localStorage отримуємо данні
  //якщо вони є, то данні з формату JSON повуртаємо в формат JS
  //витягуємо властивості list і count і в потрібні місця записуємо
  // додаємо в init()
  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }
  //для збереження об'єктів задач
  static #list = []

  //для збереження індивідуальності в номерах
  static #count = 0

  // всередину #list буде додавати новий об'єкт задачі
  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  // посилання на main
  static #block = null
  // посилання на  template
  static #template = null
  // input
  static #input = null
  static #button = null

  //ініціалізує клас Todo

  static init = () => {
    //підключаємо template
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild
    // .content - щоб звернутися до коду в середині template -
    // document.fragment
    //.firstElementChild - до  <div class="task">

    //підключаємо #block
    this.#block = document.querySelector('.task__list')
    //підключаємо #input
    this.#input = document.querySelector('.form__input')
    //підключаємо #button
    this.#button = document.querySelector('.form__button')

    //прив'язуємо до нього  #handleAdd
    this.#button.onclick = this.#handleAdd

    this.#loadData()

    this.#render()
  }

  //контроль(handle) нової сутності Task(#createTaskData())
  //звертаємось до input, витягуєм його значення та передаєм до #createTaskData()

  static #handleAdd = () => {
    const value = this.#input.value
    if (value.length > 1) {
      this.#createTaskData(value)
      this.#input.value = ''
      //щоб оновити список задач
      this.#render()
      // зберегти в локальному сховищі
      this.#saveData()
    }
  }

  // відображення задач на сторінці
  //якщо список пустий - виводимо "список пустий"
  //якщо ні, то продимо по кожному елементу всередині #list та
  //для нього створювати копію #template та вставляти всередину #block

  static #render = () => {
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerText = `Список задач пустий`
    } else {
      this.#list.forEach((taskData) => {
        //const el = this.#template.cloneNode(true)
        const el = this.#createTaskElem(taskData)
        this.#block.append(el)
      })
    }
  }

  //cтворення el  - елементу задачі, враховуючі taskData(наші данні,
  //що приходять нам по ітерації)
  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)

    // звернутися до тегів всередині el - тобто всередині #template
    // el.children через деструктурізацію
    const [id, text, btnDo, btnCancel] = el.children

    //додаємо данні з data до id, text

    id.innerText = `${data.id}.`

    text.innerText = data.text

    btnCancel.onclick = this.#handleCancel(data)

    btnDo.onclick = this.#handleDo(data, btnDo, el)

    //якщо data приходить з done, то додаються потрібні класи,
    //а непотрібні видаляються

    if (data.done) {
      el.classList.add('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  //повертає іншу функцію
  // по данним data буде визиватись #toggleDone, щоб done: false
  //  з #createTaskData змінилося на true
  // btn - змінюєм класи з do на done
  //в div class="task" додати модифікатор

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    // якщо не true i не false, то не буде працювати
    if (result === true || result === false) {
      //переключаємо - якщо було do, то стане done і тд або прибереться
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      // зберегти в локальному сховищі
      this.#saveData()
    }
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id)

    if (task) {
      // якщо є task, то робимо зворотнє значення(змінюємо true
      //на false і навпаки)
      task.done = !task.done
      return task.done
    } else {
      // якщо не true i не false
      return null
    }
  }

  //функція що контролює видалення задачі(кнопка cancel)
  //ця функція повертає іншу функцію(робимо замикання), яка попадає
  // в onclick
  static #handleCancel = (data) => () => {
    //запитання в модальному вікні(перепитуємо користувача)
    if (confirm('Видалити задачу?')) {
      const result = this.#deleteById(data.id)
      //якщо видалення відбувається, то оновлюємо
      if (result) {
        this.#render()
        // зберегти в локальному сховищі
        this.#saveData()
      }
    }
  }

  static #deleteById = (id) => {
    //вадаляємо фільтрацією
    this.#list = this.#list.filter((item) => item.id !== id)
    return true
  }
}

Todo.init()

window.todo = Todo
