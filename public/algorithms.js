/**
 * Bubble Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function bubbleSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Emit comparison step
      await onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      // Wait for delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Emit swap step
        await onStep({
          array: [...arr],
          compare: [j, j + 1],
          swap: [j, j + 1],
        });

        // Wait for delay
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // If no swapping occurred in this pass, array is sorted
    if (!swapped) {
      break;
    }
  }

  // Emit final sorted array
  await onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * Counting Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function countingSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Find the maximum element
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // Create count array and output array
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(0);

  // Store count of each element
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;

    // Emit counting step
    onStep({
      array: [...arr],
      compare: [i, i],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Change count[i] so that count[i] now contains actual position of this element in output array
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const value = arr[i] - min;
    const position = count[value] - 1;

    output[position] = arr[i];
    count[value]--;

    // Emit placement step
    onStep({
      array: [...output],
      compare: [i, position],
      swap: [position, position],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Copy the output array to arr
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];

    // Emit final position update
    onStep({
      array: [...arr],
      compare: null,
      swap: [i, i],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * Heap Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function heapSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, onStep, delay);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    onStep({
      array: [...arr],
      compare: [0, i],
      swap: [0, i],
    });

    [arr[0], arr[i]] = [arr[i], arr[0]];
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Call max heapify on the reduced heap
    await heapify(arr, i, 0, onStep, delay);
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * Heapify a subtree rooted with node i
 */
async function heapify(arr, n, i, onStep, delay) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Compare with left child
  if (left < n) {
    onStep({
      array: [...arr],
      compare: [largest, left],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  // Compare with right child
  if (right < n) {
    onStep({
      array: [...arr],
      compare: [largest, right],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    onStep({
      array: [...arr],
      compare: [i, largest],
      swap: [i, largest],
    });

    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Recursively heapify the affected sub-tree
    await heapify(arr, n, largest, onStep, delay);
  }
  return arr;
}

/**
 * Insertion Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function insertionSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [i, j],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    // Move elements that are greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      // Emit comparison step
      onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      arr[j + 1] = arr[j];

      // Emit swap step
      onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: [j, j + 1],
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      j--;
    }
    arr[j + 1] = key;

    // Emit final position update
    onStep({
      array: [...arr],
      compare: null,
      swap: [j + 1, j + 1],
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * Merge Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function mergeSort(array, onStep, delay) {
  const arr = [...array];
  await mergeSortHelper(arr, 0, arr.length - 1, onStep, delay);
  return arr;
}

/**
 * Helper function for Merge Sort
 */
async function mergeSortHelper(arr, left, right, onStep, delay) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Sort first and second halves
    await mergeSortHelper(arr, left, mid, onStep, delay);
    await mergeSortHelper(arr, mid + 1, right, onStep, delay);

    // Merge the sorted halves
    await merge(arr, left, mid, right, onStep, delay);
  }
}

/**
 * Merge function for Merge Sort
 */
async function merge(arr, left, mid, right, onStep, delay) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  // Create temporary arrays
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  // Merge the temporary arrays back
  while (i < n1 && j < n2) {
    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [left + i, mid + 1 + j],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }

    // Emit update step
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
    k++;
  }

  // Copy remaining elements
  while (i < n1) {
    arr[k] = L[i];
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
    j++;
    k++;
  }
}

/**
 * Quick Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function quickSort(array, onStep, delay) {
  const arr = [...array];
  await quickSortHelper(arr, 0, arr.length - 1, onStep, delay);
  return arr;
}

/**
 * Helper function for Quick Sort
 */
async function quickSortHelper(arr, low, high, onStep, delay) {
  if (low < high) {
    const pivotIndex = await partition(arr, low, high, onStep, delay);
    await quickSortHelper(arr, low, pivotIndex - 1, onStep, delay);
    await quickSortHelper(arr, pivotIndex + 1, high, onStep, delay);
  }
}

/**
 * Partition function for Quick Sort
 */
async function partition(arr, low, high, onStep, delay) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [j, high],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[j] <= pivot) {
      i++;

      // Emit swap step
      onStep({
        array: [...arr],
        compare: [j, high],
        swap: [i, j],
      });

      [arr[i], arr[j]] = [arr[j], arr[i]];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Final swap with pivot
  onStep({
    array: [...arr],
    compare: [i + 1, high],
    swap: [i + 1, high],
  });

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  await new Promise((resolve) => setTimeout(resolve, delay));

  return i + 1;
}

/**
 * Radix Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function radixSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Find the maximum number to know number of digits
  const max = Math.max(...arr);

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(arr, n, exp, onStep, delay);
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * A function to do counting sort of arr[] according to the digit represented by exp
 */
async function countingSortForRadix(arr, n, exp, onStep, delay) {
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  // Store count of occurrences in count[]
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;

    // Emit counting step
    onStep({
      array: [...arr],
      compare: [i, i],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Change count[i] so that count[i] now contains actual position of this digit in output[]
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    const position = count[digit] - 1;

    output[position] = arr[i];
    count[digit]--;

    // Emit placement step
    onStep({
      array: [...output],
      compare: [i, position],
      swap: [position, position],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Copy the output array to arr[]
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];

    // Emit final position update
    onStep({
      array: [...arr],
      compare: null,
      swap: [i, i],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return arr;
}

/**
 * Selection Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function selectionSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find minimum element in unsorted array
    for (let j = i + 1; j < n; j++) {
      // Emit comparison step
      onStep({
        array: [...arr],
        compare: [minIdx, j],
        swap: null,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap the found minimum element with the first element
    if (minIdx !== i) {
      // Emit swap step
      onStep({
        array: [...arr],
        compare: [i, minIdx],
        swap: [i, minIdx],
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}

/**
 * Shell Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function shellSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // Save arr[i] in temp and make a hole at position i
      const temp = arr[i];
      let j;

      // Shift earlier gap-sorted elements up until the correct location for arr[i] is found
      for (j = i; j >= gap; j -= gap) {
        // Emit comparison step
        onStep({
          array: [...arr],
          compare: [j - gap, i],
          swap: null,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));

        if (arr[j - gap] > temp) {
          // Emit swap step
          onStep({
            array: [...arr],
            compare: [j - gap, j],
            swap: [j, j - gap],
          });

          arr[j] = arr[j - gap];
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }

      // Put temp (the original arr[i]) in its correct location
      if (j !== i) {
        arr[j] = temp;
        // Emit final position update
        onStep({
          array: [...arr],
          compare: null,
          swap: [j, j],
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
  return arr;
}
