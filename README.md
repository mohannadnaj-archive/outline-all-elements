## Outline All Elements

A Chrome Extension that adds colored outlines to all page elements for CSS debugging.

### Usage:

- ![icon](/icon_16.png) Click the extension icon to activate/deactivate.
- **Keyboard Shortcut**: Press `Alt+Shift+O` (Windows/Linux) or `⌥ Option + ⇧ Shift + O` (Mac) to toggle outlines. This shortcut can be customized from `chrome://extensions/shortcuts`.
- Colors: Unique hue per element (`(elementOrder * 137.5) % 360`, 100% saturation)
- Nesting: Lightness varies by DOM depth (shallow=lighter, deep=darker)

### Technical details:

- Outlines all visible elements (width/height > 1px)
- 2px solid outlines with !important flag
- Elements tagged with data attributes for tracking
- MutationObserver tracks DOM changes

![screenshot](https://i.imgur.com/OUvjZdx.png)

### Credits:

- [Dalibor Gogic](https://github.com/daliborgogic)'s suggestion on [this gist by Addy Osmani](https://gist.github.com/addyosmani/fd3999ea7fce242756b1)
