var toDoArray = [];

var leftSection = document.querySelector('section');
var mainSection = document.querySelector('main');
var searchBar = document.querySelector('.nav__search');
var titleInput = document.querySelector('#task-title-input');
var taskInput = document.querySelector('#task-item-input');

leftSection.addEventListener('click', createTaskEvents)

// window.addEventListener('load', startOnLoad(e))

function startOnLoad(e) {

};

function createTaskEvents(e) {
  e.preventDefault();
  console.log('createTaskEvents ran');
  if (e.target.id === 'make-list-btn') {
    createList();
  };
  // if (e.target.id === 'task-item-input') {

  // };


  // if (e.target.id === 'clear-all-btn') {

  // };

  // if (e.target.id === 'urgency-filter-btn') {

  // }; 
};

function updateCardEvents(e) {

};

function getFromStorage() {
  if (JSON.parse(localStorage.getItem('array')) === null) {
    toDoArray = [];
  } else {
    toDoArray = JSON.parse(localStorage.getItem('array')).map(element => new ToDoList(element));
    sortLists();
  };
};

function sortLists() {

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
      <p class="article__title" contenteditable="true">${toDoObj.title}</p>
        <ul class="article__ul" id="task-list" contenteditable="true">${toDoObj.tasks}</ul> 
      <footer class="article__footer">  
        <img src="${urgent}" id="urgent-image" alt="lightning bolt icon">
        <img src="images/delete.svg" id="delete-btn" alt="green x">
      </footer>  
    `);
};


