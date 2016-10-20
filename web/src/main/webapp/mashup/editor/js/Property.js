/**
 * $Id: Sidebar.js,v 1.67 2012-07-19 19:09:23 gaudenz Exp $
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */
function Property(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
         span = document.createElement('span');
         span.innerHTML = "Hello Property page";
         this.container.appendChild(span);
};
