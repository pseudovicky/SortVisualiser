// DOM Elements
const algoButtons = document.querySelectorAll(".algo-btn");
const arrayInput = document.getElementById("array-input");
const speedButtons = document.querySelectorAll(".speed-btn");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const randomizeButton = document.getElementById("randomize");
const barsContainer = document.getElementById("bars-container");
const barLabels = document.getElementById("bar-labels");
const comparisonsElement = document.getElementById("comparisons");
const swapsElement = document.getElementById("swaps");

// State
let isSorting = false;
let isPaused = false;
let comparisons = 0;
let swaps = 0;
let currentAlgo = "bubbleSort";
let currentSpeed = "medium";
let currentArray = [];
let stepBuffer = [];
let pausePromiseResolve = null; // Resolver for the pause promise

// Algorithm button click handler
algoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isSorting) return;
    algoButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentAlgo = button.dataset.algo;
  });
});

// Speed button click handler
speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isSorting) return;
    speedButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentSpeed = button.dataset.speed;
  });
});

// Render bars and labels (no number inside bar)
function renderBars(array, compare, swap) {
  barsContainer.innerHTML = "";
  barLabels.innerHTML = "";
  const maxValue = Math.max(...array);
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;
    if (compare && (index === compare[0] || index === compare[1]))
      bar.classList.add("comparing");
    if (swap && (index === swap[0] || index === swap[1]))
      bar.classList.add("swapping");
    barsContainer.appendChild(bar);
    // Label below
    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = value;
    barLabels.appendChild(label);
  });
}

// Update stats
function updateStats(newComparisons, newSwaps) {
  comparisons = newComparisons;
  swaps = newSwaps;
  comparisonsElement.textContent = comparisons;
  swapsElement.textContent = swaps;
}

// Start button
startButton.addEventListener("click", () => {
  if (isSorting) return;
  const array = arrayInput.value
    .split(",")
    .map((num) => parseInt(num.trim()))
    .filter((num) => !isNaN(num));
  if (array.length === 0 || array.length > 20) {
    alert("Please enter 1-20 numbers, separated by commas");
    return;
  }
  isSorting = true;
  isPaused = false;
  startButton.disabled = true;
  pauseButton.disabled = false;
  randomizeButton.disabled = true;
  algoButtons.forEach((btn) => (btn.disabled = true));
  speedButtons.forEach((r) => (r.disabled = true));
  updateStats(0, 0);
  currentArray = array;
  renderBars(array);
  startSorting(currentAlgo, currentArray, currentSpeed);
});

// Randomize button
randomizeButton.addEventListener("click", () => {
  if (isSorting) return;
  initializeRandomArray();
});

// Pause button
pauseButton.addEventListener("click", () => {
  if (!isSorting) return;
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
  if (!isPaused && pausePromiseResolve) {
    pausePromiseResolve(); // Resolve the promise to resume execution
  }
});

// Initialize with random array
function initializeRandomArray() {
  const size = Math.floor(Math.random() * 6) + 8; // Random size between 8-13

  // Generate array with more diverse values
  const array = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1
  );

  // Ensure some duplicates for interesting sorting scenarios
  if (size > 8) {
    const duplicateIndex = Math.floor(Math.random() * (size - 1));
    array[duplicateIndex + 1] = array[duplicateIndex];
  }

  // Ensure some values are already in order
  if (Math.random() > 0.5 && size > 5) {
    const orderStart = Math.floor(Math.random() * (size - 3));
    for (let i = 0; i < 3; i++) {
      array[orderStart + i] = 20 + i * 5;
    }
  }

  arrayInput.value = array.join(",");
  renderBars(array);
}

initializeRandomArray();
pauseButton.disabled = true;

// Function to start sorting
async function startSorting(algorithm, array, speed) {
  const delay = {
    slow: 500,
    medium: 100,
    fast: 10,
  }[speed];

  comparisons = 0;
  swaps = 0;
  updateStats(0, 0);

  try {
    // Call the selected sorting algorithm
    const sortedArray = await window[algorithm](array, onStep, delay);

    // Process all buffered steps for visualization
    for (const step of stepBuffer) {
      if (isPaused) {
        await new Promise(resolve => {
          pausePromiseResolve = resolve;
        });
        pausePromiseResolve = null;
      }
      renderBars(step.array, step.compare, step.swap);
      if (step.compare) comparisons++;
      if (step.swap) swaps++;
      updateStats(comparisons, swaps);
      await new Promise((r) => setTimeout(r, delay));
    }
    stepBuffer = []; // Clear buffer after processing

    sortComplete(sortedArray);
  } catch (error) {
    sortError(error.message);
  }
}

// Callback function for each step of the sorting algorithm
async function onStep({ array, compare, swap }) {
  currentArray = array; // Update currentArray with the latest state
  stepBuffer.push({ array, compare, swap });
}

// Function to handle sort completion
function sortComplete(array) {
  stepBuffer = [];
  // Display the final sorted array
  renderBars(array);

  // Add a visual indication that sorting is complete
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => {
    bar.classList.add("sorted");
  });

  // Show a brief message that sorting is complete
  const message = document.createElement("div");
  message.className = "sort-complete-message";
  message.textContent = "Sorting Complete!";
  message.style.position = "absolute";
  message.style.top = "50%";
  message.style.left = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.backgroundColor = "rgba(0, 128, 0, 0.8)";
  message.style.color = "white";
  message.style.padding = "10px 20px";
  message.style.borderRadius = "5px";
  message.style.fontWeight = "bold";
  message.style.zIndex = "100";
  barsContainer.appendChild(message);

  // Remove the message after 2 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 2000);

  isSorting = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  randomizeButton.disabled = false;
  algoButtons.forEach((btn) => (btn.disabled = false));
  speedButtons.forEach((r) => (r.disabled = false));
}

// Function to handle sort errors
function sortError(message) {
  stepBuffer = [];
  alert(`Error: ${message}`);
  isSorting = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  randomizeButton.disabled = false;
  algoButtons.forEach((btn) => (btn.disabled = false));
  speedButtons.forEach((r) => (r.disabled = false));
}