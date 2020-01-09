// content.js
var usageState = false
var oldOutlines = {}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
		usageState = ! usageState

		document.querySelectorAll('*').forEach(function (A,B) {

			if (usageState)
			{
				oldOutlines[B] = {hasAttribute: A.hasAttribute('style'), outline: A.style.outline}
				A.style.outline = `1px solid hsl(${B*B},99%,50%)`
			} else {
				if (oldOutlines[B] === undefined || !oldOutlines[B].hasAttribute)
					A.removeAttribute('style')
				else if (oldOutlines[B] !== undefined)
					A.style.outline = oldOutlines[B].outline
				else
					A.style.outline = 'none'
			}
		})
    }
  }
);