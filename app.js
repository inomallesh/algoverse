// AlgoVerse Main Application Controller
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentCategory: 'sorting',
    currentAlgoKey: 'bubbleSort',
    currentLanguage: 'java',
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    playTimer: null,
    speedMs: 500, // delay between steps
    customArray: [45, 22, 89, 14, 67, 33, 91, 10, 52],
    searchTarget: 33
  };

  // DOM Elements
  const stageEl = document.getElementById('stage');
  const visualizer = new Visualizer(stageEl);

  const categoryTabs = document.querySelectorAll('.nav-tab');
  const algoSelect = document.getElementById('algoSelect');
  const dataControls = document.getElementById('dataControls');
  const currentAlgoTitle = document.getElementById('currentAlgoTitle');
  const stepCounterBadge = document.getElementById('stepCounterBadge');
  const stageLegend = document.getElementById('stageLegend');
  const stepExplanation = document.getElementById('stepExplanation');

  const timelineSlider = document.getElementById('timelineSlider');
  const sliderProgressFill = document.getElementById('sliderProgressFill');
  const sliderStepLabel = document.getElementById('sliderStepLabel');

  const btnPlayPause = document.getElementById('btnPlayPause');
  const playIcon = document.getElementById('playIcon');
  const playText = document.getElementById('playText');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnReset = document.getElementById('btnReset');
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');

  const compBest = document.getElementById('compBest');
  const compAvg = document.getElementById('compAvg');
  const compWorst = document.getElementById('compWorst');
  const compSpace = document.getElementById('compSpace');
  const algoDescription = document.getElementById('algoDescription');

  const langTabs = document.querySelectorAll('.lang-btn');
  const codeDisplay = document.getElementById('codeDisplay');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // Category Algorithms Map
  const CATEGORY_MAP = {
    sorting: [
      { key: 'bubbleSort', label: 'Bubble Sort' },
      { key: 'selectionSort', label: 'Selection Sort' },
      { key: 'insertionSort', label: 'Insertion Sort' },
      { key: 'quickSort', label: 'Quick Sort' },
      { key: 'mergeSort', label: 'Merge Sort' }
    ],
    searching: [
      { key: 'linearSearch', label: 'Linear Search' },
      { key: 'binarySearch', label: 'Binary Search' }
    ],
    datastructures: [
      { key: 'stack', label: 'Stack (LIFO Operations)' },
      { key: 'queue', label: 'Queue (FIFO Operations)' },
      { key: 'linkedList', label: 'Singly Linked List' }
    ],
    treesgraphs: [
      { key: 'bst', label: 'Binary Search Tree (BST)' },
      { key: 'bfsDfs', label: 'Graph Traversal (BFS & DFS)' }
    ]
  };

  // Initialize
  function init() {
    setupEventListeners();
    switchCategory('sorting');
  }

  // Event Listeners
  function setupEventListeners() {
    // Category Tabs
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.category;
        if (cat !== state.currentCategory) {
          categoryTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          switchCategory(cat);
        }
      });
    });

    // Algorithm Select
    algoSelect.addEventListener('change', (e) => {
      state.currentAlgoKey = e.target.value;
      loadAlgorithm(state.currentAlgoKey);
    });

    // Timeline Slider (User dragging scrubber)
    timelineSlider.addEventListener('input', (e) => {
      pausePlayback();
      const targetStep = parseInt(e.target.value, 10);
      goToStep(targetStep);
    });

    // Playback Buttons
    btnPlayPause.addEventListener('click', togglePlayPause);
    btnPrev.addEventListener('click', () => {
      pausePlayback();
      if (state.currentStepIndex > 0) goToStep(state.currentStepIndex - 1);
    });
    btnNext.addEventListener('click', () => {
      pausePlayback();
      if (state.currentStepIndex < state.steps.length - 1) goToStep(state.currentStepIndex + 1);
    });
    btnReset.addEventListener('click', () => {
      pausePlayback();
      goToStep(0);
    });

    // Speed Slider
    speedSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      // Map 1..10 to 1200ms..80ms
      state.speedMs = Math.round(1200 - (val - 1) * 120);
      const displayFactor = (val / 5).toFixed(1);
      speedValue.textContent = `${displayFactor}x`;

      if (state.isPlaying) {
        clearInterval(state.playTimer);
        state.playTimer = setInterval(stepForward, state.speedMs);
      }
    });

    // Language Tabs
    langTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        langTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentLanguage = btn.dataset.lang;
        renderCode(state.currentAlgoKey, state.steps[state.currentStepIndex]?.line || 1);
      });
    });

    // Sound Toggle
    soundToggleBtn.addEventListener('click', () => {
      if (window.soundSynth) {
        const enabled = window.soundSynth.toggle();
        soundIcon.textContent = enabled ? '🔊' : '🔇';
      }
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      themeIcon.textContent = next === 'light' ? '☀️' : '🌙';
    });
  }

  // Category Switcher
  function switchCategory(cat) {
    pausePlayback();
    state.currentCategory = cat;

    // Populate Algo dropdown
    const algos = CATEGORY_MAP[cat];
    algoSelect.innerHTML = algos
      .map(a => `<option value="${a.key}">${a.label}</option>`)
      .join('');

    state.currentAlgoKey = algos[0].key;

    // Render Data Input Controls
    renderToolbarInputs(cat);

    // Load First Algorithm
    loadAlgorithm(state.currentAlgoKey);
  }

  // Dynamic Toolbar Inputs
  function renderToolbarInputs(cat) {
    if (cat === 'sorting') {
      dataControls.innerHTML = `
        <button id="btnRandomize" class="btn btn-secondary">🎲 Randomize</button>
        <div class="input-group">
          <label>Array:</label>
          <input type="text" id="arrayInput" class="input-field" style="width: 220px;" value="${state.customArray.join(', ')}">
          <button id="btnApplyArray" class="btn btn-secondary">Apply</button>
        </div>
      `;
      setupSortingInputs();
    } else if (cat === 'searching') {
      dataControls.innerHTML = `
        <button id="btnRandomizeSearch" class="btn btn-secondary">🎲 Randomize</button>
        <div class="input-group">
          <label>Target:</label>
          <input type="number" id="targetInput" class="input-field" style="width: 70px;" value="${state.searchTarget}">
          <button id="btnApplyTarget" class="btn btn-secondary">Search</button>
        </div>
      `;
      setupSearchingInputs();
    } else {
      dataControls.innerHTML = `
        <button id="btnReplayDemo" class="btn btn-secondary">🔄 Replay Interactive Walkthrough</button>
      `;
      document.getElementById('btnReplayDemo').addEventListener('click', () => {
        loadAlgorithm(state.currentAlgoKey);
      });
    }
  }

  function setupSortingInputs() {
    const btnRandomize = document.getElementById('btnRandomize');
    const btnApply = document.getElementById('btnApplyArray');
    const arrayInput = document.getElementById('arrayInput');

    btnRandomize.addEventListener('click', () => {
      const len = 9;
      state.customArray = Array.from({ length: len }, () => Math.floor(Math.random() * 85) + 10);
      arrayInput.value = state.customArray.join(', ');
      loadAlgorithm(state.currentAlgoKey);
    });

    btnApply.addEventListener('click', () => {
      const parsed = arrayInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length >= 3 && parsed.length <= 15) {
        state.customArray = parsed;
        loadAlgorithm(state.currentAlgoKey);
      } else {
        alert('Please enter between 3 and 15 numbers separated by commas.');
      }
    });
  }

  function setupSearchingInputs() {
    const btnRandomize = document.getElementById('btnRandomizeSearch');
    const btnApply = document.getElementById('btnApplyTarget');
    const targetInput = document.getElementById('targetInput');

    btnRandomize.addEventListener('click', () => {
      const len = 9;
      state.customArray = Array.from({ length: len }, () => Math.floor(Math.random() * 85) + 10);
      const randomIdx = Math.floor(Math.random() * state.customArray.length);
      state.searchTarget = state.customArray[randomIdx];
      targetInput.value = state.searchTarget;
      loadAlgorithm(state.currentAlgoKey);
    });

    btnApply.addEventListener('click', () => {
      const val = parseInt(targetInput.value, 10);
      if (!isNaN(val)) {
        state.searchTarget = val;
        loadAlgorithm(state.currentAlgoKey);
      }
    });
  }

  // Load and Generate Steps for Selected Algorithm
  function loadAlgorithm(algoKey) {
    pausePlayback();
    const meta = ALGO_METADATA[algoKey];
    if (!meta) return;

    // Update Titles and Meta
    currentAlgoTitle.textContent = meta.name;
    compBest.textContent = meta.complexity.best;
    compAvg.textContent = meta.complexity.avg;
    compWorst.textContent = meta.complexity.worst;
    compSpace.textContent = meta.complexity.space;
    algoDescription.textContent = meta.description;

    // Render Legend
    stageLegend.innerHTML = meta.legends
      .map(l => `
        <div class="legend-item">
          <span class="legend-color" style="background: ${l.color}"></span>
          <span>${l.label}</span>
        </div>
      `)
      .join('');

    // Generate Steps based on Algorithm
    state.steps = generateStepsFor(algoKey);
    state.currentStepIndex = 0;

    // Setup Slider bounds
    const maxStep = Math.max(0, state.steps.length - 1);
    timelineSlider.min = 0;
    timelineSlider.max = maxStep;
    timelineSlider.value = 0;

    // Display Step 0
    goToStep(0);
  }

  function generateStepsFor(algoKey) {
    switch (algoKey) {
      case 'bubbleSort':
        return AlgorithmGenerators.bubbleSort(state.customArray);
      case 'selectionSort':
        return AlgorithmGenerators.selectionSort(state.customArray);
      case 'insertionSort':
        return AlgorithmGenerators.insertionSort(state.customArray);
      case 'quickSort':
        return AlgorithmGenerators.quickSort(state.customArray);
      case 'mergeSort':
        return AlgorithmGenerators.mergeSort(state.customArray);
      case 'linearSearch':
        return AlgorithmGenerators.linearSearch(state.customArray, state.searchTarget);
      case 'binarySearch':
        return AlgorithmGenerators.binarySearch(state.customArray, state.searchTarget);
      case 'stack':
        return AlgorithmGenerators.stackDemo();
      case 'queue':
        return AlgorithmGenerators.queueDemo();
      case 'linkedList':
        return AlgorithmGenerators.linkedListDemo();
      case 'bst':
        return AlgorithmGenerators.bstDemo();
      case 'bfsDfs':
        return AlgorithmGenerators.graphDemo();
      default:
        return [];
    }
  }

  // Step Navigation & Timeline Slider Scrubber Handling
  function goToStep(index) {
    if (!state.steps || state.steps.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, state.steps.length - 1));
    state.currentStepIndex = clampedIndex;

    const currentStep = state.steps[clampedIndex];
    const totalSteps = state.steps.length;

    // Update Slider UI
    timelineSlider.value = clampedIndex;
    const percent = totalSteps > 1 ? (clampedIndex / (totalSteps - 1)) * 100 : 0;
    sliderProgressFill.style.width = `${percent}%`;
    sliderStepLabel.textContent = `${clampedIndex} / ${totalSteps - 1}`;
    stepCounterBadge.textContent = `Step ${clampedIndex} / ${totalSteps - 1}`;

    // Update Step Explanation Banner
    stepExplanation.textContent = currentStep.explanation || '';

    // Render Visualizer Stage
    visualizer.render(currentStep, state.currentCategory);

    // Sync Code Highlight
    renderCode(state.currentAlgoKey, currentStep.line || 1);

    // Stop playback if reached the end
    if (clampedIndex >= totalSteps - 1 && state.isPlaying) {
      pausePlayback();
    }
  }

  function stepForward() {
    if (state.currentStepIndex < state.steps.length - 1) {
      goToStep(state.currentStepIndex + 1);
    } else {
      pausePlayback();
    }
  }

  // Play / Pause Controller
  function togglePlayPause() {
    if (state.isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function startPlayback() {
    if (state.currentStepIndex >= state.steps.length - 1) {
      goToStep(0);
    }
    state.isPlaying = true;
    playIcon.textContent = '⏸';
    playText.textContent = 'Pause';
    btnPlayPause.classList.add('active');

    state.playTimer = setInterval(stepForward, state.speedMs);
  }

  function pausePlayback() {
    state.isPlaying = false;
    playIcon.textContent = '▶';
    playText.textContent = 'Play';
    btnPlayPause.classList.remove('active');
    if (state.playTimer) {
      clearInterval(state.playTimer);
      state.playTimer = null;
    }
  }

  // Synchronized Multi-Language Code Walkthrough with Line Highlighting
  function renderCode(algoKey, activeLine) {
    const meta = ALGO_METADATA[algoKey];
    if (!meta || !meta.code) return;

    const codeStr = meta.code[state.currentLanguage] || meta.code.java || '';
    const lines = codeStr.split('\n');

    let html = '';
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const isHighlighted = lineNum === activeLine;
      const highlightClass = isHighlighted ? ' active-line' : '';

      html += `<span class="code-line${highlightClass}" data-line="${lineNum}"><span style="color:var(--text-muted); margin-right: 12px; user-select: none;">${String(lineNum).padStart(2, ' ')}</span>${escapeHtml(lineText)}</span>`;
    });

    codeDisplay.innerHTML = html;

    // Scroll active line into view smoothly
    const activeEl = codeDisplay.querySelector('.active-line');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Launch app
  init();
});
