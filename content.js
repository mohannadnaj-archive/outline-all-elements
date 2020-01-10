var usageCounter = usageCounter || 0
var usageState = usageState || false
var oldOutlines = oldOutlines || {}

usageState = ! usageState

document.querySelectorAll('*').forEach(function (A,B) {
	if (usageState)
	{
		oldOutlines[B] = {hasAttribute: A.hasAttribute('style'), outline: A.style.outline}
		A.style.outline = `1px solid hsl(${B*B},99%,50%)`
	} else {

		if (oldOutlines[B] === undefined)
			return ;

		if (! oldOutlines[B].hasAttribute)
			A.removeAttribute('style')
		else if (oldOutlines[B].outline)
			A.style.outline = oldOutlines[B].outline
		else
			A.style.outline = 'none'
	}
})
