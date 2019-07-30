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
  if (e.target.id === 'delete-btn') {
    removeList(e);
  };

  if (e.target.closest('#urgent-image')) {
    changeUrgency(e);
  };

  if (e.target.closest('#task-complete-btn')) {
    completeTask(e);
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
  console.log('injectAddListMsg ran');
  if (mainSection.innerHTML === '' || mainSection.innerHTML === ' ') {
   mainSection.insertAdjacentHTML("afterbegin", 
    `<article id="add-list-msg">
      <p>Add a to-do list and get checkin' those boxes!</p>
    </article>`)
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
  var urgent;
  var urgentClass;

  if (toDoObj.urgent === true) {
    urgent = 'images/urgent-active.svg'
    urgentClass = 'urgent-article'
  } else {
    urgent = 'images/urgent.svg'
    urgentClass = ''

  };

  mainSection.insertAdjacentHTML('afterbegin', 
    `
    <article class="article ${urgentClass}" data-identifier="${toDoObj.id}">
      <h3 class="article__title" contenteditable="true">${toDoObj.title}</h3>
      <ul class="article__ul" id="card-task-list" contenteditable="true">${makeListItems(toDoObj.tasks)}</ul> 
      <footer class="article__footer">  
        <div>
          <img src="${urgent}" id="urgent-image" alt="lightning bolt icon">
          <p>URGENT</p>
        </div>
        <div>
          <img src="images/delete.svg" id="delete-btn" alt="green x">
          <p>DELETE</p>
        </div>
      </footer>  
    `);
};

function makeListItems(taskObj) {
  var listItems = '';
  console.log(taskObj);
  taskObj.forEach(function(li) {
    var imgSource;
    if (li.complete) {
      imgSource ='images/checkbox-active.svg';
    } else {
      imgSource ='images/checkbox.svg'
    }
    listItems += 
    `
    <li class="" data-identifier="${li.id}" data-complete="${li.complete}">
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
  console.log('ran clearAllInputs')
  titleInput.value = '';
  taskInput.value = '';
  currentTasks = [];
  clearTaskList();
};

function clearTaskList() {
  tasksToCreate.innerHTML = '';
};

function enableBtns() {
  console.log('enableBtns ran');
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
  var completedStatus = JSON.parse(e.target.closest('li').dataset.complete);
     
  completedStatus = !completedStatus;

  if (completedStatus === true) {
    e.target.src = 'images/checkbox-active.svg';
    e.target.closest('li').dataset.complete = 'true';
    e.target.closest('li').classList.add('complete');
  } else {
    e.target.src = 'images/checkbox.svg';
    e.target.closest('li').dataset.complete = 'false';
    e.target.closest('li').classList.remove('complete');
  };
  var listID = parseInt(e.target.closest('article').dataset.identifier);
  var taskID = parseInt(e.target.closest('li').dataset.identifier);
  console.log(listID, taskID);
  var targetObj = toDoArray.find(function(todo) {
    return todo.id === listID
  });
  targetObj.tasks.forEach(function(task) {
    if (task.id === taskID) {
      task.complete = !task.complete
    }
    console.log(task)
  })
  var newToDoArray = toDoArray.filter(function(todo) {
    return todo.id !== listID
  })
  newToDoArray.push(targetObj);
  targetObj.saveToStorage(newToDoArray);
  
  // toDoArray.forEach(function(todo) {
  //   todo.tasks.forEach(function(task) {
  //      if (task.id === taskID) {
  //         task.complete = !task.complete
  //     }
  //   })
  // })

  // toDoArray[0].saveToStorage(toDoArray);


  console.log(targetObj);
};

function changeUrgency(e) {
  toDoArray[getIndex(e)].urgent = !toDoArray[getIndex(e)].urgent;
  toDoArray[getIndex(e)].saveToStorage(toDoArray);
  changeUrgencyImg(e);
};

function changeUrgencyImg(e) {
  if (toDoArray[getIndex(e)].urgent === true) {
    e.target.src = 'images/urgent-active.svg';
    e.target.closest('article').classList.add('urgent-article');
    e.target.closest('div').classList.add('urgent-icon');
  } else {
    e.target.src = 'images/urgent.svg';
    e.target.closest('article').classList.remove('urgent-article');
    e.target.closest('div').classList.remove ('urgent-icon');
  };
};

function enableDeleteBtn()