// Visualizer Rendering Engine
class Visualizer {
  constructor(stageElement) {
    this.stage = stageElement;
  }

  render(step, currentCategory) {
    if (!step) return;

    if (currentCategory === 'sorting') {
      this.renderSorting(step);
    } else if (currentCategory === 'searching') {
      this.renderSearching(step);
    } else if (currentCategory === 'datastructures') {
      this.renderDataStructures(step);
    } else if (currentCategory === 'treesgraphs') {
      this.renderTreesAndGraphs(step);
    }
  }

  // 1. Sorting Visualizer (Vertical Animated Bars with Floating Pointers)
  renderSorting(step) {
    const { array, pointers = {}, states = {} } = step;
    const maxVal = Math.max(...array, 100);

    let html = `<div class="bars-container">`;

    array.forEach((val, idx) => {
      const stateClass = states[idx] ? ` ${states[idx]}` : '';
      const heightPercent = Math.max(12, (val / maxVal) * 100);

      // Find any pointers targeting this index
      const matchedPointers = Object.entries(pointers)
        .filter(([_, ptrIdx]) => ptrIdx === idx)
        .map(([name]) => name);

      let pointerTag = '';
      if (matchedPointers.length > 0) {
        pointerTag = `<div class="bar-pointer-tag" style="background: ${this._getPointerColor(matchedPointers[0])}">${matchedPointers.join(', ')}</div>`;
      }

      html += `
        <div class="bar-wrapper" style="height: 100%;">
          ${pointerTag}
          <div class="bar${stateClass}" style="height: ${heightPercent}%;">
            <span>${val}</span>
          </div>
          <span class="bar-index">${idx}</span>
        </div>
      `;
    });

    html += `</div>`;
    this.stage.innerHTML = html;

    // Optional audio tone for active element
    const activeIdx = Object.keys(states).find(k => states[k] === 'comparing' || states[k] === 'swapping');
    if (activeIdx !== undefined && window.soundSynth) {
      window.soundSynth.playTone(array[activeIdx]);
    }
  }

  // 2. Searching Visualizer (Numbered Cells with Search Pointers)
  renderSearching(step) {
    const { array, pointers = {}, states = {} } = step;

    let html = `<div class="search-container">`;

    array.forEach((val, idx) => {
      const stateClass = states[idx] ? ` ${states[idx]}` : '';

      const matchedPointers = Object.entries(pointers)
        .filter(([_, ptrIdx]) => ptrIdx === idx)
        .map(([name]) => name);

      let pointerTag = '';
      if (matchedPointers.length > 0) {
        pointerTag = `<div class="bar-pointer-tag" style="background: ${this._getPointerColor(matchedPointers[0])}">${matchedPointers.join(', ')}</div>`;
      }

      html += `
        <div class="search-cell-wrapper">
          ${pointerTag}
          <div class="search-cell${stateClass}">
            ${val}
          </div>
          <span class="bar-index">idx: ${idx}</span>
        </div>
      `;
    });

    html += `</div>`;
    this.stage.innerHTML = html;

    if (window.soundSynth) {
      if (pointers.found !== undefined || pointers.foundAt !== undefined) {
        window.soundSynth.playTone(800, 100, 1000, 0.2);
      } else if (pointers.mid !== undefined) {
        window.soundSynth.playTone(array[pointers.mid]);
      } else if (pointers.i !== undefined) {
        window.soundSynth.playTone(array[pointers.i]);
      }
    }
  }

  // 3. Data Structures Visualizer (Stack, Queue, Linked List)
  renderDataStructures(step) {
    if (step.dsType === 'stack') {
      let itemsHtml = '';
      step.items.forEach((item, idx) => {
        const isTop = idx === step.items.length - 1;
        itemsHtml += `
          <div class="stack-item">
            <span>[${idx}] Value: ${item}</span>
            ${isTop ? '<span style="font-size:0.75rem; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">TOP</span>' : ''}
          </div>
        `;
      });

      this.stage.innerHTML = `
        <div class="ds-container">
          <div class="stack-wrapper">
            <h4 style="margin-bottom: 8px; color: var(--accent-primary);">Stack Container</h4>
            <div class="stack-column">
              ${itemsHtml || '<div style="color:var(--text-muted); font-size:0.85rem; margin:auto;">(Stack is empty)</div>'}
            </div>
            <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-secondary);">
              Size: <strong>${step.items.length}</strong> | Top: <strong>${step.pointers.top >= 0 ? step.items[step.pointers.top] : 'None'}</strong>
            </div>
          </div>
        </div>
      `;
    } else if (step.dsType === 'queue') {
      let itemsHtml = '';
      step.items.forEach((item, idx) => {
        const isFront = idx === 0;
        const isRear = idx === step.items.length - 1;
        let badge = '';
        if (isFront && isRear) badge = 'F & R';
        else if (isFront) badge = 'FRONT';
        else if (isRear) badge = 'REAR';

        itemsHtml += `
          <div class="queue-item" style="position: relative;">
            <span>${item}</span>
            ${badge ? `<div style="position: absolute; top: -22px; font-size: 0.65rem; background: var(--accent-primary); padding: 2px 5px; border-radius: 4px; font-weight:700;">${badge}</div>` : ''}
          </div>
        `;
      });

      this.stage.innerHTML = `
        <div class="ds-container" style="flex-direction: column;">
          <h4 style="margin-bottom: 8px; color: var(--accent-secondary);">Queue Pipeline (FIFO: Out &larr; &larr; &larr; In)</h4>
          <div class="queue-wrapper">
            <div class="queue-tube">
              <span style="font-size: 0.75rem; color: var(--color-swapping); font-weight: 700; margin-right: 8px;">&larr; FRONT (Dequeue)</span>
              ${itemsHtml || '<span style="color:var(--text-muted); font-size:0.85rem; margin:auto;">(Queue is empty)</span>'}
              <span style="font-size: 0.75rem; color: var(--color-sorted); font-weight: 700; margin-left: 8px;">REAR (Enqueue) &larr;</span>
            </div>
            <div style="margin-top: 15px; font-size: 0.85rem; color: var(--text-secondary);">
              Queue Length: <strong>${step.items.length}</strong>
            </div>
          </div>
        </div>
      `;
    } else if (step.dsType === 'linkedList') {
      let nodesHtml = '';
      step.nodes.forEach((val, idx) => {
        const isHead = idx === 0;
        const isCur = step.pointers.current === idx;
        const borderStyle = isCur ? 'border-color: var(--color-comparing); box-shadow: 0 0 12px var(--color-comparing);' : '';

        nodesHtml += `
          <div style="display: flex; align-items: center;">
            <div class="ll-node" style="${borderStyle}">
              <div class="ll-node-val">${val}</div>
              <div class="ll-node-next">${idx < step.nodes.length - 1 ? '•' : 'null'}</div>
              ${isHead ? '<div style="position:absolute; top:-20px; left:0; font-size:0.65rem; background:var(--accent-primary); padding:1px 4px; border-radius:3px;">HEAD</div>' : ''}
              ${isCur ? '<div style="position:absolute; bottom:-20px; left:0; font-size:0.65rem; background:var(--color-comparing); color:#000; padding:1px 4px; border-radius:3px;">PTR</div>' : ''}
            </div>
            ${idx < step.nodes.length - 1 ? '<span class="ll-arrow">&rarr;</span>' : '<span style="color:var(--text-muted); margin-left:6px; font-family:var(--font-mono);">null</span>'}
          </div>
        `;
      });

      this.stage.innerHTML = `
        <div class="ds-container">
          <div class="ll-container">
            ${nodesHtml}
          </div>
        </div>
      `;
    }
  }

  // 4. Trees & Graphs Visualizer (SVG Canvas with Dynamic Highlight Lines)
  renderTreesAndGraphs(step) {
    const { nodes, edges, activeNodes = [], visitedNodes = [], queueState } = step;

    let svgEdges = '';
    edges.forEach(e => {
      const fromNode = nodes.find(n => n.id === e.from);
      const toNode = nodes.find(n => n.id === e.to);
      if (fromNode && toNode) {
        const isHighlight = visitedNodes.includes(e.from) && visitedNodes.includes(e.to);
        const edgeClass = isHighlight ? 'tg-edge highlighted' : 'tg-edge';
        svgEdges += `
          <line class="${edgeClass}" x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" />
        `;
      }
    });

    let svgNodes = '';
    nodes.forEach(n => {
      let nodeClass = 'tg-node';
      if (activeNodes.includes(n.id)) {
        nodeClass += ' active';
      } else if (visitedNodes.includes(n.id)) {
        nodeClass += ' visited';
      }

      svgNodes += `
        <g class="${nodeClass}">
          <circle cx="${n.x}" cy="${n.y}" r="22" />
          <text x="${n.x}" y="${n.y}">${n.val !== undefined ? n.val : n.id}</text>
        </g>
      `;
    });

    let queueBanner = '';
    if (queueState !== undefined) {
      queueBanner = `
        <div style="position: absolute; bottom: 12px; left: 16px; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--border-color);">
          <span style="color: var(--accent-secondary); font-weight:700;">BFS Queue:</span> [${queueState.join(', ') || 'empty'}]
        </div>
      `;
    }

    this.stage.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative;">
        <svg class="tree-graph-svg" viewBox="0 0 500 300">
          ${svgEdges}
          ${svgNodes}
        </svg>
        ${queueBanner}
      </div>
    `;
  }

  _getPointerColor(name) {
    switch (name.toLowerCase()) {
      case 'i':
      case 'front':
        return '#f59e0b';
      case 'j':
      case 'i+1':
      case 'rear':
        return '#ef4444';
      case 'pivot':
      case 'top':
        return '#8b5cf6';
      case 'mid':
        return '#06b6d4';
      case 'found':
      case 'foundat':
        return '#10b981';
      default:
        return '#6366f1';
    }
  }
}
