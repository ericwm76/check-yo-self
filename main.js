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
titleInput.addEventListener('keyup', enableMakeListBtn);
mainSection.addEventListener('click', updateCardEvents);

// window.addEventListener('load', startOnLoad(e))
getFromStorage();
persistOnLoad();
enableMakeListBtn();
enableClearAllBtn();

function createTaskEvents(e) {
  e.preventDefault();
  if (e.target.id === 'make-list-btn') {
    createList();
    enableMakeListBtn();
    clearAllInputs();
  };
  
  if (e.target.id === 'add-task-btn') {
    createTasks();
    clearTaskInput();
    enableMakeListBtn();
  };


  if (e.target.id === 'clear-all-btn') {
    enableClearAllBtn();
    clearAllInputs();
  };

  // if (e.target.id === 'urgency-filter-btn') {

  // }; 
};

function updateCardEvents(e) {
  e.preventDefault();
  if (e.target.id === 'delete-btn') {
    removeList(e);
  };

  if (e.target.closest('#urgent-image')) {
    changeUrgency(e);
  };
};

function getFromStorage() {
  if (JSON.parse(localStorage.getItem('array')) === null) {
    toDoArray = [];
  } else {
    toDoArray = JSON.parse(localStorage.getItem('array')).map(element => new ToDoList(element));
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
    /*sortLists();
    removeIntro();*/
    displayList(newList);
};

function displayList(toDoObj) {
  var urgent = 'images/urgent.svg';

  if (toDoObj.urgent === true) {
    urgent = 'images/urgent-active.svg'
  } else {
    urgent = 'images/urgent.svg'
  };

  mainSection.insertAdjacentHTML('afterbegin', 
    `
    <article class="article" data-identifier="${toDoObj.id}">
      <h3 class="article__title" contenteditable="true">${toDoObj.title}</h3>
      <ul class="article__ul" id="card-task-list" contenteditable="true">${makeListItems(toDoObj.tasks)}</ul> 
      <footer class="article__footer">  
        <img src="${urgent}" id="urgent-image" alt="lightning bolt icon">
        <img src="images/delete.svg" id="delete-btn" alt="green x">
      </footer>  
    `);
};

function makeListItems(taskObj) {
  var checked;
  var fontStyle;
  var listItems = '';

  taskObj.forEach(function(li) {
    listItems += 
    `
    <li class="" data-identifier="${li.id}">
    <img src="images/delete.svg" id="task-delete-btn">
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
  enableMakeListBtn();
};

function clearTaskList() {
  tasksToCreate.innerHTML = '';
};

function enableMakeListBtn() {
  if (titleInput.value !== '' && tasksToCreate.innerHTML !== '') {
    makeListBtn.disabled = false;
  } else {
    makeListBtn.disabled = true;
  };
};

function enableClearAllBtn() {
  if(titleInput.value !== '' || tasksToCreate.innerHTML !== '') {
    clearAllBtn.disabled = false;
  } else {
    clearAllBtn.disabled = true;
  };
};

function getIdentifier(e) {
  return e.target.closest('article').dataset.identifier;
};

function getIndex(e) {
  return toDoArray.findIndex(function(id) {
    return parseInt(getIdentifier(e)) === id.id;
  });
};

function removeList(e) {
  e.target.closest('article').remove();
  toDoArray[getIndex(e)].deleteFromStorage(getIdentifier(e));
  // injectIntro();
};

function changeUrgencyImg(e) {
  var urgentActive = 'images/urgent-active.svg';
  var urgentNotActive = 'images/urgent.svg';

  if (toDoArray[getIndex(e)].urgent === true) {
    e.target.src = urgentActive;
  } else {
    e.target.src = urgentNotActive;
  };
};

function changeUrgency(e) {
  toDoArray[getIndex(e)].urgent = !toDoArray[getIndex(e)].urgent;
  toDoArray[getIndex(e)].saveToStorage(toDoArray);
  changeUrgencyImg(e);
};