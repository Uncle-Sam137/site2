function ActorBounds(x, y, width, height)
{
	this.x = x == null ? 0 : x;
	this.y = y == null ? 0 : y;
	this.width = width == null ? 0 : width;
	this.height = height == null ? 0 : height;
};
ActorBounds.prototype.x = 0;
ActorBounds.prototype.y = 0;
ActorBounds.prototype.width = 0;
ActorBounds.prototype.height = 0;



function Actor(name)
{
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.alpha = 1;
	this.width = 0;
	this.height = 0;
	this.cX = 0;
	this.cY = 0;
	this.disposed = false;
	this.scaleX = 1;
	this.scaleY = 1;
	this._behaviours = [];
};

Actor.prototype.x = 0;
Actor.prototype.y = 0;
Actor.prototype.z = 0;
Actor.prototype.cX = 0;
Actor.prototype.cY = 0;
Actor.prototype.width = 0;
Actor.prototype.height = 0;
Actor.prototype.disposed = false;
Actor.prototype.scaleX = 1;
Actor.prototype.scaleY = 1;
Actor.prototype._behaviours = [];

Actor.prototype.hitArea = new ActorBounds();

Actor.prototype.alpha = 1;
Actor.prototype._image = new Image();

Actor.prototype.setImage = function(image)
{
	if (this._image != image)
	{
		this._image = image;
		this.width = this._image.width;
		this.height = this._image.height;
		this.setHitArea(this.width, this.height);
		this.cX = this.x + (this.width*0.5);
		this.cY = this.y + (this.height*0.5);
	}
};

Actor.prototype.setHitArea = function(width, height)
{
	this.hitArea = new ActorBounds(0, 0, width, height);
};

Actor.prototype.step = function(dt)
{
	this.cX = this.x + (this.width*0.5);
	this.cY = this.y + (this.height*0.5);
	
	for (var i = 0; i < this._behaviours.length; i++)
	{
		this._behaviours[i].step(dt);
	}
};

Actor.prototype.draw = function(context)
{
	if (this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0)
	{
		context.save();
		context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
		if (this.scaleX != 1 || this.scaleY != 1)
		{
			context.translate(this.x-(this.width*this.scaleX*0.5), this.y-(this.height*this.scaleY*0.5));
			context.scale(this.scaleX, this.scaleY);
			context.translate(this.width*this.scaleX*0.5, this.height*this.scaleY*0.5);
			context.drawImage(this._image, 0, 0);
		}
		else context.drawImage(this._image, this.x, this.y);
		context.restore();
	}
};

Actor.prototype.hitTest = function(actor)
{
	var tA = this.hitArea;
	var aA = actor.hitArea;
	return ((this.x+tA.x+tA.width) > (actor.x+aA.x)) && ((this.x+tA.x) < (actor.x+aA.x+aA.width)) && ((this.y+tA.y+tA.height) > (actor.y+aA.y)) && ((this.y+tA.y) < (actor.y+aA.y+aA.height));
};

/** y is optional, when omitted it only returns the horizontal distance */
Actor.prototype.distance = function(x,y)
{
	if (y == null) return Math.abs(this.cX-x);
	else
	{
		var a = this.cX-x;
		var b = this.cY-y;
		return Math.sqrt((a*a)+(b*b));
	}
};

Actor.prototype.dispose = function()
{
	this.disposed = true;
};



function MovingActor()
{
	Actor.call(this);
	
	this.speedX = 0;
	this.speedY = 0;
};
MovingActor.prototype = Object.create(Actor.prototype);
MovingActor.prototype.constructor = MovingActor;

MovingActor.speedX = 0;
MovingActor.speedY = 0;

MovingActor.prototype.step = function(dt)
{
	this.x += this.speedX*dt;
	this.y += this.speedY*dt;
	
	Actor.prototype.step.call(this, dt);//super.step(dt)
};


function Particle(frames, delay, repeat, centerX, centerY, z)
{
	MovingActor.call(this);
	
	this.z = z;
	this.anim = new Anim(frames, delay, repeat);
	this.setImage(this.anim.frame);
	
	if (centerX != null) this.x = centerX-(this._image.width*0.5);
	if (centerY != null) this.y = centerY-(this._image.height*0.5);
}
Particle.prototype = Object.create(MovingActor.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.anim = new Anim([]);

Particle.prototype.step = function(dt)
{
	if (this.anim.dead) this.dispose();
	else
	{
		this.anim.step(dt);
		this.setImage(this.anim.frame);
		
		MovingActor.prototype.step.call(this, dt); //super.step(dt)
	}
};



function SpeedMatchingActor(relativeToActor, factorX, factorY)
{
	MovingActor.call(this);
	
	this.factorX = factorX;
	this.factorY = factorY;
	this.relativeActor = relativeToActor;
}
SpeedMatchingActor.prototype = Object.create(MovingActor.prototype);
SpeedMatchingActor.prototype.constructor = SpeedMatchingActor;

SpeedMatchingActor.prototype.relativeActor = new Actor("paralaxTemplate");
SpeedMatchingActor.prototype.factorX = 0;
SpeedMatchingActor.prototype.factorY = 0;

SpeedMatchingActor.prototype.step = function(dt)
{
	this.x += ((this.relativeActor.speedX*this.factorX)+this.speedX)*dt;
	this.y += ((this.relativeActor.speedY*this.factorY)+this.speedY)*dt;
	
	//MovingActor.step() is intentionally omitted by Actor.step()!
	Actor.prototype.step.call(this, dt); //super.step(dt)
};
