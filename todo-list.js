class ToDoList {
  constructor(toDoObj) {
    this.title = toDoObj.title;
    this.tasks = toDoObj.tasks;
    this.id = toDoObj.id || Date.now();
    this.urgent = toDoObj.urgent || false;
  };

  saveToStorage(gblArray) {
    localStorage.setItem("array", JSON.stringify(gblArray));
  };

  deleteFromStorage(delID) {
    toDoArray = toDoArray.filter(id => {return parseInt(delID) !== id.id});
    this.saveToStorage(toDoArray);
  };

  updateToDo(gblArray) {
    this.urgent = !this.urgent;
    this.saveToStorage(gblArray);
  };

  updateTask() {

  };
};