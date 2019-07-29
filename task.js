class Task {
  constructor(taskObj) {
    this.task = taskObj.task;
    this.id = taskObj.id || Date.now();
    this.complete = taskObj.complete || false;
  }; 
};