	function MapTemplate(x, defParams)
	{
		this._defParams = defParams;
	};
	
	MapTemplate.prototype._start = {x:0};
	MapTemplate.prototype._end = {x:0, width:0};
	MapTemplate.prototype._defParams = {};
	MapTemplate.prototype.actors = [];
	
	MapTemplate.prototype.initActors = function(actors)
	{
		this.actors = actors;
		this._start = actors[0];
		this._end = actors[actors.length-1];
		for (var i = 0; i < actors.length; i++)
		{
			actors[i].template = this;
		}
	};
	
	MapTemplate.prototype.dispose = function()
	{
		for (var i = 0; i < this.actors.length; i++)
		{
			this.actors[i].dispose();
		}
	};
	
	MapTemplate.prototype.getStartX = function()
	{
		return this._start.x;
	};
	MapTemplate.prototype.getEndX = function()
	{
		return this._end.x+this._end.width;
	};
	
	MapTemplate.prototype.deactivate = function()
	{
		
	};
	
	/** Creates a new instance of the MapTemplate using the supplied x and the original defParams. NOTE: This is not an exact clone! This is to allow randomization*/
	MapTemplate.prototype.replicate = function(x)
	{
		throw new Error("Override replicate()!");
	};
	
	function FloorTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		
		var asset = defParams.asset;
		var floor;
		var actors = [];
		for (var i = 0; i < 2; i++)
		{
			floor = new Actor();
			floor.setImage(asset);
			floor.x = x;
			floor.y = defParams.yMax-asset.height;
			floor.z = 1;
			actors.push(floor);
			x += asset.width;
		}
		this.initActors(actors);
	};
	FloorTemplate.prototype = Object.create(MapTemplate.prototype);
	FloorTemplate.prototype.constructor = FloorTemplate;
	
	FloorTemplate.prototype.replicate = function(x)
	{
		return new FloorTemplate(x, this._defParams);
	};
	
	function WaterTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		
		var asset = defParams.asset;
		var water;
		var actors = [];
		for (var i = 0; i < 2; i++)
		{
			water = new MovingActor();
			water.setImage(asset);
			water.x = x;
			water.y = defParams.yMax-asset.height;
			water.z = 3;
			water.speedX = -600;
			actors.push(water);
			x += asset.width;
		}
		this.initActors(actors);
	};
	WaterTemplate.prototype = Object.create(MapTemplate.prototype);
	WaterTemplate.prototype.constructor = WaterTemplate;
	
	WaterTemplate.prototype.replicate = function(x)
	{
		return new WaterTemplate(x, this._defParams);
	};
	
	function FishTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		this.distance = Math.random()*3000;
		
		var asset = defParams.assets[Math.floor(Math.random()*defParams.assets.length)];
		var actor = new Fish(asset, (Math.random()*50)+50);
		actor.x = x;
		actor.y = defParams.yMax-(asset.height+defParams.offsetY);
		actor.z = 2;
		var dir = Math.random() > 0.5 ? 1 : -1;
		actor.scaleX = dir;
		actor.speedX = dir > 0 ? -100 : 50;
		
		this.initActors([actor]);
	};
	FishTemplate.prototype = Object.create(MapTemplate.prototype);
	FishTemplate.prototype.constructor = FishTemplate;
	
	FishTemplate.prototype.replicate = function(x)
	{
		return new FishTemplate(x, this._defParams);
	};
	
	FishTemplate.prototype.getEndX = function()
	{
		return MapTemplate.prototype.getEndX.call(this)+this.distance;
	};
	
	
	function MountainTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		this.distance = 0;
		
		var asset = defParams.asset;
		var actor;
		var actors = [];

		actor = new SpeedMatchingActor(defParams.player, defParams.factor, 0);
		actor.setImage(asset);
		actor.x = x;
		actor.y = defParams.yMax-(asset.height+defParams.offsetY);
		actor.z = -3;
		actors.push(actor);
		
		this.initActors(actors);
	};
	MountainTemplate.prototype = Object.create(MapTemplate.prototype);
	MountainTemplate.prototype.constructor = MountainTemplate;
	
	MountainTemplate.prototype.replicate = function(x)
	{
		return new MountainTemplate(x, this._defParams);
	};
	
	MountainTemplate.prototype.getEndX = function()
	{
		return MapTemplate.prototype.getEndX.call(this)+this.distance;
	};
	
	
	function RocksTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		this.distance = Math.random()*2000;
		
		var asset = defParams.asset;
		var actor;
		var actors = [];

		actor = new SpeedMatchingActor(defParams.player, defParams.factor, 0);
		actor.setImage(asset);
		actor.x = x;
		actor.y = defParams.yMax-(asset.height+defParams.offsetY);
		actor.z = -2;
		actors.push(actor);
		
		this.initActors(actors);
	};
	RocksTemplate.prototype = Object.create(MapTemplate.prototype);
	RocksTemplate.prototype.constructor = RocksTemplate;
	
	RocksTemplate.prototype.replicate = function(x)
	{
		return new RocksTemplate(x, this._defParams);
	};
	
	RocksTemplate.prototype.getEndX = function()
	{
		return MapTemplate.prototype.getEndX.call(this)+this.distance;
	};
	
	function CloudsTemplate(x, defParams)
	{
		MapTemplate.call(this, x, defParams);
		this.distance = Math.random()*2000;
		
		var lastImage = null;
		var image = null;
		
		var actor;
		var actors = [];
		var small = null;
		
		for (var i = 0; i < Math.floor(Math.random()*8)+2; i++) 
		{
			if(Math.random() > 0.3)
			{
				actor = new SpeedMatchingActor(defParams.player, 0.5, 0);
				actor.y = Math.random()*defParams.yMax;
				actor.z = -1;
				actor.speedX = -20;
			}
			else
			{
				actor = new SpeedMatchingActor(defParams.player, 0.75, 0);
				actor.y = Math.random()*defParams.yMax*0.5;
				actor.z = -2;
				actor.scaleX = 0.5;
				actor.scaleY = 0.5;
				actor.speedX = -10;
				small = actor;
			}
			actor.x = x;
			
			while(image == lastImage)
			{
				image = defParams.assets[Math.floor(Math.random()*defParams.assets.length)];
			}
			
			actor.setImage(image);
			lastImage = image;
			actors.push(actor);
			
			x+= Math.floor(Math.random()*10)*100;
		}
		
		this.initActors(actors);
		if (small != null) this._end = small;
	};
	CloudsTemplate.prototype = Object.create(MapTemplate.prototype);
	CloudsTemplate.prototype.constructor = CloudsTemplate;
	
	CloudsTemplate.prototype.replicate = function(x)
	{
		return new CloudsTemplate(x, this._defParams);
	};
	
	CloudsTemplate.prototype.getEndX = function()
	{
		return MapTemplate.prototype.getEndX.call(this) + this.distance;
	};
	
	function ObstacleTemplate(x, defParams, first)
	{
		if (first != null)
		{
			ObstacleTemplate.prototype.count = 0;
			ObstacleTemplate.prototype.lastPole = 0;
		}
		
		var passCount = defParams.getPasses();
		
		MapTemplate.call(this, x, defParams);
		this.distance = defParams.distance;
		
		var seed = Math.random();
		var allowEnemy = false;
		var allowEgg = false;
		var allowScrew = false;
		
		if (ObstacleTemplate.prototype.count != 0 && this.lastPole-ObstacleTemplate.prototype.count < 3)
		{
			if (seed < 0.3) allowEnemy = true;
			else if (seed > 0.7) allowScrew = true;
			
			if (ObstacleTemplate.prototype.count%2 == 1) allowEgg = true;
		}
		
		//new seed
		seed = Math.random();
		
		if (ObstacleTemplate.prototype.count < 10) allowEnemy = false;
		if (ObstacleTemplate.prototype.count < 20) allowScrew = false;
		
		var actors = [];
		if (allowEnemy)
		{
			var yMin = defParams.yMin+200;
			var yMax = defParams.yMax-(defParams.enemies[0].height+defParams.floorHeight);
			
			var enemy = null;
			if (seed < 0.3 && passCount > 2)
			{
				enemy = new Enemy(defParams.enemies[0], x-75, x+75, yMin, yMax);
				enemy.speedX = Math.random() > 0.5 ? -100 : 100;
				enemy.speedY = Math.random() > 0.5 ? -100 : 100;
			}
			else
			{
				enemy = new Enemy(defParams.enemies[1], x, x, yMin, yMax);
				enemy.speedY = Math.random() > 0.5 ? -75 : 75;
			}
			enemy.x = x;
			enemy.y = (Math.random()*(yMax-yMin))+yMin;
			actors.push(enemy);
		}
		else if (allowEgg)
		{
			var distrindex = Math.floor(ObstacleTemplate.prototype.count/10);
			if (distrindex >= this.eggDistribution.length) distrindex = this.eggDistribution.length-1;
			var positions = this.eggDistribution[distrindex];
			var eggPos = this.eggPositions[positions[Math.floor(Math.random()*positions.length)]];
			for (var i = 0; i < eggPos.length; i++)
			{
				var golden = Math.random() < (defParams.gold*0.3) + 0.05;
				var egg = golden ? new Egg(defParams.eggGold, defParams.eggGoldAnim, 3) : new Egg(defParams.egg, defParams.eggAnim, 1);
				var third = (defParams.yMax-500)/3;
				egg.x = x+(125*eggPos[i][0]);
				egg.y = third*(eggPos[i][1]+1);
				egg.z = 2;
				actors.push(egg);
			}
		}
		else
		{
			var yChoice = allowScrew ? [500, 400, 200, 100] : [600, 400, 200, 0];
			var choice = Math.floor(Math.random()*yChoice.length);//ObstacleTemplate.prototype.count%2;
			var up = Math.random() > 0.5;
			
			var stacle = allowScrew ? new ScrewObstacle(defParams.screwHead.base, defParams.screwHead.top, true, defParams.yMax, up) : new Obstacle(defParams.top);
			stacle.x = x;
			stacle.y = yChoice[choice]+defParams.size;
			if (allowScrew) stacle.y -= 300;
			else stacle.y -= stacle.height;
			stacle.startY = stacle.y;
			stacle.z = 1;
			actors.push(stacle);
			
			stacle = allowScrew ? new ScrewObstacle(defParams.screwHead.base, defParams.screwHead.bot, false, defParams.yMax, up) : new Obstacle(defParams.bot);
			stacle.x = x;
			if (allowScrew) stacle.y = (defParams.yMax-stacle.height)+yChoice[choice]+50;
			else stacle.y = (defParams.yMax-stacle.height)+yChoice[choice];
			stacle.startY = stacle.y;
			stacle.z = 0;
			stacle.passable = true;
			actors.push(stacle);
			
			ObstacleTemplate.prototype.lastPole = ObstacleTemplate.prototype.count + 1;
		}
		this.x = x;
		
		/*var egg = new Egg(defParams.egg);
		egg.x = x+(Math.ceil(Math.random()*3)*150)+250;
		var third = (defParams.yMax-500)/3;
		egg.y = Math.ceil(Math.random()*3)*third;
		egg.z = 2;
		actors.push(egg);*/
		
		ObstacleTemplate.prototype.count += 1;
		
		this.initActors(actors);
	};
	ObstacleTemplate.prototype = Object.create(MapTemplate.prototype);
	ObstacleTemplate.prototype.constructor = ObstacleTemplate;
	
	ObstacleTemplate.prototype.eggPositions = 
	[
	 	[      [1,0]     ],
	 	[      [1,1]     ],
	 	[      [1,2]     ],
	 	
	 	[[0,0],      [2,0]],
	 	[[0,1],      [2,1]],
	 	[[0,2],      [2,2]],
	 	
	 	[[0,0],      [2,0]
	 	,[0,2],      [2,2]],
	 	
	 	[[0,0],[1,1],[2,2]],
	 	[[0,2],[1,1],[2,0]],
	 	[[1,0],[1,1],[1,2]]
	];
	ObstacleTemplate.prototype.eggDistribution = 
	[
	 	[0,1,2],
	 	[0,1,2,3,4,5],
	 	[0,1,2,3,4,5,6,7,8,9],
	 	[3,4,5,6,7,8,9],
	 	[6,7,8,9]
	];
	
	ObstacleTemplate.prototype.x = 0;
	ObstacleTemplate.prototype.count = 0;
	ObstacleTemplate.prototype.lastPole = 0;
	ObstacleTemplate.prototype.distance = 0;
	ObstacleTemplate.prototype.replicate = function(x)
	{
		return new ObstacleTemplate(x, this._defParams);
	};
	ObstacleTemplate.prototype.getEndX = function()
	{
		return this.x+this.distance;
	};
	ObstacleTemplate.prototype.deactivate = function()
	{
		MapTemplate.prototype.deactivate.call(this);
		for (var i = 0; i < this.actors.length; i++)
		{
			this.actors[i].passable = false;
		}
	};
	