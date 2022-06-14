const lists = []
const RENDER_EVENT = 'render-list'
const SAVED_EVENT = 'saved-list'
const STORAGE_KEY = 'BOOKSHELF_APPS'

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form')
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault()
        addList()
    })
    
    if(isStorageExist()) {
        localDataFromStorage()
    }
})

function generateId() {
    return +new Date()
}

function generateListObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addList() {
    const getTitle = document.getElementById('title').value
    const getAuthor = document.getElementById('author').value
    const getYear = document.getElementById('year').value

    const generateID = generateId()
    const listObject = generateListObject(generateID, getTitle, getAuthor, getYear, false)
    lists.push(listObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function makeList(listObject) {
    const listTitle = document.createElement('div')
    listTitle.classList.add('list-title')
    listTitle.innerText = listObject.title

    const listAuthor = document.createElement('div')
    listAuthor.classList.add('list-author')
    listAuthor.innerText = `Penulis : ${listObject.author}`

    const listYear = document.createElement('div')
    listYear.classList.add('list-year')
    listYear.innerText = `Tahun : ${listObject.year}`

    const childContainer = document.createElement('div')
    childContainer.classList.add('inner')
    childContainer.append(listTitle, listAuthor, listYear)

    const parrentContainer = document.createElement('div')
    parrentContainer.classList.add('item', 'shadow')
    parrentContainer.append(childContainer)
    parrentContainer.setAttribute('id', `list-${listObject.id}`)

    if(listObject.isComplete) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button')
        undoButton.innerText = 'Undo'

        undoButton.addEventListener('click', function() {
            undoListFromComplete(listObject.id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')
        trashButton.innerText = 'Hapus'

        trashButton.addEventListener('click', function() {
            removeListFromComplete(listObject.id)
        })

        childContainer.append(undoButton, trashButton)
    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')
        checkButton.innerText = 'Selesai dibaca'

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')
        trashButton.innerText = 'Hapus'

        checkButton.addEventListener('click', function() {
            addListToComplete(listObject.id)
        })

        trashButton.addEventListener('click', function() {
            removeListFromComplete(listObject.id)
        })

        childContainer.append(checkButton, trashButton)

        return childContainer
    }

    return parrentContainer
}

function addListToComplete(listId) {
    const listTarget = findList(listId)

    if(listTarget == null) return

    listTarget.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findList(listId) {
    for (const listItem of lists) {
        if(listItem.id === listId) {
            return listItem
        }
    }
    return null
}

function removeListFromComplete(listId) {
    const listTarget = findListIndex(listId)

    if(listTarget === -1) return

    lists.splice(listTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function undoListFromComplete(listId) {
    const listTarget = findList(listId)

    if(listTarget == null) return

    listTarget.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findListIndex(listId) {
    for(const index in lists) {
        if(lists[index].id === listId) {
            return index
        }
    }

    return -1
}

function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(lists)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function isStorageExist() {
    if(typeof (Storage) === undefined) {
        alert('Browser anda tidak mendukung local storage')
        return false
    }

    return true
}

function localDataFromStorage() {
    const getData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(getData)

    if(data !== null) {
        for(const list of data) {
            lists.push(list)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

document.addEventListener(RENDER_EVENT, function() {
    // console.log(lists)
    const uncompleteList = document.getElementById('list-item')
    uncompleteList.innerHTML = ''

    const completeList = document.getElementById('list-complete')
    completeList.innerHTML = ''

    for(const listItem of lists) {
        const listElement = makeList(listItem)
        if(!listItem.isComplete) {
            uncompleteList.append(listElement)
        } else {
            completeList.append(listElement)
        }
    }
})

document.addEventListener(SAVED_EVENT, function(listObject) {
    console.log(localStorage.getItem(STORAGE_KEY))
})