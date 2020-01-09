## Outline All Elements

A Chrome Extension for adding CSS Outline property (with different colors) to all elements on the page.

Mainly this is useful for debugging CSS Layout and discovering potential issues.

Notes:

- ![icon](/icon_16.png) Click the extension icon for activating/deactivating.

- The outline colors are randomized based on it's order on the page.

- The colors are randomized by assigning different cumulative Hue degree and a fixed Saturation (99%) and Light (50%).

- On deactivating, the extension will restore the old `outline` value if it was there, and remove the `style` HTML attribute if it wasn't there before activating.

![screenshot](https://i.imgur.com/OUvjZdx.png)

Credits:

- [Dalibor Gogic](https://github.com/daliborgogic)'s suggestion on [this gist by Addy Osmani](https://gist.github.com/addyosmani/fd3999ea7fce242756b1)
