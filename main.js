const body= document.querySelector('body');
const gridRange = document.querySelector('#change-grid');
const gridContainer = document.querySelector('.canvas-container');
const gridDiv = document.createElement('div');
const gridBorderToggle = document.getElementById('grid-toggle');
const darkModeToggle = document.querySelector('.dark-mode-switch');
const clearBtn = document.querySelector('.grid-clear');

let color = '#174461';
let mouseDown = false;

gridDiv.classList.add('grid-div');

// RGB to Hexa
function rgbToHex(color) {
  // split rgb string to an array of just the numbers
  let rgbArray = [...color.split("(")[1]
                          .split(")")[0]
                          .split(", ")];
  // Convert the strings to numbers, then back to strings but use base 16
  let hex = rgbArray.map(str => {
    return parseInt(str).toString(16);
  });
  // return the joined array
  return `#${hex.join('')}`;
};


// Populate grid
function appendToParent(parent, element, num) {
  for (let i = 0; i < num; i++) {
    parent.appendChild(element.cloneNode(true));
  }
}

function populateContainerGrid(num) {
  let grid = num * num;
  // remove if there are any grids
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = ``;


  gridContainer.style.gridTemplateColumns = `repeat(${num}, 1fr)`;
  appendToParent(gridContainer, gridDiv, grid);
}

populateContainerGrid(16);

let divs = Array.from(gridContainer.querySelectorAll('div'));

// Fill artboard
function fill() {
  divs.forEach(div => div.style.backgroundColor = color);
}

// !!!! NEXT TO ADD: FLOOD-FILL & MATRIX GRID FUNCTIONALITY !!!! //

//================//
//  Drawing Mode  //
//================//

const backgroundDiv = document.querySelector('.background-div');
const inputs = document.querySelectorAll('input[name="changeMode"]');
const modes = ["draw", "erase", "fill"];
let currentMode = modes[0];

function changeMode(e) {
  currentMode = modes[modes.indexOf(e.target.dataset.mode)];
  backgroundDiv.style.transform = `translateX(${e.target.offsetLeft}px)`
}

inputs.forEach(input => input.addEventListener('change', e => changeMode(e)));

//================//
//  Change Color  //
//================//

const colorChanger = document.querySelector('#change-color');
const pickerDiv = document.querySelector('.picker');
const colorInput = document.querySelector('input[name="hex-code"]');
const eyedropTool = document.querySelector('#color-picker');

let eyedropIsOn = false;

function changeColor(elem) {
  let threeStrRegex = new RegExp(/^#?[\da-fA-F]{3}$/);
  let inputValue = elem.target.value;
  let newColor = inputValue.includes('#') ? inputValue : "#" + inputValue;
  color = newColor;
  pickerDiv.style.backgroundColor = newColor;
  
  if (threeStrRegex.test(newColor)){
    colorInput.placeholder = `#${newColor[1] + newColor[1] + newColor[2] + newColor[2] + newColor[3] + newColor[3]}`;
    colorChanger.value = `#${newColor[1] + newColor[1] + newColor[2] + newColor[2] + newColor[3] + newColor[3]}`;
  } else {
    colorChanger.value = newColor;
  }

  window.localStorage.setItem('lastColor', color);
}

function pickColor(e){
  if (!eyedropIsOn) return;

  let selectedColor = e.target.style.backgroundColor;
  let newColor;
  
  if (selectedColor === '') {
    newColor = '#ffffff';
  } else {
    newColor = rgbToHex(selectedColor);
  }

  color = newColor;
  pickerDiv.style.backgroundColor = newColor;
  colorInput.placeholder = newColor;
  colorChanger.value = newColor;
  eyedropTool.checked = false;
  eyedropIsOn = false;
  
  window.localStorage.setItem('lastColor', color);
}

colorChanger.addEventListener('change', e => {
  changeColor(e);
  colorInput.placeholder = e.target.value;
});

colorInput.addEventListener('change', e => {
  let regex = new RegExp(/^#?[\da-fA-f]{6}$|^#?[\da-fA-F]{3}$/);
  let inputValue = e.target.value;
  if (regex.test(inputValue)) {
    changeColor(e);
    e.target.style.border = "";
  };
  
  if (!regex.test(inputValue)) {
    e.target.style.border = "2px solid #ff755c";
  };
  e.target.value = '';
  colorInput.blur();
})

eyedropTool.addEventListener('change', e => {
  if (!e.target.checked) {
    eyedropIsOn = false;
    return;
  };
  if (e.target.checked) {
    eyedropIsOn = true;
    gridContainer.addEventListener('click', e => pickColor(e));
  }
})

//=================//
//  Lets paint🎨  //
//=================//

gridContainer.addEventListener('mousedown', e => {
  if (eyedropIsOn) return;
  mouseDown = true;

  if (currentMode === "draw") e.target.style.backgroundColor = color;
  if (currentMode === "erase") e.target.style.backgroundColor = '#ffffff';
  if (currentMode === "fill") fill();

});

gridContainer.addEventListener('mouseup', () => mouseDown = false);
gridContainer.addEventListener('mouseleave', () => mouseDown = false);

gridContainer.addEventListener('mousemove', e => {
  if (eyedropIsOn) return;
  if (!mouseDown) return;
  if (currentMode === "draw") e.target.style.backgroundColor = color;
  if (currentMode === "erase") e.target.style.backgroundColor = '#ffffff';
});

//===============//
//  Inputs ⌨🖱  //
//===============//

// Show and change the range value <span> element
gridRange.addEventListener('mousemove', () => gridRange.nextElementSibling.textContent = `${gridRange.value}x${gridRange.value}`);

gridRange.addEventListener('change', () => {
  gridRange.nextElementSibling.textContent = `${gridRange.value}x${gridRange.value}`;
  populateContainerGrid(gridRange.value);
  divs = Array.from(gridContainer.querySelectorAll('div'))
});

// Toggle grid outlines
gridBorderToggle.addEventListener('change', e => e.target.checked ? gridContainer.classList.add('outline-grid') : gridContainer.classList.remove('outline-grid') );

// Toggle dark mode
darkModeToggle.addEventListener('change', e => {
  if (e.target.checked) {
    body.classList.add('dark');
    window.localStorage.setItem('darkMode', true);
  }
  if (!e.target.checked) {
    body.classList.remove('dark');
    window.localStorage.setItem('darkMode', false);
  }
});


// Clear the canvas
clearBtn.addEventListener('click', () => divs.forEach(div => div.style.backgroundColor = ''));


// Update ui from localstorage
// Dark Mode
if (window.localStorage.getItem('darkMode') === 'true'){
  body.classList.add('dark');
  darkModeToggle.checked = true;
}

// Last color used
if (window.localStorage.getItem('lastColor') !== null) {
  let lastColor = window.localStorage.getItem('lastColor')
  colorChanger.value = lastColor;
  pickerDiv.style.backgroundColor = lastColor;
  colorInput.placeholder = lastColor;
  color = lastColor;
}