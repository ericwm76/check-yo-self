var toDoArray = [];

var leftSection = document.querySelector('section');
var mainSection = document.querySelector('main');
var searchBar = document.querySelector('.nav__search');
var titleInput = document.querySelector('#task-title-input');
var taskInput = document.querySelector('#task-item-input');
var makeListBtn = document.querySelector('#make-list-btn');
var clearAllBtn = document.querySelector('clear-all-btn');
var filterUrgencyBtn = document.querySelector('urgency-filter-btn');
var tasksToCreate = document.querySelector('#tasks-to-create');

leftSection.addEventListener('click', createTaskEvents);
titleInput.addEventListener('keyup', disableSave);
mainSection.addEventListener('click', updateCardEvents);

// window.addEventListener('load', startOnLoad(e))
getFromStorage();
persistOnLoad();

function createTaskEvents(e) {
  e.preventDefault();
  console.log('createTaskEvents ran');
  if (e.target.id === 'make-list-btn') {
    createList();
    clearInputs();
    disableSave();
  };
  
  if (e.target.id === 'add-task-btn') {
    createTasks();
  };


  // if (e.target.id === 'clear-all-btn') {

  // };

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
    // sortLists();
  };
};

function persistOnLoad() {
  toDoArray.forEach(function(toDoObj) {
    displayList(toDoObj);
  });
};

function sortLists() {

};

function createTasks() {
  console.log('createTasks ran');
  tasksToCreate.insertAdjacentHTML('afterbegin', 
    `<div>
      <img src="images/delete.svg" id="section-delete-btn">
      <li>${taskInput.value}<li>
    </div>
    `);
};

function createList(e) {
  console.log('createList ran');
    var newList = new ToDoList({title: titleInput.value, /*tasks: ,*/ id: Date.now(), urgent: false});

    toDoArray.push(newList);
    newList.saveToStorage(toDoArray);
    /*sortLists();
    removeIntro();*/
    displayList(newList);
};

function displayList(toDoObj) {
  console.log('displayList ran');
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
        <ul class="article__ul" id="card-task-list" contenteditable="true">${toDoObj.tasks}</ul> 
      <footer class="article__footer">  
        <img src="${urgent}" id="urgent-image" alt="lightning bolt icon">
        <img src="images/delete.svg" id="delete-btn" alt="green x">
      </footer>  
    `);
};

function clearInputs() {
  titleInput.value = '';
  taskInput.value = '';
};

function disableSave() {
  if (titleInput.value === '' 
    || taskInput.value === ''
    ) {
    makeListBtn.disabled = true;
  } else {
    makeListBtn.disabled = false;
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
  console.log('removeList ran');
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