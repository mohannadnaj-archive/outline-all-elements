if (typeof window.outlineAllElementsState === "undefined") {
  window.outlineAllElementsState = {
    active: false,
    elementMap: new WeakMap(),
    styleSheetId: `outline-extension-styles-${Date.now()}`,
    observer: null,
    debounceTimer: null,
    needsStyleUpdate: false,
  };
}

window.outlineAllElementsState.active = !window.outlineAllElementsState.active;
console.log(
  `[Outline all elements Extension] State toggled to: ${
    window.outlineAllElementsState.active ? "active" : "inactive"
  }`
);

function getOrCreateStylesheet() {
  let styleSheet = document.getElementById(
    window.outlineAllElementsState.styleSheetId
  );
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = window.outlineAllElementsState.styleSheetId;
    document.head.appendChild(styleSheet);
  }
  return styleSheet;
}

function getElementDepth(element) {
  let depth = 0;
  let current = element;

  while (current.parentElement) {
    depth++;
    current = current.parentElement;
  }

  return depth;
}

function generateCssRules() {
  const rules = [];
  const elementsToStyle = document.querySelectorAll(
    "[data-outline-extension-id]"
  );

  elementsToStyle.forEach((element) => {
    const uniqueId = element.dataset.outlineExtensionId;
    if (uniqueId) {
      const hue = (parseInt(uniqueId, 10) * 137.5) % 360;
      const depth = getElementDepth(element);
      const lightness = Math.max(40, Math.min(70, 55 - depth * 2));
      rules.push(
        `[data-outline-extension-id="${uniqueId}"] { outline: 2px solid hsl(${hue}, 100%, ${lightness}%) !important; }`
      );
    }
  });
  return rules.join("\n");
}

function scheduleStylesheetUpdate() {
  window.outlineAllElementsState.needsStyleUpdate = true;

  if (window.outlineAllElementsState.debounceTimer) {
    clearTimeout(window.outlineAllElementsState.debounceTimer);
  }

  window.outlineAllElementsState.debounceTimer = setTimeout(() => {
    if (
      window.outlineAllElementsState.active &&
      window.outlineAllElementsState.needsStyleUpdate
    ) {
      const styleSheet = getOrCreateStylesheet();
      const cssRules = generateCssRules();
      styleSheet.textContent = cssRules;
      window.outlineAllElementsState.needsStyleUpdate = false;
    }
    window.outlineAllElementsState.debounceTimer = null;
  }, 100);
}

window.elementCounter = 0;

function trackElement(element) {
  if (!window.outlineAllElementsState.elementMap.has(element)) {
    const uniqueId = ++window.elementCounter;
    window.outlineAllElementsState.elementMap.set(element, uniqueId);
    element.dataset.outlineExtensionId = uniqueId.toString();
    return true;
  }
  return false;
}

function untrackElement(element) {
  if (element.dataset && element.dataset.outlineExtensionId) {
    delete element.dataset.outlineExtensionId;
    return true;
  }
  return false;
}

function elementNeedsUntracking(element) {
  if (element.dataset && element.dataset.outlineExtensionId) {
    return true;
  }
  if (element.querySelector) {
    return !!element.querySelector("[data-outline-extension-id]");
  }
  return false;
}

function setupMutationObserver() {
  if (window.outlineAllElementsState.observer) {
    return;
  }

  window.outlineAllElementsState.observer = new MutationObserver(
    (mutations) => {
      let changed = false;
      let addedNodesCount = 0;
      let removedNodesCount = 0;

      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const rect = node.getBoundingClientRect();
              if (
                rect.width > 1 &&
                rect.height > 1 &&
                node.id !== window.outlineAllElementsState.styleSheetId
              ) {
                if (trackElement(node)) {
                  changed = true;
                  addedNodesCount++;
                }
              }

              if (node.querySelectorAll) {
                node.querySelectorAll("*").forEach((child) => {
                  if (child.nodeType === Node.ELEMENT_NODE) {
                    const childRect = child.getBoundingClientRect();
                    if (
                      childRect.width > 1 &&
                      childRect.height > 1 &&
                      child.id !== window.outlineAllElementsState.styleSheetId
                    ) {
                      if (trackElement(child)) {
                        changed = true;
                        addedNodesCount++;
                      }
                    }
                  }
                });
              }
            }
          });
        }

        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              elementNeedsUntracking(node)
            ) {
              removedNodesCount++;
              changed = true;
            }
          });
        }
      });

      if (changed) {
        scheduleStylesheetUpdate();
      }
    }
  );

  window.outlineAllElementsState.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

function processAllElements() {
  const elements = Array.from(document.querySelectorAll("*")).filter((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.width > 1 &&
      rect.height > 1 &&
      el.id !== window.outlineAllElementsState.styleSheetId
    );
  });

  if (window.outlineAllElementsState.active) {
    window.elementCounter = 0;
    window.outlineAllElementsState.elementMap = new WeakMap();

    elements.forEach((element) => {
      trackElement(element);
    });

    const styleSheet = getOrCreateStylesheet();
    const cssRules = generateCssRules();
    styleSheet.textContent = cssRules;

    setupMutationObserver();
  } else {
    if (window.outlineAllElementsState.observer) {
      window.outlineAllElementsState.observer.disconnect();
      window.outlineAllElementsState.observer = null;
    }

    const styleSheet = document.getElementById(
      window.outlineAllElementsState.styleSheetId
    );
    if (styleSheet) {
      styleSheet.remove();
    }

    const potentiallyTracked = document.querySelectorAll(
      "[data-outline-extension-id]"
    );
    potentiallyTracked.forEach((element) => {
      untrackElement(element);
    });

    window.outlineAllElementsState.elementMap = new WeakMap();
    window.elementCounter = 0;

    if (window.outlineAllElementsState.debounceTimer) {
      clearTimeout(window.outlineAllElementsState.debounceTimer);
      window.outlineAllElementsState.debounceTimer = null;
    }
    window.outlineAllElementsState.needsStyleUpdate = false;
  }
}

requestAnimationFrame(processAllElements);
