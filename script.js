const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

let listArrays = [];
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];

  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  console.log(selectedArray);
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);

  updateDOM();
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  listColumns.forEach(column => {
    column.classList.remove('over');
  });
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
