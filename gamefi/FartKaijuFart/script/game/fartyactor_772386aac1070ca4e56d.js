function Fish(asset, yVariance)
{
	this.maxCount = yVariance;
	this.setImage(asset);
	this.count = Math.random() > 0.5 ? 1 : -1;
}
Fish.prototype = Object.create(MovingActor.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.count = 1;
Fish.prototype.maxCount = 100;
Fish.prototype.step = function(dt)
{
	if (this.count > 0)
	{
		this.speedY = this.maxCount*0.5;
		this.count++;
		if (this.count > this.maxCount) this.count = -1;
	}
	else
	{
		this.speedY = this.maxCount*-0.5;
		this.count--;
		if (this.count < -this.maxCount) this.count = 1;
	}
	
	MovingActor.prototype.step.call(this, dt); //super.step(dt)
};

function Kaiju()
{
	MovingActor.call(this);
	
	this.dead = false;
	this.fallAnimsIndex = 0;
	this.recovering = false;
	this.magnetAlpha = 0;
	this.magnetDir = 1;
};
Kaiju.prototype = Object.create(MovingActor.prototype);
Kaiju.prototype.constructor = Kaiju;

Kaiju.prototype.gravity = 2100;
Kaiju.prototype.falling = false;
Kaiju.prototype.airborne = true;
Kaiju.prototype.fallAnimsIndex = 0;
Kaiju.prototype._hit = 0;
Kaiju.prototype.recovering = false;

Kaiju.prototype.showHelmet = false;
Kaiju.prototype.showBelt = false;
Kaiju.prototype.showMagnet = false;
Kaiju.prototype.magnetAlpha = 0;
Kaiju.prototype.magnetDir = 1;

Kaiju.prototype.dead = false;

Kaiju.prototype.setAnimations = function(anims)
{
	this.animMagnets = anims.magnetic;
	this.animBody = anims;
	this.animHelmet = anims.helmet;
	this.animBelt = anims.belt;
	this._helmetImage = this.animHelmet.idle;
	this._beltImage = this.animBelt.idle;
};

Kaiju.prototype.setHitArea = function(width, height)
{
	this.hitArea = new ActorBounds(20, 20, width-30, height-30);
};

Kaiju.prototype.step = function(dt)
{
	this.speedY += this.gravity*dt;

	this.recovering = this._hit > 0;
	
	if (this._invulnerability  > 0 && !this.dead) this._invulnerability -= dt;
	else if (this._behaviours.length > 0 || this.dead)
	{
		this.alpha = 1;
		this._behaviours.length = 0;
		this.invulnerable = false;
	}
	if (this.speedY > 0 && !this.recovering)
	{
		this.recovering = false;
		if (!this.falling)
		{
			this.falling = true;
			this.fallAnimsIndex++;
			if (this.fallAnimsIndex > this.animBody.fall.length-1) this.fallAnimsIndex = 0;
			
			this.setImage(this.animBody.fall[this.fallAnimsIndex]);
			this._helmetImage = this.animHelmet.fall[this.fallAnimsIndex];
			this._beltImage = this.animBelt.fall[this.fallAnimsIndex];
		}
		else if (this.speedY > 1500)
		{
			this.setImage(this.animBody.dive);
			this._helmetImage = this.animHelmet.dive;
			this._beltImage = this.animBelt.dive;
		}
	}
	else if (this.recovering && this.airborne)
	{
		this._hit -= dt;
		this.setImage(this.animBody.hit);
		this._helmetImage = this.animHelmet.hit;
		this._beltImage = this.animBelt.hit;
	}
	else
	{
		if (this.dead && !this.airborne)
		{
			this._hit = 0;
			this.setImage(this.animBody.dead);
			this._helmetImage = this.animHelmet.dead;
			this._beltImage = this.animBelt.dead;
		}
		else
		{
			if (this._dancing)
			{
				this._danceAnim.step(dt);
				this.setImage(this._danceAnim.frame);
			}
			else
			{
				this.setImage(this.animBody.idle);
				this._helmetImage = this.animHelmet.idle;
				this._beltImage = this.animBelt.idle;				
			}
		}
		this.falling = false;
	}
	if (this.showMagnet)
	{
		this.magnetAlpha += dt * this.magnetDir;
		if (this.magnetDir > 0 && this.magnetAlpha > 1)
		{
			this.magnetDir = -1;
			this.magnetAlpha = 1;
		}
		else if (this.magnetDir < 0 && this.magnetAlpha < 0)
		{
			this.magnetDir = 1;
			this.magnetAlpha = 0;
		}
	}
	MovingActor.prototype.step.call(this, dt);//super.step(dt)
};

Kaiju.prototype.hit = function(time)
{
	this._hit = time;
	this.recovering = true;
};

Kaiju.prototype.invulnerability = function(time)
{
	this._invulnerability = time;
	this._behaviours = [new BlinkBehaviour(this, 5, 0.5, 1)];
	this.invulnerable = true;
};

Kaiju.prototype.recover = function()
{
	this._hit = 0;
};

Kaiju.prototype.dance = function()
{
	//this._dancing = true;
	//this._danceAnim.reset();
};

Kaiju.prototype.draw = function(context)
{
	Actor.prototype.draw.call(this, context);
	
	context.save();
	context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
	if (this.showHelmet) context.drawImage(this._helmetImage, this.x, this.y);
	if (this.showBelt) context.drawImage(this._beltImage, this.x, this.y);
	if (this.showMagnet)
	{
		context.globalAlpha = this.magnetAlpha;
		context.drawImage(this.animMagnets[0], this.x-40, this.y-20);
		context.globalAlpha = 1-this.magnetAlpha;
		context.drawImage(this.animMagnets[1], this.x-40, this.y-20);
	}
	context.restore();
};


function Obstacle(image)
{
	Actor.call(this);
	this.passable = false;
	this.allowHit = true;
	this.setImage(image);
};
Obstacle.prototype = Object.create(Actor.prototype);
Obstacle.prototype.constructor = Obstacle;
Obstacle.prototype.passable = false;
Obstacle.prototype.allowHit = true;

function ScrewObstacle(base, heads, top, maxHeight, up)
{
	Actor.call(this);
	this.passable = false;
	this.allowHit = true;
	this._base = base;
	this._heads = new Anim(heads, 0.2, -1);
	this._top = top;
	this._up = up;
	this.height = this._heads.frame.height+this._base.height;
	this.width = this._heads.frame.width;
	this._maxHeight = maxHeight;
	
	this.hitArea = new ActorBounds(0, this._top ? -this.height + this._heads.frame.height : 0, this.width, this.height);
};
ScrewObstacle.prototype = Object.create(Obstacle.prototype);
ScrewObstacle.prototype.constructor = ScrewObstacle;

ScrewObstacle.prototype.startY = 0;
ScrewObstacle.prototype.c = 0;
ScrewObstacle.prototype.step = function(dt)
{
	this._heads.step(dt);
	if (this._up) this.y -= dt*50;
	else this.y += dt*50;
	
	if (this.y < this.startY) this._up = false;
	else if (this.y > this.startY + 220) this._up = true;
	
	Actor.prototype.step.call(this, dt); //super.step(dt)
};

ScrewObstacle.prototype.draw = function(context)
{
	context.save();
	context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
	if (this._top) context.drawImage(this._base, this.x+30, (this.y-this._base.height)+30);
	else context.drawImage(this._base, this.x+30, this.y+this._heads.frame.height-30);
	context.drawImage(this._heads.frame, this.x, this.y);
	context.restore();
};

ScrewObstacle.prototype.hitTest = function(actor)
{
	var tA = this.hitArea;
	var aA = actor.hitArea;
	return ((this.x+tA.x+tA.width) > (actor.x+aA.x)) && ((this.x+tA.x) < (actor.x+aA.x+aA.width)) && ((this.y+tA.y+tA.height) > (actor.y+aA.y)) && ((this.y+tA.y) < (actor.y+aA.y+aA.height));
};


function Egg(image, deadAnim, value)
{
	MovingActor.call(this);
	
	this.animDead = new Anim(deadAnim, 0.1, 0);
	
	this.collected = false;
	this.setImage(image);
	this.value = value;
};
Egg.prototype = Object.create(MovingActor.prototype);
Egg.prototype.constructor = Egg;
Egg.prototype.collected = false;
Egg.prototype.animDead = Anim.blueprint;

/*Egg.prototype.setHitArea = function(width, height)
{
	this.hitArea = new ActorBounds(-width*0.5, -height*0.5, width, height);
};*/

Egg.prototype.step = function(dt)
{
	if (this.collected)
	{
		if (this.animDead.dead) this.dispose();
		else
		{
			this.animDead.step(dt);
			this.setImage(this.animDead.frame);
		}
	}
	
	this.speedX *= Math.pow(0.012, dt);
	this.speedY *= Math.pow(0.012, dt);
	
	MovingActor.prototype.step.call(this, dt); //super.step(dt)
};

Egg.prototype.draw = function(context)
{
	context.save();
	context.globalAlpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
	context.scale(this.scaleX, this.scaleY);
	//context.drawImage(this._image, (this.x/this.scaleX)-(this.width*this.scaleX*0.5), (this.y/this.scaleY)-(this.height*this.scaleY*0.5));
	context.drawImage(this._image, this.x, this.y);
	context.restore();
};

Egg.prototype.collect = function()
{
	this.collected = true;
};


function Enemy(image, xMin, xMax, yMin, yMax)
{
	MovingActor.call(this);
	
	this.setImage(image);
	this.xMin = xMin;
	this.xMax = xMax;
	this.yMin = yMin;
	this.yMax = yMax;
	this.allowHit = true;
};
Enemy.prototype = Object.create(MovingActor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.xMin = 0;
Enemy.prototype.xMax = 0;
Enemy.prototype.yMin = 0;
Enemy.prototype.yMax = 0;
Enemy.prototype.allowHit = true;

Enemy.prototype.step = function(dt)
{
	if ((this.x < this.xMin && this.speedX < 0) || (this.x > this.xMax && this.speedX > 0)) this.speedX = -this.speedX;
	if ((this.y < this.yMin && this.speedY < 0) || (this.y > this.yMax && this.speedY > 0)) this.speedY = -this.speedY;
	
	MovingActor.prototype.step.call(this, dt);
};