function Behaviour(target)
{
	this.target = target;
}
Behaviour.prototype.target = null;

function BlinkBehaviour(target, speed, min, max)
{
	Behaviour.call(this, target);
	
	this.speed = speed;
	this.min = min;
	this.max = max;
}
BlinkBehaviour.prototype = Object.create(Behaviour.prototype);
BlinkBehaviour.prototype.constructor = BlinkBehaviour;

BlinkBehaviour.prototype._in = true;
BlinkBehaviour.prototype._alpha = 1;
BlinkBehaviour.prototype._speed = 10;
BlinkBehaviour.prototype._min = 0;
BlinkBehaviour.prototype._max = 1;

BlinkBehaviour.prototype.step = function(dt)
{
	if (this._in)
	{
		this._alpha += this.speed*dt;
		if (this._alpha > 1)
		{
			this._alpha = 1;
			this._in = false;
		}
	}
	else
	{
		this._alpha -= this.speed*dt;
		if (this._alpha < 0)
		{
			this._alpha = 0;
			this._in = true;
		}
	}
	this.target.alpha = this._alpha;
};