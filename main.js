const gridRange = document.querySelector('#change-grid');
const gridContainer = document.querySelector('.canvas-container');
const gridDiv = document.createElement('div');

// Show and change the range value <span> element
gridRange.addEventListener('change', () => {
  gridRange.nextElementSibling.textContent = `${gridRange.value}x${gridRange.value}`;
});

gridRange.addEventListener('mousemove', () => gridRange.nextElementSibling.textContent = `${gridRange.value}x${gridRange.value}`);

// Populate grid
function populateContainerGrid(num) {
  let grid = num * num;
  for (let i = 0; i < grid; i++) {
    gridContainer.appendChild(gridDiv);
  }
}