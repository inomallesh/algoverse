const ALGO_METADATA = {
  // ---------------- SORTING ----------------
  bubbleSort: {
    name: "Bubble Sort",
    category: "sorting",
    description: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. With each pass, the largest unsorted element 'bubbles up' to its correct position.",
    complexity: {
      best: "O(n)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    legends: [
      { color: "var(--color-default)", label: "Unsorted" },
      { color: "var(--color-comparing)", label: "Comparing" },
      { color: "var(--color-swapping)", label: "Swapping" },
      { color: "var(--color-sorted)", label: "Sorted" }
    ],
    code: {
      java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}`
    }
  },

  selectionSort: {
    name: "Selection Sort",
    category: "sorting",
    description: "Selection Sort divides the list into a sorted and unsorted region. In each pass, it finds the minimum element from the unsorted region and swaps it with the first unsorted element.",
    complexity: {
      best: "O(n²)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    legends: [
      { color: "var(--color-default)", label: "Unsorted" },
      { color: "var(--color-comparing)", label: "Scanning" },
      { color: "var(--color-target)", label: "Current Min" },
      { color: "var(--color-swapping)", label: "Swapping" },
      { color: "var(--color-sorted)", label: "Sorted" }
    ],
    code: {
      java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`
    }
  },

  insertionSort: {
    name: "Insertion Sort",
    category: "sorting",
    description: "Insertion Sort builds the final sorted array one item at a time. It takes each element and shifts larger elements to the right until finding its correct inserted position.",
    complexity: {
      best: "O(n)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    legends: [
      { color: "var(--color-default)", label: "Unsorted" },
      { color: "var(--color-target)", label: "Key Element" },
      { color: "var(--color-comparing)", label: "Comparing / Shifting" },
      { color: "var(--color-sorted)", label: "Sorted Subarray" }
    ],
    code: {
      java: `void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`
    }
  },

  quickSort: {
    name: "Quick Sort",
    category: "sorting",
    description: "Quick Sort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the array around the pivot, placing smaller elements before it and larger elements after it, then recurses.",
    complexity: {
      best: "O(n log n)",
      avg: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)"
    },
    legends: [
      { color: "var(--color-default)", label: "Default" },
      { color: "var(--color-pivot)", label: "Pivot" },
      { color: "var(--color-comparing)", label: "Comparing" },
      { color: "var(--color-swapping)", label: "Swapping" },
      { color: "var(--color-sorted)", label: "Sorted" }
    ],
    code: {
      java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}`,
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], high);
    return i + 1;
}`,
      javascript: `function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
    }
  },

  mergeSort: {
    name: "Merge Sort",
    category: "sorting",
    description: "Merge Sort recursively halves the array until single-element subarrays remain, then merges sorted halves back together in order. Guaranteed O(n log n) time complexity.",
    complexity: {
      best: "O(n log n)",
      avg: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)"
    },
    legends: [
      { color: "var(--color-default)", label: "Subarray" },
      { color: "var(--color-comparing)", label: "Comparing" },
      { color: "var(--color-swapping)", label: "Merging / Writing" },
      { color: "var(--color-sorted)", label: "Sorted" }
    ],
    code: {
      java: `void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int[] L = new int[n1], R = new int[n2];
    System.arraycopy(arr, l, L, 0, n1);
    System.arraycopy(arr, m + 1, R, 0, n2);
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]; i += 1
            else:
                arr[k] = R[j]; j += 1
            k += 1`,
      cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}`,
      javascript: `function merge(arr, l, m, r) {
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`
    }
  },

  // ---------------- SEARCHING ----------------
  linearSearch: {
    name: "Linear Search",
    category: "searching",
    description: "Linear Search sequentially checks each element of the list from start to finish until a match is found or the whole list has been searched.",
    complexity: {
      best: "O(1)",
      avg: "O(n)",
      worst: "O(n)",
      space: "O(1)"
    },
    legends: [
      { color: "var(--color-default)", label: "Unchecked" },
      { color: "var(--color-comparing)", label: "Checking" },
      { color: "var(--color-sorted)", label: "Found Target" },
      { color: "var(--color-inactive)", label: "Not Matched" }
    ],
    code: {
      java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i; // Target found
        }
    }
    return -1; // Not found
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Target found
    return -1  # Not found`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
    }
  },

  binarySearch: {
    name: "Binary Search",
    category: "searching",
    description: "Binary Search finds the position of a target value within a sorted array. It compares the target to the middle element and halves the search range each step.",
    complexity: {
      best: "O(1)",
      avg: "O(log n)",
      worst: "O(log n)",
      space: "O(1)"
    },
    legends: [
      { color: "var(--color-default)", label: "Active Window" },
      { color: "var(--color-pivot)", label: "Middle Element" },
      { color: "var(--color-sorted)", label: "Target Found" },
      { color: "var(--color-inactive)", label: "Discarded Half" }
    ],
    code: {
      java: `int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`
    }
  },

  // ---------------- DATA STRUCTURES ----------------
  stack: {
    name: "Stack (LIFO)",
    category: "datastructures",
    description: "A Stack is a Last-In, First-Out (LIFO) linear data structure. Elements are added (pushed) and removed (popped) exclusively from the top of the stack.",
    complexity: {
      best: "O(1) Push/Pop",
      avg: "O(1) Push/Pop",
      worst: "O(1) Push/Pop",
      space: "O(n)"
    },
    legends: [
      { color: "var(--accent-primary)", label: "Stack Elements" },
      { color: "var(--color-pivot)", label: "Top Pointer" },
      { color: "var(--color-swapping)", label: "Popping" }
    ],
    code: {
      java: `class Stack {
    private int[] data = new int[100];
    private int top = -1;

    void push(int val) {
        data[++top] = val;
    }

    int pop() {
        if (top == -1) throw new RuntimeException("Underflow");
        return data[top--];
    }

    int peek() {
        return data[top];
    }
}`,
      python: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, val):
        self.items.append(val)

    def pop(self):
        return self.items.pop() if self.items else None

    def peek(self):
        return self.items[-1] if self.items else None`,
      cpp: `class Stack {
    vector<int> items;
public:
    void push(int val) { items.push_back(val); }
    int pop() {
        int val = items.back();
        items.pop_back();
        return val;
    }
    int peek() { return items.back(); }
};`,
      javascript: `class Stack {
  constructor() { this.items = []; }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}`
    }
  },

  queue: {
    name: "Queue (FIFO)",
    category: "datastructures",
    description: "A Queue is a First-In, First-Out (FIFO) linear data structure. Elements enter at the Rear (enqueue) and exit from the Front (dequeue).",
    complexity: {
      best: "O(1) Enqueue/Dequeue",
      avg: "O(1) Enqueue/Dequeue",
      worst: "O(1) Enqueue/Dequeue",
      space: "O(n)"
    },
    legends: [
      { color: "var(--accent-secondary)", label: "Queue Element" },
      { color: "var(--color-comparing)", label: "Front" },
      { color: "var(--color-pivot)", label: "Rear" }
    ],
    code: {
      java: `class Queue {
    private LinkedList<Integer> list = new LinkedList<>();

    void enqueue(int val) {
        list.addLast(val);
    }

    int dequeue() {
        return list.removeFirst();
    }
}`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.q = deque()

    def enqueue(self, val):
        self.q.append(val)

    def dequeue(self):
        return self.q.popleft() if self.q else None`,
      cpp: `class Queue {
    deque<int> q;
public:
    void enqueue(int val) { q.push_back(val); }
    int dequeue() {
        int val = q.front();
        q.pop_front();
        return val;
    }
};`,
      javascript: `class Queue {
  constructor() { this.items = []; }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
}`
    }
  },

  linkedList: {
    name: "Singly Linked List",
    category: "datastructures",
    description: "A Singly Linked List consists of nodes where each node contains data and a pointer/reference to the next node in the sequence.",
    complexity: {
      best: "O(1) Insert Head",
      avg: "O(n) Search/Delete",
      worst: "O(n) Traversal",
      space: "O(n)"
    },
    legends: [
      { color: "var(--accent-primary)", label: "Node Data" },
      { color: "var(--color-comparing)", label: "Traversing Pointer" },
      { color: "var(--color-sorted)", label: "Target Node" }
    ],
    code: {
      java: `class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}

class LinkedList {
    Node head;
    void insertHead(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        head = newNode;
    }
}`,
      python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_head(self, val):
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node`,
      cpp: `struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};`,
      javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}`
    }
  },

  // ---------------- TREES & GRAPHS ----------------
  bst: {
    name: "Binary Search Tree",
    category: "treesgraphs",
    description: "A Binary Search Tree (BST) is a hierarchical tree data structure where each node has at most two children. The left subtree contains only nodes with keys lesser than the node's key, and the right subtree contains only keys greater.",
    complexity: {
      best: "O(log n) Search",
      avg: "O(log n) Search",
      worst: "O(n) Degenerate",
      space: "O(n)"
    },
    legends: [
      { color: "var(--accent-primary)", label: "Tree Node" },
      { color: "var(--color-comparing)", label: "Visiting" },
      { color: "var(--color-sorted)", label: "Found / Added" }
    ],
    code: {
      java: `Node insert(Node root, int val) {
    if (root == null) return new Node(val);
    if (val < root.val)
        root.left = insert(root.left, val);
    else if (val > root.val)
        root.right = insert(root.right, val);
    return root;
}`,
      python: `def insert(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root`,
      cpp: `Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}`,
      javascript: `function insert(root, val) {
  if (!root) return new Node(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}`
    }
  },

  bfsDfs: {
    name: "Graph Traversal (BFS & DFS)",
    category: "treesgraphs",
    description: "BFS explores nodes level by level using a Queue (FIFO), ideal for finding shortest paths. DFS explores deeply down each path using recursion or a Stack (LIFO) before backtracking.",
    complexity: {
      best: "O(V + E)",
      avg: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)"
    },
    legends: [
      { color: "var(--accent-primary)", label: "Unvisited Node" },
      { color: "var(--color-comparing)", label: "Currently Visiting" },
      { color: "var(--color-sorted)", label: "Visited" }
    ],
    code: {
      java: `void bfs(int start, List<List<Integer>> adj) {
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> q = new LinkedList<>();
    visited[start] = true;
    q.add(start);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                q.add(v);
            }
        }
    }
}`,
      python: `def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
      cpp: `void bfs(int start, const vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`
    }
  }
};
