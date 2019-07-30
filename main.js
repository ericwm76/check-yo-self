var toDoArray = [];
var currentTasks = [];

var leftSection = document.querySelector('section');
var mainSection = document.querySelector('main');
var searchBar = document.querySelector('.nav__search');
var titleInput = document.querySelector('#task-title-input');
var taskInput = document.querySelector('#task-item-input');
var makeListBtn = document.querySelector('#make-list-btn');
var clearAllBtn = document.querySelector('#clear-all-btn');
var filterUrgencyBtn = document.querySelector('#urgency-filter-btn');
var tasksToCreate = document.querySelector('#tasks-to-create');

leftSection.addEventListener('click', createTaskEvents);
titleInput.addEventListener('keyup', enableBtns);
mainSection.addEventListener('click', updateCardEvents);

// window.addEventListener('load', startOnLoad(e))
getFromStorage();
persistOnLoad();
enableBtns();
injectAddListMsg();

function createTaskEvents(e) {
  e.preventDefault();
  if (e.target.id === 'make-list-btn') {
    removeAddListMsg();
    createList();
    clearAllInputs();
    enableBtns();
  };
  
  if (e.target.id === 'add-task-btn') {
    createTasks();
    clearTaskInput();
    enableBtns();
  };

  if (e.target.id === 'clear-all-btn') {
    enableBtns();
    clearAllInputs();
    enableBtns();
  };

  if (e.target.id === 'section-delete-btn') {
    removeTask(e);
  };

  // if (e.target.id === 'urgency-filter-btn') {

  // }; 
};

function updateCardEvents(e) {
  e.preventDefault();
  if (e.target.id === `delete-btn${getIdentifier(e)}`) {
    removeList(e);
    injectAddListMsg();
  };

  if (e.target.closest('#urgent-image')) {
    changeUrgency(e);
  };

  if (e.target.closest('#task-complete-btn')) {
    completeTask(e);
    enableDeleteBtn(e);
  };
};

function getFromStorage() {
  if (JSON.parse(localStorage.getItem('array')) === null) {
    toDoArray = [];
  } else {
    toDoArray = JSON.parse(localStorage.getItem('array')).map(element => new ToDoList(element));
  };
};

function injectAddListMsg() {
  if (mainSection.innerHTML === '' || mainSection.innerHTML === ' ') {
    mainSection.insertAdjacentHTML("afterbegin", 
      `
      <article id="add-list-msg">
        <p>Add a to-do list and get checkin' those boxes!</p>
      </article>
      `
    );
  }; 
};

function persistOnLoad() {
  if (toDoArray !== []) {
    toDoArray.forEach(function(toDoObj) {
      displayList(toDoObj);
    });
  };
};

function createTasks(e) {
  if (taskInput.value !== '') {
    var newTask = new Task({task: taskInput.value, id: Date.now(), complete: false});
    currentTasks.push(newTask);
    displayTasks(newTask);
  };
};  

function displayTasks(taskObj) {
  tasksToCreate.insertAdjacentHTML('beforeend', 
    `
    <li class="" data-identifier="${taskObj.id}">
    <img src="images/delete.svg" id="section-delete-btn">
    ${taskObj.task}
    </li>
    `
  );
};

function createList(e) {
  var newList = new ToDoList({title: titleInput.value, tasks: currentTasks, id: Date.now(), urgent: false});

  toDoArray.push(newList);
  newList.saveToStorage(toDoArray);
  displayList(newList);
};

function displayList(toDoObj) {
  var urgent;
  var urgentClass;
  var urgentIcon;

  if (toDoObj.urgent === true) {
    urgent = 'images/urgent-active.svg'
    urgentClass = 'urgent'
    urgentIcon = 'urgent-icon'
  } else {
    urgent = 'images/urgent.svg'
    urgentClass = ''
    urgentIcon = ''
  };

  mainSection.insertAdjacentHTML('afterbegin', 
    `
    <article class="article ${urgentClass}" id="card${toDoObj.id}" data-identifier="${toDoObj.id}">
      <h3 class="article__title ${urgentClass}" contenteditable="true" id="card-title${toDoObj.id}">${toDoObj.title}</h3>
      <ul class="article__ul ${urgentClass}" id="card-list${toDoObj.id}" contenteditable="true">${makeListItems(toDoObj.tasks)}</ul> 
      <footer class="article__footer ${urgentClass}" id="card-footer${toDoObj.id}">  
        <div>
          <img src="${urgent}" id="urgent-image" alt="lightning bolt icon">
          <p class="${urgentIcon}" id="urgent-label${toDoObj.id}">URGENT</p>
        </div>
        <div>
          <img src="images/delete.svg" id="delete-btn${toDoObj.id}" alt="green x">
          <p id="delete-label${toDoObj.id}">DELETE</p>
        </div>
      </footer>  
    `
  );
};

function makeListItems(taskObj) {
  var listItems = '';

  taskObj.forEach(function(li) {
    var imgSource;
    var taskComplete;

    if (li.complete) {
      imgSource = 'images/checkbox-active.svg';
      taskComplete = 'complete'
    } else {
      imgSource = 'images/checkbox.svg';
      taskComplete = ''
    };

    listItems += 
    `
    <li class="${taskComplete}" data-identifier="${li.id}" data-complete="${li.complete}">
      <img src="${imgSource}" id="task-complete-btn">
      ${li.task}
    </li>
    `
  });
    return listItems;
};

function clearTaskInput() {
  taskInput.value = '';
};

function clearAllInputs() {
  titleInput.value = '';
  taskInput.value = '';
  currentTasks = [];
  clearTaskList();
};

function clearTaskList() {
  tasksToCreate.innerHTML = '';
};

function enableBtns() {
  enableMakeListBtn();
  enableClearAllBtn();
};

function enableMakeListBtn() {
  if (titleInput.value !== '' && tasksToCreate.innerHTML !== '') {
    makeListBtn.disabled = false;
  } else {
    makeListBtn.disabled = true;
  };
};

function enableClearAllBtn() {
  if (titleInput.value !== '' || tasksToCreate.innerHTML !== '') {
    clearAllBtn.disabled = false;
  } else {
    clearAllBtn.disabled = true;
  };
};

function getIdentifier(e) {
  // console.log(e.target.closest('article').dataset.identifier);
  return e.target.closest('article').dataset.identifier;
};

function getIndex(e) {
  return toDoArray.findIndex(function(id) {
    return parseInt(getIdentifier(e)) === id.id;
  });
};

function removeList(e) {
  if (e.target.src.includes('delete-active.svg')) {
  e.target.closest('article').remove();
  toDoArray[getIndex(e)].deleteFromStorage(getIdentifier(e));
  injectAddListMsg();
  };
};

function getTaskIdentifier(e) {
  return e.target.closest('li').dataset.identifier;
};

function getTaskIndex(e) {
  return currentTasks.findIndex(function(id) {
    return parseInt(getTaskIdentifier(e)) === id.id;
  });
};

function removeTask(e) {
  currentTasks.splice(getTaskIndex(e), 1);
  e.target.closest('li').remove();
};

function completeTask(e) {
  var listID = parseInt(getIdentifier(e));
  var taskID = parseInt(e.target.closest('li').dataset.identifier);
  var toDoIndex = toDoArray.findIndex(todo => todo.id === listID);
  var taskIndex = toDoArray[toDoIndex].tasks.findIndex(task => task.id === taskID);   

  toDoArray[toDoIndex].updateTask(toDoArray, taskIndex) 
  changeTaskStyle(e);  
};

function changeTaskStyle(e) {
  if (e.target.src.includes('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    e.target.closest('li').dataset.complete = 'true';
    e.target.closest('li').classList.add('complete');
  } else {
    e.target.src = 'images/checkbox.svg';
    e.target.closest('li').dataset.complete = 'false';
    e.target.closest('li').classList.remove('complete');
  };
};

function changeUrgency(e) {
  changeUrgencyImg(e);
  toDoArray[getIndex(e)].updateToDo(toDoArray);

  if (e.target.src.includes('images/urgent.svg')) {
    e.target.src = 'images/urgent-active.svg'
  } else {
    e.target.src = 'images/urgent.svg'
  };
};

function changeUrgencyImg(e) {
    document.querySelector(`#card${getIdentifier(e)}`).classList.toggle('urgent');
    document.querySelector(`#card-title${getIdentifier(e)}`).classList.toggle('urgent');
    document.querySelector(`#card-list${getIdentifier(e)}`).classList.toggle('urgent');
    document.querySelector(`#card-footer${getIdentifier(e)}`).classList.toggle('urgent');
    document.querySelector(`#urgent-label${getIdentifier(e)}`).classList.toggle('urgent-icon');
};

function enableDeleteBtn(e) {
  var listItems = e.target.parentNode.parentNode.children;
  var listItemsArray = Array.from(listItems);
  var completeCount = 0;

  listItemsArray.forEach(function(listItem) {
    if (JSON.parse(listItem.dataset.complete) === true) {
      completeCount++;
    };
  });

  if (completeCount === listItemsArray.length) {
    document.querySelector(`#delete-btn${getIdentifier(e)}`).src = 'images/delete-active.svg';
    document.querySelector(`#delete-label${getIdentifier(e)}`).classList.add('urgent-icon');
  } else {
    document.querySelector(`#delete-btn${getIdentifier(e)}`).src = 'images/delete.svg';
    document.querySelector(`#delete-label${getIdentifier(e)}`).classList.remove('urgent-icon');   
  };
};

function removeAddListMsg() {
  var element = document.getElementById('add-list-msg');

  if (element) {
    element.parentNode.removeChild(element);
  };  
};