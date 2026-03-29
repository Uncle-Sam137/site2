/** frames = Array[Image] */
function Anim(frames, delay, repeat)
{
	this.frames = frames;
	this.delay = delay;
	this.time = 0;
	this.frame = frames[0];
	this.frameCount = frames.length;
	this.frameIndex = 0;
	this.dead = false;
	
	this.repeat = repeat == null ? -1 : repeat;
	this._baseRepeat = this.repeat;
};
Anim.prototype.delay = 1;
Anim.prototype.time = 0;
Anim.prototype.frames = [];
Anim.prototype.frame = new Image();
Anim.prototype.frameCount = 0;
Anim.prototype.frameIndex = 0;
Anim.prototype.repeat = 0;
Anim.prototype._baseRepeat = 0;
Anim.prototype.dead = false;
Anim.blueprint = new Anim([null], 0, 0);

Anim.prototype.step = function(dt)
{
	if (this.time > this.delay)
	{
		this.frameIndex += 1;
		this.time = 0;
		if (this.frameIndex >= this.frameCount)
		{
			if (this.repeat == -1) this.frameIndex = 0;
			else if (this.repeat > 0)
			{
				--this.repeat;
				this.frameIndex = 0;
			}
			else
			{
				this.dead = true;
				this.frameIndex = this.frameCount-1;
			}
		}
		this.frame = this.frames[this.frameIndex];
	}
	else
	{
		this.time += dt;
	}
};

Anim.prototype.reset = function()
{
	console.log(this.frames);
	this.frameIndex = 0;
	this.frame = this.frames[this.frameIndex];
	this.dead = false;
	this.time = 0;
	this.repeat = this._baseRepeat;
};