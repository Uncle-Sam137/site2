function Camera()
{
	this.arrived = false;
	this.x = 0;
	this._currentOffsetX = 0;
	this._targetOffsetX = 0;
}

Camera.prototype.x = 0;
Camera.prototype._target = {x:0};
Camera.prototype._currentOffsetX = 0;
Camera.prototype._targetOffsetX = 0;
Camera.prototype.arrived = false;
Camera.prototype.speed = 3;

Camera.prototype.setTarget = function(target, offsetX, instant)
{
	//console.log("setTarget", target.x, offsetX, instant);
	this._target = target;
	this._targetOffsetX = offsetX;	
	if (instant)
	{
		this._currentOffsetX = offsetX;
		this.x = this._target.x+this._currentOffsetX;
	}
	this.arrived = Math.abs(this._currentOffsetX - this._targetOffsetX) < 1;
};

Camera.prototype.step = function(dt)
{
	if (this._currentOffsetX != this._targetOffsetX)
	{
		//console.log(dt, this._currentOffsetX, this._targetOffsetX);
		var delta = (this._currentOffsetX-this._targetOffsetX)*dt*this.speed;
		delta += (delta > 0) ? 1 : -1;
		this._currentOffsetX -= delta;
		if (Math.abs(this._currentOffsetX - this._targetOffsetX) < 5) this._currentOffsetX = this._targetOffsetX;
	}
	this.arrived = Math.abs(this._currentOffsetX - this._targetOffsetX) < 1;
	this.x = this._target.x+this._currentOffsetX;
	//console.log("step", this.x, targetX, this.arrived);
	/*if (this._followTarget != null)
	{
		this.x = this._followTarget.x+this._followOffsetX;
		if (this.targetX != this._followOffsetX)
		{
			this.arrived = false;
			
			var lastX = this._followOffsetX;
			var camDelta = (this._followOffsetX-this.targetX)*dt*this.speed;
			if (camDelta > this.maxSpeed) camDelta = this.maxSpeed;
			else if (camDelta < -this.maxSpeed) camDelta = -this.maxSpeed;
			
			if (camDelta > 0) camDelta += 1;
			else camDelta -= 1;
			
			this._followOffsetX -= Math.floor(camDelta);
			if ((lastX > this.targetX && this._followOffsetX < this.targetX) || (lastX < this.targetX && this._followOffsetX > this.targetX)) this._followOffsetX = this.targetX;
		}
		else this.arrived = true;
		//console.log(this._followOffsetX, this.targetX);
	}
	else
	{
		if (this.targetX != this.x)
		{
			this.arrived = false;
			var camDelta = Math.floor((this.x-this.targetX)*dt*speed);
			if (camDelta == 0) camDelta = this.x > this.targetX ? 1 : -1;
			this.x -= camDelta;
		}
		else this.arrived = true;
	}*/
};