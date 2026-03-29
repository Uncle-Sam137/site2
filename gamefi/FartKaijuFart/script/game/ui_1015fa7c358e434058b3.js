function Element(name)
{
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.alpha = 1;
	this.width = 0;
	this.height = 0;
	this.disposed = false;
	this.visible = true;
	this.verPct = null;
	this.horPct = null;
	this.leftPct = null;
	this.rightPct = null;
	this.topPct = null;
	this.botPct = null;
	this.ver = null;
	this.hor = null;
	this.left = null;
	this.right = null;
	this.top = null;
	this.baseWidth = 0;
	this.baseHeight = 0;
	this.buttonMode = false;
	
	/*var signals = UI.prototype.signals;
	this.signals = {};
	for ( var key in signals)
	{
		this.signals[key] = signals[key];
	}*/
	this.signals = {onUpdate:function() {}, onTap:function() {}, onMouseMove:function(){}};
};

Element.prototype.verPct = null;
Element.prototype.horPct = null;
Element.prototype.leftPct = null;
Element.prototype.rightPct = null;
Element.prototype.topPct = null;
Element.prototype.botPct = null;
Element.prototype.ver = null;
Element.prototype.hor = null;
Element.prototype.left = null;
Element.prototype.right = null;
Element.prototype.top = null;
Element.prototype.bot = null;
Element.prototype.x = 0;
Element.prototype.y = 0;
Element.prototype.scaleX = 0;
Element.prototype.scaleY = 0;
Element.prototype.alpha = 1;
Element.prototype.blink = false;
Element.prototype._blinkIn = false;
Element.prototype.disposed = false;
Element.prototype.visible = true;
Element.prototype.buttonMode = false;
Element.prototype._image = new Image();
Element.prototype.signals = {onUpdate:function(){}, onTap:function(){}, onMouseMove:function(){}};

Element.prototype.setImage = function(image)
{
	if (this._image != image)
	{
		this._image = image;
		this.baseWidth = this._image.width;
		this.baseHeight = this._image.height;
		this.width = this.baseWidth*this.scaleX;
		this.height = this.baseHeight*this.scaleY;
	}
};

Element.prototype.step = function(dt)
{
	/*if (this.blink)
	{
		if (this._blinkIn) this.alpha += 2*dt;
		else this.alpha -= 2*dt;
		if (this.alpha <= 0 || this.alpha >= 1) this._blinkIn = !this._blinkIn;
	}
	else this.alpha = 1;*/
	//TODO behaviours
};

Element.prototype.draw = function(context)
{
	if (this.visible)
	{
		this.width = this.baseWidth*this.scaleX;
		this.height = this.baseHeight*this.scaleY;
		
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.scaleX, this.scaleY);
		context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
		context.drawImage(this._image, 0,0);
		context.restore();
		
		/*context.save();
		context.fillStyle = "rgb(0,0,255)";
		context.globalAlpha = 0.3;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();*/
	}
};

Element.prototype.update = function(screenWidth, screenHeight)
{
	this.width = this.baseWidth*this.scaleX;
	this.height = this.baseHeight*this.scaleY;
	this.signals.onUpdate.call(this);
	
	if (this.horPct != null)
	{
		this.x = Math.round(((screenWidth*0.5)-(this.width*0.5))+(screenWidth*this.horPct));
	}
	if (this.verPct != null)
	{
		this.y = Math.round(((screenHeight*0.5)-(this.height*0.5))+(screenHeight*this.verPct));
	}
	if (this.leftPct != null)
	{
		this.x = (-this.width)+(screenWidth*this.leftPct);
	}
	if (this.rightPct != null)
	{
		this.x = (screenWidth)-(screenWidth*this.rightPct);
	}
	if (this.topPct != null)
	{
		this.y = screenHeight*this.topPct;
	}
	if (this.botPct != null)
	{
		this.y = screenHeight-(this.height+(screenHeight*this.topPct));
	}
	
	if (this.hor != null)
	{
		this.x = ((screenWidth*0.5)-(this.width*0.5))+(this.hor);
	}
	if (this.ver != null)
	{
		this.y = ((screenHeight*0.5)-(this.height*0.5))+(this.ver);
	}
	
	if (this.top != null)
	{
		this.y = this.top;
	}
	if (this.bot != null)
	{
		this.y = (screenHeight-this.height)-this.bot;
	}
	if (this.left != null)
	{
		this.x = this.left;
	}
	if (this.right != null)
	{
		this.x = screenWidth-(this.width+this.right);
	}
};

Element.prototype.inside = function(x,y)
{
	return x > this.x && y > this.y && x < (this.x+this.width) && y < (this.y+this.height);
};

Element.prototype.handleTap = function(x,y)
{
	if (this.visible && x > 0 && y > 0 && x < this.width && y < this.height) this.signals.onTap.call(this, x, y);
};

Element.prototype.handleMouseMove = function(x,y)
{
	if (this.visible && x > 0 && y > 0 && x < this.width && y < this.height)
	{
		this.signals.onMouseMove.call(this, x, y);
		if (this.buttonMode) document.body.style.cursor = 'pointer';
	}
};

function LabelFormat(font, fontSize, bold, italic, color, strokeWidth, strokeColor, align)
{
	this.font = font;
	this.size = fontSize;
	this.bold = bold;
	this.italic = italic;
	this.align = align == null ? 'left' : align;
	this.lineSpace = this.size*0.2;
	
	this.strokeWidth = strokeWidth == null ? 0 : strokeWidth;
	this.strokeColor = strokeColor == null ? "#FFFFFF" : strokeColor;
	this.color = color == null ? "#FFFFFF" : color;
}


function Label(name, format)
{
	this.format = format;
	Element.call(this, name);
}
Label.prototype = Object.create(Element.prototype);
Label.prototype.constructor = Label;
Label.prototype.text = "";

Label.prototype.draw = function(context)
{
	if (this.visible)
	{
		var size = Math.ceil(this.format.size*this.scaleX);
		
		context.save();
		context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
		context.font = (this.format.bold ? "bold " : " ") + (this.format.italic ? "italic " : "") + size + 'pt '+this.format.font;
		context.textAlign = this.format.align;
		context.fillStyle = this.format.color;
		
		var lineHeight = Math.ceil(this.format.lineSpace*this.scaleX) + size;
		var x = 0;
		var width = 0;
		var bestWidth = 0;
		var labels = this.text.toString().split("\n");
		for (var i = 0; i < labels.length; i++)
		{
			width = context.measureText(labels[i]).width;
			if (width > bestWidth) bestWidth = width;
		}
		if (this.format.align == 'center') x = bestWidth*0.5;
		
		for (i = 0; i < labels.length; i++)
		{
			if (this.format.strokeWidth > 0)
			{
				context.strokeStyle = this.format.strokeColor;
				context.lineCap = 'round';
				context.lineJoin = 'round';
				context.lineWidth = this.format.strokeWidth*this.scaleX;
				context.strokeText(labels[i], this.x+x, this.y+lineHeight+(i*lineHeight));
			}
			context.fillText(labels[i], this.x+x, this.y+lineHeight+(i*lineHeight));
		}
		
		this.height = lineHeight * labels.length;
		this.width = bestWidth;
		this.baseWidth = this.width;
		this.baseHeight = this.height;
		
		context.restore();
		
		/*context.save();
		context.fillStyle = "rgb(0,0,255)";
		context.globalAlpha = 0.3;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();*/
	}
};

Label.prototype.step = function(dt)
{
	Element.prototype.step.call(this, dt);
};

Label.prototype.update = function(width, height)
{
	var scaleX = this.scaleX;
	var scaleY = this.scaleY;
	this.scaleX = 1;
	this.scaleY = 1;
	Element.prototype.update.call(this, width, height);
	this.scaleX = scaleX;
	this.scaleY = scaleY;
};



function ElementGroup(name, width, height)
{
	Element.call(this, name);
	this.elements = [];
	this.elementByName = {};
	this.width = width;
	this.height = height;
	this.baseWidth = width;
	this.baseHeight = height;
	this._image = null;
}
ElementGroup.prototype = Object.create(Element.prototype);
ElementGroup.prototype.constructor = ElementGroup;
ElementGroup.prototype.elements = [];
ElementGroup.prototype.elementByName = {};
ElementGroup.prototype.width = null;
ElementGroup.prototype.height = null;

ElementGroup.prototype.addElement = function(element)
{
	if (this.elementByName[element.name] == null)
	{
		this.elements.push(element);
	}
};

ElementGroup.prototype.removeElement = function(element)
{
	for (var i = 0; i < this.elements.length; i++)
	{
		if (this.elements[i] == element)
		{
			this.elements.splice(i,1);
			delete this.elementByName[element.name];
			return;
		}
	}
};

ElementGroup.prototype.getElementByName = function(name)
{
	return this.elementByName[name];
};

ElementGroup.prototype.draw = function(context)
{
	if (this.visible)
	{
		this.width = this.baseWidth*this.scaleX;
		this.height = this.baseHeight*this.scaleY;
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.scaleX, this.scaleY);
		context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
		for (var i = 0; i < this.elements.length; i++)
		{
			this.elements[i].draw(context);
		}
		context.restore();
		
		/*context.save();
		context.fillStyle = "rgb(0,0,255)";
		context.globalAlpha = 0.3;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();*/
	}
};

ElementGroup.prototype.step = function(dt)
{
	for (var i = 0; i < this.elements.length; i++)
	{
		this.elements[i].step(dt);
	}
	Element.prototype.step.call(this, dt);
};

ElementGroup.prototype.update = function(screenWidth, screenHeight)
{
	this.width = this.baseWidth*this.scaleX;
	this.height = this.baseHeight*this.scaleY;
	Element.prototype.update.call(this, screenWidth, screenHeight);
	
	var width = this.baseWidth == null ? screenWidth : this.baseWidth;
	var height = this.baseHeight == null ? screenHeight : this.baseHeight;
	for (var i = 0; i < this.elements.length; i++)
	{
		this.elements[i].update(width, height);
	}
};

ElementGroup.prototype.handleTap = function(x,y)
{
	Element.prototype.handleTap.call(this, x,y);
	var element;
	for (var i = 0; i < this.elements.length; i++)
	{
		element = this.elements[i];
		element.handleTap((x/this.scaleX)-element.x, (y/this.scaleY)-element.y);
	}
};

ElementGroup.prototype.handleMouseMove = function(x,y)
{
	Element.prototype.handleMouseMove.call(this, x,y);
	var element;
	for (var i = 0; i < this.elements.length; i++)
	{
		element = this.elements[i];
		element.handleMouseMove((x/this.scaleX)-element.x, (y/this.scaleY)-element.y);
	}
};



function Button(name, image, format)
{
	Element.call(this, name);
	this.buttonMode = true;
	this.label = new Label(name+"label", format);
	this.setImage(image);
}

Button.prototype = Object.create(Element.prototype);
Button.prototype.constructor = Button;

Button.prototype.text = "";

Button.prototype.draw = function(context)
{
	if (this.visible)
	{
		this.width = this.baseWidth*this.scaleX;
		this.height = this.baseHeight*this.scaleY;
		
		Element.prototype.draw.call(this, context);
		
		this.label.scaleX = this.scaleX;
		this.label.scaleY = this.scaleY;
		this.label.x = this.x + (this.width*0.5) - (this.label.width*0.5);
		this.label.y = this.y + (this.height*0.5) - (this.label.height*0.5);
		this.label.text = this.text;
		this.label.draw(context);
	}
};

Button.prototype.step = function(dt)
{
	Element.prototype.step.call(this, dt);
};


function Quad(name, color, width, height)
{
	Element.call(this, name);
	this.width = width;
	this.height = height;
	this.baseWidth = width;
	this.baseHeight = height;
	this.color = color;
}

Quad.prototype = Object.create(Element.prototype);
Quad.prototype.constructor = Quad;

Quad.prototype.draw = function(context)
{
	if (this.visible)
	{
		//this.width = this.baseWidth*this.scaleX;
		//this.height = this.baseHeight*this.scaleY;
		
		context.save();
		context.fillStyle = "rgb(0,0,0)";//this.color;
		context.globalAlpha = this.alpha;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();
	}
};

function RepeatingImage(name, image)
{
	this.image = image;
	this.minWidth = 0;
}

RepeatingImage.prototype = Object.create(Element.prototype);
RepeatingImage.prototype.constructor = RepeatingImage;

RepeatingImage.prototype.minWidth = 0;

RepeatingImage.prototype.draw = function(context)
{
	if (this.visible)
	{
		var iWidth = this.image.width;
		var count = Math.ceil(this.minWidth/iWidth);
		
		this.baseWidth = count*iWidth;
		this.baseHeight = this.image.height;
		this.width = this.baseWidth*this.scaleX;
		this.height = this.baseHeight*this.scaleY;
		
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.scaleX, this.scaleY);
		context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
		for (var i = 0; i < count; i++)
		{
			context.drawImage(this.image, i*iWidth,0);
		}
		context.restore();
	}
};
