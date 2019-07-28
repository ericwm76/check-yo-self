var toDoArray = [];

var leftSection = document.querySelector('section');
var mainSection = document.querySelector('main');
var searchBar = document.querySelector('.nav__search')

leftSection.addEventListener('click', createTaskEvents)

window.addEventListener('load', startOnLoad)

function startOnLoad(e) {

};

function createTaskEvents(e) {
  e.preventDefault();
  if (e.target.id === 'task-item-input') {

  };

  if (e.target.id === 'make-list-btn') {

  };

  if (e.target.id === 'clear-all-btn') {

  };

  if (e.target.id === 'urgency-filter-btn') {

  }; 
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

  function sortLists() {

  };

  function createList() {
    var newList = new ToDoList({})
  }
};