// Algorithm Step Generators
// Each generator returns an array of Step objects:
// {
//   array / data: snapshot of elements,
//   pointers: { [name]: index or key },
//   states: { [index]: 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'target' | 'inactive' },
//   explanation: string,
//   line: number (1-based line in the snippet)
// }

const AlgorithmGenerators = {
  // ==================== SORTING ====================
  bubbleSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Initial array with ${n} elements. Ready to begin Bubble Sort passes.`,
      line: 1
    });

    for (let i = 0; i < n - 1; i++) {
      steps.push({
        array: [...a],
        pointers: { pass: i },
        states: this._getSortedStates(n, n - i),
        explanation: `Starting Pass #${i + 1}. We will compare adjacent pairs up to index ${n - i - 1}.`,
        line: 3
      });

      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push({
          array: [...a],
          pointers: { i: j, 'i+1': j + 1 },
          states: {
            ...this._getSortedStates(n, n - i),
            [j]: 'comparing',
            [j + 1]: 'comparing'
          },
          explanation: `Comparing adjacent elements: arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]}).`,
          line: 4
        });

        if (a[j] > a[j + 1]) {
          // Swap step
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;

          steps.push({
            array: [...a],
            pointers: { i: j, 'i+1': j + 1 },
            states: {
              ...this._getSortedStates(n, n - i),
              [j]: 'swapping',
              [j + 1]: 'swapping'
            },
            explanation: `Since ${temp} > ${a[j]}, swap them! Now arr[${j}]=${a[j]} and arr[${j + 1}]=${a[j + 1]}.`,
            line: 6
          });
        } else {
          steps.push({
            array: [...a],
            pointers: { i: j, 'i+1': j + 1 },
            states: {
              ...this._getSortedStates(n, n - i),
              [j]: 'comparing',
              [j + 1]: 'comparing'
            },
            explanation: `${a[j]} ≤ ${a[j + 1]}, so they are already in the correct relative order. No swap needed.`,
            line: 5
          });
        }
      }

      // Element at n - i - 1 is now locked in place
      steps.push({
        array: [...a],
        pointers: { locked: n - i - 1 },
        states: this._getSortedStates(n, n - i - 1),
        explanation: `Pass #${i + 1} complete. Value ${a[n - i - 1]} has bubbled into its sorted spot at index ${n - i - 1}.`,
        line: 3
      });
    }

    // All sorted
    const allSorted = {};
    for (let k = 0; k < n; k++) allSorted[k] = 'sorted';
    steps.push({
      array: [...a],
      pointers: {},
      states: allSorted,
      explanation: `🎉 Array is completely sorted in ascending order!`,
      line: 11
    });

    return steps;
  },

  selectionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Initial array. Selection Sort will find the minimum element in each pass and place it in front.`,
      line: 1
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        array: [...a],
        pointers: { i: i, min: minIdx },
        states: {
          ...this._getSortedPrefix(i),
          [minIdx]: 'target'
        },
        explanation: `Pass #${i + 1}: Assume current element arr[${i}] (${a[i]}) is the minimum.`,
        line: 4
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...a],
          pointers: { i: i, min: minIdx, j: j },
          states: {
            ...this._getSortedPrefix(i),
            [minIdx]: 'target',
            [j]: 'comparing'
          },
          explanation: `Scanning index ${j}: Compare arr[${j}] (${a[j]}) with current min arr[${minIdx}] (${a[minIdx]}).`,
          line: 6
        });

        if (a[j] < a[minIdx]) {
          minIdx = j;
          steps.push({
            array: [...a],
            pointers: { i: i, newMin: minIdx },
            states: {
              ...this._getSortedPrefix(i),
              [minIdx]: 'target'
            },
            explanation: `Found smaller element! New minimum is arr[${minIdx}] (${a[minIdx]}).`,
            line: 7
          });
        }
      }

      // Swap minimum into index i
      if (minIdx !== i) {
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;

        steps.push({
          array: [...a],
          pointers: { i: i, swappedFrom: minIdx },
          states: {
            ...this._getSortedPrefix(i),
            [i]: 'swapping',
            [minIdx]: 'swapping'
          },
          explanation: `Swap found minimum arr[${minIdx}] (${a[i]}) with arr[${i}] (${a[minIdx]}).`,
          line: 11
        });
      }

      steps.push({
        array: [...a],
        pointers: { sorted: i },
        states: this._getSortedPrefix(i + 1),
        explanation: `Index ${i} (${a[i]}) is now sorted!`,
        line: 12
      });
    }

    const allSorted = {};
    for (let k = 0; k < n; k++) allSorted[k] = 'sorted';
    steps.push({
      array: [...a],
      pointers: {},
      states: allSorted,
      explanation: `🎉 Selection Sort complete! Entire array is sorted.`,
      line: 13
    });

    return steps;
  },

  insertionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;

    steps.push({
      array: [...a],
      pointers: {},
      states: { 0: 'sorted' },
      explanation: `Initial array. Element at index 0 (${a[0]}) is considered trivially sorted.`,
      line: 1
    });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;

      steps.push({
        array: [...a],
        pointers: { keyIndex: i },
        states: {
          ...this._getSortedPrefix(i),
          [i]: 'target'
        },
        explanation: `Pick key = ${key} at index ${i}. Insert it into the sorted subarray [0..${i - 1}].`,
        line: 4
      });

      while (j >= 0 && a[j] > key) {
        steps.push({
          array: [...a],
          pointers: { key: key, comparingWith: j },
          states: {
            ...this._getSortedPrefix(i),
            [j]: 'comparing',
            [j + 1]: 'swapping'
          },
          explanation: `Since arr[${j}] (${a[j]}) > key (${key}), shift ${a[j]} right to index ${j + 1}.`,
          line: 7
        });

        a[j + 1] = a[j];
        j--;

        steps.push({
          array: [...a],
          pointers: { shifted: j + 1 },
          states: {
            ...this._getSortedPrefix(i + 1),
            [j + 1]: 'target'
          },
          explanation: `Shifted. Searching leftward for key's landing position.`,
          line: 8
        });
      }

      a[j + 1] = key;
      steps.push({
        array: [...a],
        pointers: { insertedAt: j + 1 },
        states: this._getSortedPrefix(i + 1),
        explanation: `Placed key = ${key} at position ${j + 1}. Subarray [0..${i}] is now sorted.`,
        line: 10
      });
    }

    const allSorted = {};
    for (let k = 0; k < n; k++) allSorted[k] = 'sorted';
    steps.push({
      array: [...a],
      pointers: {},
      states: allSorted,
      explanation: `🎉 Insertion Sort finished! All elements sorted.`,
      line: 11
    });

    return steps;
  },

  quickSort(arr) {
    const steps = [];
    const a = [...arr];

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Initial array. Quick Sort will choose a pivot, partition around it, and recurse.`,
      line: 1
    });

    const recursiveQS = (low, high) => {
      if (low < high) {
        const pivotIndex = partition(low, high);
        recursiveQS(low, pivotIndex - 1);
        recursiveQS(pivotIndex + 1, high);
      } else if (low === high) {
        steps.push({
          array: [...a],
          pointers: { single: low },
          states: { [low]: 'sorted' },
          explanation: `Single element arr[${low}] (${a[low]}) is trivially sorted.`,
          line: 2
        });
      }
    };

    const partition = (low, high) => {
      const pivot = a[high];
      let i = low - 1;

      steps.push({
        array: [...a],
        pointers: { low, high, pivot: high },
        states: {
          [high]: 'pivot',
          ...this._getRangeStates(low, high - 1, 'inactive')
        },
        explanation: `Partition range [${low}..${high}]. Choose pivot = arr[${high}] (${pivot}).`,
        line: 2
      });

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...a],
          pointers: { i: Math.max(low, i), j: j, pivot: high },
          states: {
            [high]: 'pivot',
            [j]: 'comparing'
          },
          explanation: `Comparing arr[${j}] (${a[j]}) with pivot (${pivot}).`,
          line: 5
        });

        if (a[j] < pivot) {
          i++;
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;

          steps.push({
            array: [...a],
            pointers: { i: i, j: j, pivot: high },
            states: {
              [high]: 'pivot',
              [i]: 'swapping',
              [j]: 'swapping'
            },
            explanation: `${a[i]} < ${pivot}. Increment i to ${i} and swap arr[${i}] with arr[${j}].`,
            line: 7
          });
        }
      }

      // Swap pivot into i + 1
      const temp = a[i + 1];
      a[i + 1] = a[high];
      a[high] = temp;

      steps.push({
        array: [...a],
        pointers: { pivotFinal: i + 1 },
        states: {
          [i + 1]: 'sorted'
        },
        explanation: `Place pivot ${a[i + 1]} at its sorted final position ${i + 1}.`,
        line: 10
      });

      return i + 1;
    };

    recursiveQS(0, a.length - 1);

    const allSorted = {};
    for (let k = 0; k < a.length; k++) allSorted[k] = 'sorted';
    steps.push({
      array: [...a],
      pointers: {},
      states: allSorted,
      explanation: `🎉 Quick Sort complete! All partitions merged.`,
      line: 11
    });

    return steps;
  },

  mergeSort(arr) {
    const steps = [];
    const a = [...arr];

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Initial array. Merge Sort divides the array into single-element lists, then merges sorted sublists.`,
      line: 1
    });

    const merge = (l, m, r) => {
      const left = a.slice(l, m + 1);
      const right = a.slice(m + 1, r + 1);

      steps.push({
        array: [...a],
        pointers: { left: l, mid: m, right: r },
        states: {
          ...this._getRangeStates(l, m, 'comparing'),
          ...this._getRangeStates(m + 1, r, 'target')
        },
        explanation: `Merging left sublist [${l}..${m}] and right sublist [${m + 1}..${r}].`,
        line: 2
      });

      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          a[k] = left[i];
          steps.push({
            array: [...a],
            pointers: { write: k },
            states: { [k]: 'swapping' },
            explanation: `Left element ${left[i]} ≤ Right element ${right[j]}. Write ${left[i]} at index ${k}.`,
            line: 9
          });
          i++;
        } else {
          a[k] = right[j];
          steps.push({
            array: [...a],
            pointers: { write: k },
            states: { [k]: 'swapping' },
            explanation: `Right element ${right[j]} < Left element ${left[i]}. Write ${right[j]} at index ${k}.`,
            line: 11
          });
          j++;
        }
        k++;
      }

      while (i < left.length) {
        a[k] = left[i];
        steps.push({
          array: [...a],
          pointers: { write: k },
          states: { [k]: 'swapping' },
          explanation: `Append remaining left element ${left[i]} at index ${k}.`,
          line: 13
        });
        i++;
        k++;
      }

      while (j < right.length) {
        a[k] = right[j];
        steps.push({
          array: [...a],
          pointers: { write: k },
          states: { [k]: 'swapping' },
          explanation: `Append remaining right element ${right[j]} at index ${k}.`,
          line: 14
        });
        j++;
        k++;
      }

      steps.push({
        array: [...a],
        pointers: { mergedRange: `${l}-${r}` },
        states: this._getRangeStates(l, r, 'sorted'),
        explanation: `Merged sublist [${l}..${r}] is now sorted!`,
        line: 15
      });
    };

    const divideAndConquer = (l, r) => {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      divideAndConquer(l, m);
      divideAndConquer(m + 1, r);
      merge(l, m, r);
    };

    divideAndConquer(0, a.length - 1);

    const allSorted = {};
    for (let k = 0; k < a.length; k++) allSorted[k] = 'sorted';
    steps.push({
      array: [...a],
      pointers: {},
      states: allSorted,
      explanation: `🎉 Merge Sort complete! All halves successfully merged.`,
      line: 16
    });

    return steps;
  },

  // ==================== SEARCHING ====================
  linearSearch(arr, target) {
    const steps = [];
    const a = [...arr];

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Looking for target value = ${target} starting at index 0.`,
      line: 1
    });

    let found = false;
    for (let i = 0; i < a.length; i++) {
      steps.push({
        array: [...a],
        pointers: { i: i },
        states: {
          ...this._getRangeStates(0, i - 1, 'inactive'),
          [i]: 'comparing'
        },
        explanation: `Checking index ${i}: Is arr[${i}] (${a[i]}) equal to target (${target})?`,
        line: 3
      });

      if (a[i] === target) {
        steps.push({
          array: [...a],
          pointers: { found: i },
          states: {
            ...this._getRangeStates(0, a.length - 1, 'inactive'),
            [i]: 'sorted'
          },
          explanation: `🎯 MATCH FOUND! Target ${target} located at index ${i}!`,
          line: 4
        });
        found = true;
        break;
      }
    }

    if (!found) {
      steps.push({
        array: [...a],
        pointers: {},
        states: this._getRangeStates(0, a.length - 1, 'inactive'),
        explanation: `❌ Target ${target} was not found in the array. Return -1.`,
        line: 7
      });
    }

    return steps;
  },

  binarySearch(arr, target) {
    const steps = [];
    // Binary search requires sorted array
    const a = [...arr].sort((x, y) => x - y);

    steps.push({
      array: [...a],
      pointers: {},
      states: {},
      explanation: `Binary search begins on sorted array. Searching for target = ${target}.`,
      line: 1
    });

    let low = 0;
    let high = a.length - 1;
    let found = false;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const states = {};

      for (let k = 0; k < a.length; k++) {
        if (k < low || k > high) states[k] = 'inactive';
      }
      states[mid] = 'pivot';

      steps.push({
        array: [...a],
        pointers: { low, mid, high },
        states: states,
        explanation: `Window [${low}..${high}]. Middle index mid = ${mid} (value = ${a[mid]}).`,
        line: 4
      });

      if (a[mid] === target) {
        steps.push({
          array: [...a],
          pointers: { foundAt: mid },
          states: {
            ...this._getRangeStates(0, a.length - 1, 'inactive'),
            [mid]: 'sorted'
          },
          explanation: `🎯 MATCH FOUND! Target ${target} located at mid index ${mid}!`,
          line: 5
        });
        found = true;
        break;
      } else if (a[mid] < target) {
        steps.push({
          array: [...a],
          pointers: { low, mid, high },
          states: {
            ...states,
            [mid]: 'comparing'
          },
          explanation: `${a[mid]} < ${target}. Target must be in the right half. Shift low = mid + 1 (${mid + 1}).`,
          line: 6
        });
        low = mid + 1;
      } else {
        steps.push({
          array: [...a],
          pointers: { low, mid, high },
          states: {
            ...states,
            [mid]: 'comparing'
          },
          explanation: `${a[mid]} > ${target}. Target must be in the left half. Shift high = mid - 1 (${mid - 1}).`,
          line: 7
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        array: [...a],
        pointers: {},
        states: this._getRangeStates(0, a.length - 1, 'inactive'),
        explanation: `❌ low (${low}) > high (${high}). Search space exhausted. Target ${target} not found. Return -1.`,
        line: 9
      });
    }

    return steps;
  },

  // ==================== DATA STRUCTURES ====================
  stackDemo() {
    const steps = [];
    let items = [];

    steps.push({
      dsType: 'stack',
      items: [...items],
      action: 'init',
      pointers: { top: -1 },
      explanation: `Initialized empty Stack. Top is at -1.`,
      line: 3
    });

    const ops = [
      { op: 'push', val: 12 },
      { op: 'push', val: 45 },
      { op: 'push', val: 78 },
      { op: 'peek' },
      { op: 'pop' },
      { op: 'push', val: 99 },
      { op: 'pop' },
      { op: 'pop' }
    ];

    ops.forEach(o => {
      if (o.op === 'push') {
        items.push(o.val);
        steps.push({
          dsType: 'stack',
          items: [...items],
          action: 'push',
          targetVal: o.val,
          pointers: { top: items.length - 1 },
          explanation: `PUSH ${o.val}: Added ${o.val} to the top of the stack. (Size: ${items.length})`,
          line: 6
        });
      } else if (o.op === 'pop') {
        const popped = items.pop();
        steps.push({
          dsType: 'stack',
          items: [...items],
          action: 'pop',
          targetVal: popped,
          pointers: { top: items.length - 1 },
          explanation: `POP: Removed top element ${popped} from the stack. (Size: ${items.length})`,
          line: 10
        });
      } else if (o.op === 'peek') {
        steps.push({
          dsType: 'stack',
          items: [...items],
          action: 'peek',
          pointers: { top: items.length - 1 },
          explanation: `PEEK: Viewing current top element ${items[items.length - 1]} without removing it.`,
          line: 14
        });
      }
    });

    return steps;
  },

  queueDemo() {
    const steps = [];
    let items = [];

    steps.push({
      dsType: 'queue',
      items: [...items],
      action: 'init',
      pointers: { front: -1, rear: -1 },
      explanation: `Initialized empty Queue (FIFO).`,
      line: 2
    });

    const ops = [
      { op: 'enqueue', val: 10 },
      { op: 'enqueue', val: 20 },
      { op: 'enqueue', val: 30 },
      { op: 'dequeue' },
      { op: 'enqueue', val: 40 },
      { op: 'dequeue' },
      { op: 'enqueue', val: 50 }
    ];

    ops.forEach(o => {
      if (o.op === 'enqueue') {
        items.push(o.val);
        steps.push({
          dsType: 'queue',
          items: [...items],
          action: 'enqueue',
          targetVal: o.val,
          pointers: { front: 0, rear: items.length - 1 },
          explanation: `ENQUEUE ${o.val}: Added to the Rear of the queue. (Size: ${items.length})`,
          line: 5
        });
      } else if (o.op === 'dequeue') {
        const deq = items.shift();
        steps.push({
          dsType: 'queue',
          items: [...items],
          action: 'dequeue',
          targetVal: deq,
          pointers: { front: 0, rear: Math.max(0, items.length - 1) },
          explanation: `DEQUEUE: Removed front element ${deq} from the queue. (Size: ${items.length})`,
          line: 9
        });
      }
    });

    return steps;
  },

  linkedListDemo() {
    const steps = [];
    let list = [15, 30, 45];

    steps.push({
      dsType: 'linkedList',
      nodes: [...list],
      pointers: { head: 0 },
      explanation: `Singly Linked List with 3 nodes: 15 -> 30 -> 45 -> null.`,
      line: 5
    });

    // Insert Head 5
    list = [5, ...list];
    steps.push({
      dsType: 'linkedList',
      nodes: [...list],
      pointers: { newHead: 0 },
      explanation: `Insert Head (5): Create node(5) and point its next pointer to old head(15).`,
      line: 8
    });

    // Traverse
    for (let i = 0; i < list.length; i++) {
      steps.push({
        dsType: 'linkedList',
        nodes: [...list],
        pointers: { current: i },
        explanation: `Traversing node ${i + 1}/${list.length}: Value = ${list[i]}, Next = ${i < list.length - 1 ? list[i+1] : 'null'}.`,
        line: 9
      });
    }

    // Insert Tail 60
    list = [...list, 60];
    steps.push({
      dsType: 'linkedList',
      nodes: [...list],
      pointers: { tail: list.length - 1 },
      explanation: `Insert Tail (60): Traversed to end and attached node(60).`,
      line: 8
    });

    return steps;
  },

  // ==================== TREES & GRAPHS ====================
  bstDemo() {
    const steps = [];

    // Tree structure representation
    // Nodes: id, val, x, y, left, right
    const nodes = [
      { id: 1, val: 50, x: 250, y: 50 },
      { id: 2, val: 30, x: 150, y: 130 },
      { id: 3, val: 70, x: 350, y: 130 },
      { id: 4, val: 20, x: 100, y: 210 },
      { id: 5, val: 40, x: 200, y: 210 },
      { id: 6, val: 60, x: 300, y: 210 },
      { id: 7, val: 80, x: 400, y: 210 }
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 7 }
    ];

    steps.push({
      dsType: 'tree',
      nodes: nodes.map(n => ({ ...n })),
      edges: edges,
      activeNodes: [],
      visitedNodes: [],
      explanation: `Binary Search Tree (BST) initialized. Notice left child < parent < right child.`,
      line: 1
    });

    // Search for 60
    const searchTarget = 60;
    const searchPath = [1, 3, 6];

    steps.push({
      dsType: 'tree',
      nodes: nodes.map(n => ({ ...n })),
      edges: edges,
      activeNodes: [1],
      visitedNodes: [],
      explanation: `Searching for ${searchTarget}: Start at Root (50). Since ${searchTarget} > 50, go RIGHT.`,
      line: 5
    });

    steps.push({
      dsType: 'tree',
      nodes: nodes.map(n => ({ ...n })),
      edges: edges,
      activeNodes: [3],
      visitedNodes: [1],
      explanation: `At node (70). Since ${searchTarget} < 70, go LEFT.`,
      line: 3
    });

    steps.push({
      dsType: 'tree',
      nodes: nodes.map(n => ({ ...n })),
      edges: edges,
      activeNodes: [6],
      visitedNodes: [1, 3, 6],
      explanation: `🎯 Found node with value ${searchTarget}! Search successful.`,
      line: 2
    });

    // Inorder traversal demo (20 -> 30 -> 40 -> 50 -> 60 -> 70 -> 80)
    const inorderSeq = [4, 2, 5, 1, 6, 3, 7];
    const visited = [];

    inorderSeq.forEach(nodeId => {
      visited.push(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      steps.push({
        dsType: 'tree',
        nodes: nodes.map(n => ({ ...n })),
        edges: edges,
        activeNodes: [nodeId],
        visitedNodes: [...visited],
        explanation: `Inorder Traversal (Left-Root-Right): Visited node ${node.val}.`,
        line: 6
      });
    });

    return steps;
  },

  graphDemo() {
    const steps = [];

    const nodes = [
      { id: 'A', x: 250, y: 50 },
      { id: 'B', x: 150, y: 130 },
      { id: 'C', x: 350, y: 130 },
      { id: 'D', x: 100, y: 220 },
      { id: 'E', x: 200, y: 220 },
      { id: 'F', x: 300, y: 220 },
      { id: 'G', x: 400, y: 220 }
    ];

    const edges = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'C', to: 'G' },
      { from: 'E', to: 'F' }
    ];

    steps.push({
      dsType: 'graph',
      nodes: nodes,
      edges: edges,
      activeNodes: [],
      visitedNodes: [],
      queueState: [],
      explanation: `Graph with 7 vertices and 7 edges. Ready for Breadth-First Search (BFS) from node A.`,
      line: 1
    });

    // BFS Sequence: A -> B, C -> D, E, F, G
    const bfsSteps = [
      { active: 'A', visited: ['A'], q: ['B', 'C'], exp: `Visit source 'A'. Enqueue unvisited neighbors [B, C].` },
      { active: 'B', visited: ['A', 'B'], q: ['C', 'D', 'E'], exp: `Dequeue and visit 'B'. Enqueue unvisited neighbors [D, E].` },
      { active: 'C', visited: ['A', 'B', 'C'], q: ['D', 'E', 'F', 'G'], exp: `Dequeue and visit 'C'. Enqueue unvisited neighbors [F, G].` },
      { active: 'D', visited: ['A', 'B', 'C', 'D'], q: ['E', 'F', 'G'], exp: `Dequeue and visit 'D'. No unvisited neighbors.` },
      { active: 'E', visited: ['A', 'B', 'C', 'D', 'E'], q: ['F', 'G'], exp: `Dequeue and visit 'E'. Neighbor F is already discovered.` },
      { active: 'F', visited: ['A', 'B', 'C', 'D', 'E', 'F'], q: ['G'], exp: `Dequeue and visit 'F'.` },
      { active: 'G', visited: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], q: [], exp: `Dequeue and visit 'G'. Queue is now empty. BFS complete!` }
    ];

    bfsSteps.forEach((s, idx) => {
      steps.push({
        dsType: 'graph',
        nodes: nodes,
        edges: edges,
        activeNodes: [s.active],
        visitedNodes: s.visited,
        queueState: s.q,
        explanation: s.exp,
        line: 8
      });
    });

    return steps;
  },

  // Helpers
  _getSortedStates(n, fromIdx) {
    const states = {};
    for (let i = fromIdx; i < n; i++) states[i] = 'sorted';
    return states;
  },

  _getSortedPrefix(len) {
    const states = {};
    for (let i = 0; i < len; i++) states[i] = 'sorted';
    return states;
  },

  _getRangeStates(start, end, state) {
    const states = {};
    for (let i = start; i <= end; i++) states[i] = state;
    return states;
  }
};
