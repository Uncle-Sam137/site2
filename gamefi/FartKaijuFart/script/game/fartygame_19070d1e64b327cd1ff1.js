"use strict";

(function()
{
	var ready = false;
	var g = null;
	var gm = null;
	tortilla.game =
	{
		init:function()
		{
			gm = new Game(g);
			g = new GameLoader(function()
			{
				if (ready) gm.init(g);
				else ready = true;
			}, function()
			{
				g = gm;
				g.start();
			});
		},
		frame:function(dt)
		{
			g.frame(dt);
		},
		settings:function()
		{
			return {showFps: false};
		}
	};


	var spil = null;
	function updateMute()
	{
		if (tortilla.isVisible() && (spil == null || !spil.inAd)) Howler.unmute();
	    else Howler.mute();
	};

	tortilla.addEventListener("visibilityChanged", function(visible)
	{
		updateMute();
	});
	console.log(tortilla.MANIFEST);
	if (true)//tortilla.parameters.has("spil"))
	{
    	spil =
    	{
    		logoImage: null,
    		logoAction: function() { GameAPI.Branding.getLogo().action(); },
    		api: null,
    		showAd: function() {},
    		inAd: false
    	};
    	console.log("Spil Games edition");
    	tortilla.loadScript("game.js", function(success, error)
    	{
			if (success)
			{
				console.log("Spil game.js loaded");
				GameAPI.loadAPI (function(api)
				{
					console.log("GameAPI loaded", api);
					spil.api = api;

					/*var logoData = api.Branding.getLogo();
					if (!logoData || logoData.hasOwnProperty("error"))
					{
						console.log("No logo");
					}
					else
					{
						spil.logoAction = logoData.action;
	    				var image = new Image();
	    				image.addEventListener("load", function()
	    				{
	    					spil.logoImage = image;
						});
	    				image.src = logoData.image;
					}*/

					spil.showAd = function()
					{
						api.GameBreak.request(function()
						{
							spil.inAd = true;
							updateMute();
						},
						function()
						{
							spil.inAd = false;
							updateMute();
						});
					};

					if (ready) gm.init(g);
					else ready = true;
				});
			}
			else
			{
				console.log("Error loading Spil game.js", error);
				if (ready) gm.init(g);
				else ready = true;
			}
		});
	}
	else
	{
		if (ready) gm.init(g);
		else ready = true;
	}


	console.log("START!!!!!!!!!!");
	//var GAME_WIDTH = 1920*2;
	var GAME_HEIGHT = 800*2;
	var STARTX = 300;
	var CAMERAX = 150;



	var CAMOFFSET = 10;
	var STARTY = 500;

	function dist(aX,aY,bX,bY)
	{
		var xD = aX - bX;
		var yD = aY - bY;
		return Math.sqrt((xD*xD) + (yD*yD));
	}

	function randomizeList(source)
	{
		var list = source.slice();
		var randomized = [];
		var i = list.length;
		while(--i > -1)
		{
			randomized.push(list.splice(Math.floor(Math.random()*list.length),1)[0]);
		}
		return randomized;
	}

	function randomFromList(source)
	{
		return source[Math.floor(Math.random()*source.length)];
	}

	function Item(name, level, max, enabled, cost)
	{
		this.name = name;
		this.level = level;
		this.max = max;
		this.enabled = enabled;
		this.cost = cost;
	}

	/** accepts {en_GB:"your %0% label", nl_NL:"jouw %0% label"}. The first key is the default label,
	 * meaning if no localized version is present this will be used.
	 * %0% is replaced by whatever arguments are provided to Lang.get(). **/
	function Lang(labels)
	{
		this.labels = labels;
		this.defautlLabel = null;
		for (var key in labels)
		{
			this.defautlLabel = labels[key];
			break;
		}
	}
	Lang.prototype.get = function()
	{
		var label = this.labels[LOCALE];
		if (label == null) label = this.defautlLabel;
		if (arguments != null)
		{
			for (var i = 0; i < arguments.length; i++)
			{
				label = label.replace("%"+i+"%", arguments[i]);
			}
		}
		return label;
	};

	function Screen(name)
	{
		this.name = name;
		this.elements = [];
	}
	var SCREEN_SHOP = new Screen("shop");
	var SCREEN_GAME = new Screen("game");
	var SCREEN_START = new Screen("start");
	var TOUCHDEVICE = false;
	var FONT = "dimboregular";
	var EMPTY = null;
	var LOCALE = tortilla.parameters.get("language", "en_GB");


	function GameLoader(onReady, onLoaded)
	{
		this.onReady = onReady;
		this.onLoaded = onLoaded;
		EMPTY = this.loadImage("assets/empty.png");
		spil.logoImage = this.loadImage("assets/brandlogo.png");
		this.bg = this.loadImage("assets/bg.jpg");
		this.barbg = this.loadImage("assets/pixelkaiju-loadingbar.png");
		this.bar = this.loadImage("assets/pixelkaiju-loadingbar-vulling.png");
		var ass = [this.loadImage("assets/pixelkaiju-dance-ass1.png"), this.loadImage("assets/pixelkaiju-dance-ass2.png"), this.loadImage("assets/pixelkaiju-dance-ass3.png")];
		var left = this.loadImage("assets/pixelkaiju-dance-left1.png");
		var right = this.loadImage("assets/pixelkaiju-dance-right1.png");
		this.dance = [right,right,right,ass[0],left,left,left,ass[2],ass[1],ass[1],ass[1],ass[2],ass[0],ass[2],ass[2]];
		this.danceIndex = 0;
		this.canvas = tortilla.canvas;
		this.context = tortilla.context;
	}
	GameLoader.prototype.total = 0;
	GameLoader.prototype.ready = false;
	GameLoader.prototype.assetsToLoad = 0;
	GameLoader.prototype.transform = new Transform();
	GameLoader.prototype.onLoaded = function() {};
	GameLoader.prototype.onReady = function() {};
	GameLoader.prototype.frame = function(dt)
	{
		if (this.ready)
		{
			this.context.save();
			this.transform.reset();

			var scale = this.canvas.height/GAME_HEIGHT;
			var width = this.canvas.width/scale;

			this.transform.scale(scale, scale);
			this.transform.applyToContext(this.context);

			this.context.save();
			this.context.scale(this.canvas.width/scale,GAME_HEIGHT/this.bg.height);
			this.context.drawImage(this.bg, 0, 0);
			this.context.restore();

			var x = (width*0.5)-(this.barbg.width*0.5);
			var y = GAME_HEIGHT*0.5;
			var p = 1-(this.assetsToLoad/this.total);

			this.context.drawImage(this.barbg, x, y);
			this.context.drawImage(this.bar, 0, 0, this.bar.width*p, this.bar.height, x, y, this.bar.width*p, this.bar.height);

			this.danceIndex += dt*7;
			if (this.danceIndex >= this.dance.length) this.danceIndex = 0;
			var dance = this.dance[Math.floor(this.danceIndex)];
			this.context.drawImage(dance, x-5, y-(dance.height+10));

			this.context.font = '88pt '+FONT;
			this.context.textAlign = 'right';
			this.context.fillStyle = '#43bfe5';
			this.context.strokeStyle = "#052f3d";
			this.context.lineCap = 'round';
			this.context.lineJoin = 'round';
			this.context.lineWidth = 14;

			x += this.barbg.width-5;
			y -= 25;
			this.context.strokeText("LOADING", x, y);
			this.context.fillText("LOADING", x, y);

			if (spil != null && spil.logoImage != null) this.context.drawImage(spil.logoImage, width-spil.logoImage.width-5, GAME_HEIGHT-spil.logoImage.height-10);

			this.context.restore();
		}
	};
	GameLoader.prototype.handleAssetLoaded = function(url)
	{
		--this.assetsToLoad;
		//console.log(this.assetsToLoad, url);
		if (this.assetsToLoad == 0)
		{
			if (this.ready) this.onLoaded();
			else
			{
				this.ready = true;
				this.total = 0;
				this.onReady();
			}
		}
	};
	/* returns the image */
	GameLoader.prototype.loadImage = function(url)
	{
		var man = tortilla.MANIFEST[url];
		if (man != null)
		{
			++this.assetsToLoad;
			++this.total;

			var loader = this;
			var img = new Image();
			img.onload = function()
			{
				loader.handleAssetLoaded(url);
			};
			img.src = url + "?v=" + man.hash;
			return img;
		}
		else
		{
			console.log("WARNING: Manifest did not contain: " + url);
			return EMPTY;
		}
	};
	GameLoader.prototype.loadSound = function(url, loop)
	{
		++this.assetsToLoad;
		++this.total;

		var pathM4A = url+".m4a";
		var pathOGG = url+".ogg";

		var man = tortilla.MANIFEST[pathM4A];
		if (man == null) console.log("No manifest for: " + pathM4A);
		pathM4A = pathM4A + "?v=" + (man == null ? tortilla.BUILD_TIME : man.hash);
		man = tortilla.MANIFEST[pathOGG];
		if (man == null) console.log("No manifest for: " + pathOGG);
		pathOGG = pathOGG + "?v=" + (man == null ? tortilla.BUILD_TIME : man.hash);
	    var urls = navigator.userAgent.match(/firefox/i) != null ? [pathOGG] : [pathM4A, pathOGG];

	    var loader = this;
	    var loaded = false;
	    var sound = new Howl({
	        urls: urls,
	        loop: loop,
	        volume: 0.25,
	        onload: function()
	        {
	        	if (!loaded)
	        	{
	        		loader.handleAssetLoaded(pathM4A);
	        		loaded = true;
	        	}
	        },
	        onloaderror: function()
	        {
	        	if (!loaded)
	        	{
	        		loader.handleAssetLoaded(pathM4A);
	        		loaded = true;
	        	}
	        }
	    });
	    return sound;
	};




	function Game()
	{
		console.log(this);
	}
	Game.prototype.taps = [];
	Game.prototype.actors = [];
	Game.prototype.ui = [];
	Game.prototype.startMapTemplates = [];
	Game.prototype.endMapTemplates = [];
	Game.prototype.player;
	Game.prototype.images = {};
	Game.prototype.sounds = {};
	Game.prototype.keysDown = {};
	Game.prototype.allowRestart = false;
	Game.prototype.allowStart = false;
	Game.prototype.screenWidth = 0;
	Game.prototype.screenHeight = GAME_HEIGHT;

	Game.prototype.language =
	{
		click:new Lang({en_GB:"CLICK", nl_NL:"KLIK"}),
		tap:new Lang({en_GB:"TAP", nl_NL:"TAP"}),
		best:new Lang({en_GB:"Your best: %0%", nl_NL:"Jouw beste: %0%"}),
		fart:new Lang({en_GB:"%0% TO FART", nl_NL:"%0% VOOR WIND"}),
		refart:new Lang({en_GB:"%0% TO REFART", nl_NL:"%0% VOOR WIND"}),
		activate:new Lang({en_GB:"%0% TO\nACTIVATE", nl_NL:"%0% IS\nACTIVEREN"}),
		ready:new Lang({en_GB:"GET READY!", nl_NL:"OPGELET!"}),
		interact:new Lang(null),
		belt:new Lang({en_GB:"Eggs-treme Belt", nl_NL:"Ei-tastische Riem"}),
		beltsub:new Lang({en_GB:"Find more golden eggs!", nl_NL:"Vindt meer gouden eieren!"}),
		magnet:new Lang({en_GB:"Egg Magnet", nl_NL:"Ei Magneet"}),
		magnetsub:new Lang({en_GB:"Get those eggs!", nl_NL:"Grijp die eieren!"}),
		helmet:new Lang({en_GB:"Kaiju Helmet", nl_NL:"Kaiju Helm"}),
		helmetsub:new Lang({en_GB:"Survive a hit!", nl_NL:"Overleef een klap!"}),
		rexx:new Lang({en_GB:"Rexxtangle"}),
		rexxsub:new Lang({en_GB:"Play as Rexx!", nl_NL:"Speel als Rexx!"}),
		shop:new Lang({en_GB:"STORE", nl_NL:"WINKEL"}),
		start:new Lang({en_GB:"START", nl_NL:"START"}),
		back:new Lang({en_GB:"<Menu", nl_NL:"<Menu"}),
		menu:new Lang({en_GB:"MENU", nl_NL:"MENU"}),
	};
	(function() { Game.prototype.language.interact = Game.prototype.language.click; } )();


	Game.prototype.odd = true;
	Game.prototype.transform = null;
	Game.prototype.flapping = false;
	Game.prototype.lastFlap = Date.now();

	Game.prototype.screenLeft = 0;
	Game.prototype.screenRight = 0;

	Game.prototype.shakeX = 0;
	Game.prototype.camera = new Camera();

	Game.prototype.local = (function()
	{
		//return {helmet:{lvl:0,on:false},magnet:{lvl:0,on:false},belt:{lvl:0,on:false},rexx:{lvl:0,on:false},best:0,eggs:2500};
		var local = JSON.parse(localStorage.getItem('pkfart'));
		if (local == null) return {helmet:{lvl:0,on:false},magnet:{lvl:0,on:false},belt:{lvl:0,on:false},rexx:{lvl:0,on:false},best:0,eggs:0};
		else return local;
	})();
	Game.prototype.passes = 0;

	Game.prototype.pauseButton;

	Game.prototype.generateTemplates = false;
	Game.prototype.autoPlay = false;

	Game.prototype.restarting = false;
	Game.prototype.allowPasses = false;

	Game.prototype.nextDance = 0;


	Game.prototype.upgrades =
	{
		helmet:new Item("helmet", Game.prototype.local.helmet.lvl, 3, Game.prototype.local.helmet.on, 200),
		belt:new Item("belt", Game.prototype.local.belt.lvl, 3, Game.prototype.local.belt.on, 500),
		magnet:new Item("magnet", Game.prototype.local.magnet.lvl, 3, Game.prototype.local.magnet.on, 300),
		rexx:new Item("rexx", Game.prototype.local.rexx.lvl, 1, Game.prototype.local.rexx.on, 5000)
	};
	Game.prototype.lives = 1;

	Game.prototype.screen = SCREEN_START;

	Game.prototype.init = function(loader)
	{
		this.brandLogo = new Element("brand");
		this.brandLogo.right = 5;
		this.brandLogo.bot = 5;
		this.brandLogo.buttonMode = true;
		this.brandLogo.signals.onTap = function()
		{
			spil.logoAction();
		};
		this.brandLogo.setImage(EMPTY);
		SCREEN_START.elements.push(this.brandLogo);
		SCREEN_SHOP.elements.push(this.brandLogo);
		SCREEN_GAME.elements.push(this.brandLogo);

		/*
		this.mgbrandLogo = new Element("more_games");
		//this.mgbrandLogo.right = 45;
		//this.mgbrandLogo.bot = 45;
		this.mgbrandLogo.hor = 0;
		this.mgbrandLogo.verPct = 0.026;
		
		this.mgbrandLogo.buttonMode = true;
		this.mgbrandLogo.signals.onTap = function()
		{
			spil.logoAction();
		};
		this.mgbrandLogo.setImage(EMPTY);
		SCREEN_START.elements.push(this.mgbrandLogo);
		SCREEN_SHOP.elements.push(this.mgbrandLogo);
		SCREEN_GAME.elements.push(this.mgbrandLogo);
		*/
		
		this.canvas = tortilla.canvas;
		this.context = tortilla.context;
		this.lastTime = new Date().getTime();

		this.transform = new Transform();

		var dive = loader.loadImage("assets/kaiju/fall3.png");
		var helmetdive = loader.loadImage("assets/kaiju/helmet-fall3.png");
		var beltdive = loader.loadImage("assets/kaiju/belt-fall3.png");
		var magnetic = [loader.loadImage("assets/magnetic1.png"), loader.loadImage("assets/magnetic2.png")];
		//var shake = [this.loadImage("assets/kaiju/dance-ass1.png"),this.loadImageassets/kaiju/u-dance-ass2.png"),this.loadImage("assets/kaiju/dance-ass3.png")];
		this.images.kaiju =
		{
			idle:loader.loadImage("assets/kaiju/idle.png"),
			fall:
			[
			 	loader.loadImage("assets/kaiju/fall1.png"),
			 	loader.loadImage("assets/kaiju/fall2.png"),
			 	dive
			],
			dive:dive,
			dead:loader.loadImage("assets/kaiju/dead.png"),
			hit:loader.loadImage("assets/kaiju/hit.png"),
			helmet:
			{
				idle:loader.loadImage("assets/kaiju/helmet-idle.png"),
				fall:
				[
				 	loader.loadImage("assets/kaiju/helmet-fall1.png"),
				 	loader.loadImage("assets/kaiju/helmet-fall2.png"),
				 	helmetdive
				],
				dive:helmetdive,
				dead:EMPTY,
				hit:loader.loadImage("assets/kaiju/helmet-hit.png")
			},
			belt:
			{
				idle:loader.loadImage("assets/kaiju/belt-idle.png"),
				fall:
				[
				 	loader.loadImage("assets/kaiju/belt-fall1.png"),
				 	loader.loadImage("assets/kaiju/belt-fall2.png"),
				 	beltdive
				],
				dive:beltdive,
				dead:loader.loadImage("assets/kaiju/belt-dead.png"),
				hit:loader.loadImage("assets/kaiju/belt-hit.png")
			},
			magnetic: magnetic
		};

		dive = loader.loadImage("assets/rexx/fall3.png");
		helmetdive = loader.loadImage("assets/rexx/helmet-fall3.png");
		beltdive = loader.loadImage("assets/rexx/belt-fall3.png");
		this.images.rexx =
		{
			idle:loader.loadImage("assets/rexx/idle.png"),
			fall:
			[
			 	loader.loadImage("assets/rexx/fall1.png"),
			 	loader.loadImage("assets/rexx/fall2.png"),
			 	dive
			],
			dive:dive,
			dead:loader.loadImage("assets/rexx/dead.png"),
			hit:loader.loadImage("assets/rexx/hit.png"),
			helmet:
			{
				idle:loader.loadImage("assets/rexx/helmet-idle.png"),
				fall:
				[
				 	loader.loadImage("assets/rexx/helmet-fall1.png"),
				 	loader.loadImage("assets/rexx/helmet-fall2.png"),
				 	helmetdive
				],
				dive:helmetdive,
				dead:EMPTY,
				hit:loader.loadImage("assets/rexx/helmet-hit.png")
			},
			belt:
			{
				idle:loader.loadImage("assets/rexx/belt-idle.png"),
				fall:
				[
				 	loader.loadImage("assets/rexx/belt-fall1.png"),
				 	loader.loadImage("assets/rexx/belt-fall2.png"),
				 	beltdive
				],
				dive:beltdive,
				dead:loader.loadImage("assets/rexx/belt-dead.png"),
				hit:loader.loadImage("assets/rexx/belt-hit.png")
			},
			magnetic: magnetic
		};

		var fart1 = [loader.loadImage("assets/pixelkaiju-fart1-1.png"), loader.loadImage("assets/pixelkaiju-fart1-2.png"), loader.loadImage("assets/pixelkaiju-fart1-3.png"), loader.loadImage("assets/pixelkaiju-fart1-4.png")];
		var fart2 = [loader.loadImage("assets/pixelkaiju-fart2-1.png"), loader.loadImage("assets/pixelkaiju-fart2-2.png"), loader.loadImage("assets/pixelkaiju-fart2-3.png"), loader.loadImage("assets/pixelkaiju-fart2-4.png")];
		this.images.fart = [fart1,fart2];
		this.images.smack = [loader.loadImage("assets/smack.png")];

		this.images.platform = loader.loadImage("assets/platform.png");

		this.images.poletop = loader.loadImage("assets/poletop.png");
		this.images.polebot = loader.loadImage("assets/polebot.png");
		this.images.bg = loader.loadImage("assets/bg.jpg");
		this.images.floor = loader.loadImage("assets/floor.png");
		this.images.water = loader.loadImage("assets/water.png");
		this.images.mountains = loader.loadImage("assets/mountains.png");
		this.images.rocks = loader.loadImage("assets/rocks.png");
		this.images.clouds = [loader.loadImage("assets/cloud1.png"),loader.loadImage("assets/cloud2.png"),loader.loadImage("assets/cloud3.png"),loader.loadImage("assets/cloud4.png")];
		this.images.fish = [loader.loadImage("assets/fish1.png"),loader.loadImage("assets/fish2.png")];
		this.images.egg = loader.loadImage("assets/egg.png");
		this.images.eggAnim = [loader.loadImage("assets/egg-poof1.png"),loader.loadImage("assets/egg-poof2.png"),loader.loadImage("assets/egg-poof3.png"),loader.loadImage("assets/egg-poof4.png")];
		this.images.eggGold = loader.loadImage("assets/egg-gold.png");
		this.images.eggGoldAnim = [loader.loadImage("assets/egg-gold-poof1.png"),this.images.eggAnim[1],this.images.eggAnim[2],this.images.eggAnim[3]];
		this.images.enemies = [loader.loadImage("assets/enemy1.png"),loader.loadImage("assets/enemy2.png")];
		this.images.screwHead =
		{
			base:loader.loadImage("assets/screw.png"),
			bot:[loader.loadImage("assets/screwhead1.png"),loader.loadImage("assets/screwhead2.png"),loader.loadImage("assets/screwhead3.png"),loader.loadImage("assets/screwhead4.png")],
			top:[loader.loadImage("assets/screwheadup1.png"),loader.loadImage("assets/screwheadup2.png"),loader.loadImage("assets/screwheadup3.png"),loader.loadImage("assets/screwheadup4.png")]
		};

		this.images.buttonPause = loader.loadImage("assets/button-pause.png");
		this.images.eggIcon = loader.loadImage("assets/ui-egg.png");
		this.images.hand = loader.loadImage("assets/hand.png");

		this.images.fartLeft = loader.loadImage("assets/titlefartleft.png");
		this.images.fartRight = loader.loadImage("assets/titlefartright.png");
		this.images.title = loader.loadImage("assets/title.png");
		this.images.polehigh = loader.loadImage("assets/pole-high.png");
		this.images.blastoff = loader.loadImage("assets/blastoff.png");
		this.images.menubutton = loader.loadImage("assets/button-menu.png");
		this.images.startbutton = loader.loadImage("assets/button-start.png");

		this.images.store =
		{
			titlebg: loader.loadImage("assets/shop-header.png"),
			beltbg: loader.loadImage("assets/shop-item-belt.png"),
			helmbg: loader.loadImage("assets/shop-item-helm.png"),
			magnetbg: loader.loadImage("assets/shop-item-magnet.png"),
			rexxbg: loader.loadImage("assets/shop-item-rexx.png"),
			check: loader.loadImage("assets/shop-item-check.png"),
			egg: loader.loadImage("assets/shop-item-egg.png"),
			empty: loader.loadImage("assets/shop-item-empty.png"),
			level: loader.loadImage("assets/shop-item-level.png"),
			table: loader.loadImage("assets/shop-table.png"),
			shopkeeper: loader.loadImage("assets/shop-shopkeeper.png")
		};

		this.sounds.farts =
		[
		 	loader.loadSound("assets/sounds/fart11", false),
		 	loader.loadSound("assets/sounds/fart18", false),
		 	loader.loadSound("assets/sounds/fart21", false),
		 	loader.loadSound("assets/sounds/juicy_fart_21", false),
		 	loader.loadSound("assets/sounds/juicy_fart_24", false)
		];
		this.sounds.music = loader.loadSound("assets/music/loop_game", true);
		this.sounds.egg = loader.loadSound("assets/sounds/bling", false);
		this.sounds.pass = loader.loadSound("assets/sounds/coin", false);
		this.sounds.fall = loader.loadSound("assets/sounds/Bomb", false);
		this.sounds.hit = loader.loadSound("assets/sounds/Punch1", false);


		this.player = new Kaiju();
		this.player.setAnimations(this.upgrades.rexx.enabled ? this.images.rexx : this.images.kaiju);
		this.platform = new Actor();
		this.platform.z = 1;
		this.platform.setImage(this.images.platform);

		//UI
		var game = this;
		this.pauseButton = new Element("pause");
		this.pauseButton.top = 15;
		this.pauseButton.right = 15;
		SCREEN_GAME.elements.push(this.pauseButton);
		this.startButton = new Element("start");
		//this.startButton.blink = true;
		this.startButton.hor = 0;
		this.startButton.verPct = 0.026;
		SCREEN_GAME.elements.push(this.startButton);
		this.getReadyLabel = new Label("ready", new LabelFormat(FONT, 170, false, false, "#F19200", 18, "#000000"));
		this.getReadyLabel.text = this.language.ready.get();
		this.getReadyLabel.hor = 0;
		this.getReadyLabel.verPct = -0.32;
		SCREEN_GAME.elements.push(this.getReadyLabel);
		this.fartLabel = new Label("fart", new LabelFormat(FONT, 120, false, false, "#FFFFFF", 18, "#000000"));
		this.fartLabel.text = this.language.fart.get(this.language.interact.get());
		this.fartLabel.hor = 0;
		this.fartLabel.verPct = 0.142;
		SCREEN_GAME.elements.push(this.fartLabel);
		
		
		
		
		this.passLabel = new Label("passes", new LabelFormat(FONT, 110, false, false, "#FFFFFF", 18, "#000000"));
		this.passLabel.top = 8;
		this.passLabel.hor = 0;
		SCREEN_GAME.elements.push(this.passLabel);
		this.eggIcon = new Element("egg");
		this.eggIcon.setImage(this.images.eggIcon);
		this.eggIcon.x = 15;
		this.eggIcon.top = 15;
		SCREEN_GAME.elements.push(this.eggIcon);
		this.eggLabel = new Label("eggs", new LabelFormat(FONT, 86, false, false, "#FFFFFF", 18, "#000000"));
		this.eggLabel.top = 10;
		this.eggLabel.signals.onUpdate = function()
		{
			this.x = (50*game.scale)+(game.images.eggIcon.width*game.scale);
			this.text = game.local.eggs;
		};
		SCREEN_GAME.elements.push(this.eggLabel);

		var game = this;
		if (tortilla.platform == "browser")
		{
			var body = $(document.body);
			body.keydown(function(e) {
				console.log("keydown", e);
				game.keysDown[e.keyCode] = true;

				if (e.keyCode == 38 || e.keyCode == 32)
				{
					if (game.screen == SCREEN_GAME)
					{
						if (game.allowRestart || (game.allowStart && game.camera.arrived)) game.reset();
						else game.flap();
					}
				}
				//console.log(game.keysDown);
			});
			body.keyup(function(e) {
				//console.log("keyup", e);
				game.keysDown[e.keyCode] = false;
				//console.log(game.keysDown);
			});
		}
		this.canvas.addEventListener("mousedown", function(event)
		{
			var p = tortilla.windowToCanvas(event.clientX, event.clientY);
			game.tap(p.x, p.y);
		});
		this.canvas.addEventListener("mousemove", function(event)
		{
			var p = tortilla.windowToCanvas(event.clientX, event.clientY);
			game.mouseMove(p.x,p.y);
		});
		this.canvas.addEventListener("touchstart", function(event)
		{
			if(!TOUCHDEVICE)
			{
				game.language.interact = game.language.tap;
				TOUCHDEVICE = true;
			}
			var touch = event.touches[0];
			var p = tortilla.windowToCanvas(touch.clientX, touch.clientY);
			game.tap(p.x, p.y);
		});
	};

	Game.prototype.tap = function(x,y)
	{
		if (this.screen == SCREEN_GAME)
		{
			if (this.allowRestart || (this.allowStart && this.camera.arrived))
			{
				this.reset();
			}
			else
			{
				if (this.pauseButton.inside(x, y))
				{
					this.playing = !this.playing;
					this.pauseButton.blink = !this.playing;
				}
				else
				{
					this.flap();
				}
			}
		}
		var elements = this.screen.elements;
		var element = null;
		for (var i = 0; i < elements.length; i++)
		{
			element = elements[i];
			if (element.visible && element.inside(x,y))
			{
				element.handleTap(x-element.x, y-element.y);
			}
		}
	};

	Game.prototype.mouseMove = function(x,y)
	{
		document.body.style.cursor = 'default';
		var element;
		var elements = this.screen.elements;
		for (var i = 0; i < elements.length; i++)
		{
			element = elements[i];
			if (element.visible && element.inside(x,y)) element.handleMouseMove(x-element.x, y-element.y);
		}
	};

	Game.prototype.flap = function(force)
	{
		var now = Date.now();

		if (force || this.autoPlay || (this.allowPasses && !this.player.dead && now-this.lastFlap > 200 && this.player.y > this.player.height*0.5))
		{
			this.sounds.farts[Math.floor(Math.random()*this.sounds.farts.length)].play();
			this.flapping = true;
			this.lastFlap = now;
			this.player.speedX = 400;
			this.player.recover();
		}
	};

	Game.prototype.save = function()
	{
		try
		{
			localStorage.setItem('pkfart', JSON.stringify(this.local));
		} catch (e)
		{
			console.log("Could not save progression.");
		}
	};

	Game.prototype.frame = function(dt)
	{
		var now = Date.now();
		this.context.save();
		//try {
			this.transform.reset();

			this.scale = this.canvas.height/GAME_HEIGHT;
			this.screenWidth = this.canvas.width/this.scale;

			this.transform.scale( this.scale, this.scale);
			this.transform.applyToContext(this.context);

			this.context.save();
			this.context.scale(this.canvas.width/this.scale,GAME_HEIGHT/this.images.bg.height);
			this.context.drawImage(this.images.bg, 0, 0);
			this.context.restore();

			this.camera.step(dt);
			this.transform.translate(-this.camera.x+this.shakeX, 0);
			this.transform.applyToContext(this.context);

			if (Math.round(this.shakeX) != 0)
			{
				this.shakeX = this.shakeX/(1+(dt*30));
				this.shakeX = -this.shakeX;
			}


			if (this.restarting)
			{
				this.camera.setTarget(this.player, -Math.floor((this.canvas.width/this.scale)*0.5)+CAMOFFSET, false);
				if (this.camera.arrived) this.readyToPlay();

				this.platform.x = this.player.x-(this.player.width);
				this.platform.y = this.player.y+155;
			}
			else if (this.allowStart)
			{
				this.camera.setTarget(this.player, -Math.floor((this.screenWidth)*0.5)+CAMOFFSET, true);
				this.platform.x = this.player.x-(this.player.width);
				this.platform.y = this.player.y+155;

				if (this.nextDance != 0 && this.nextDance-now < 0)
				{
					console.log("DANCE!");
					this.queueDance();
					this.player.dance();
				}
			}
			else
			{
				this.camera.setTarget(this.player, -Math.floor(this.screenWidth*0.1), false);
			}

			//console.log(this.camera.arrived, this.autoPlay);
			if (this.camera.arrived && this.autoPlay)
			{
				console.log("autoplay!");
				this.autoPlay = false;
				this.play();
			}

			if (this.screen == SCREEN_GAME)
			{
				//Draw actors, unless disposed
				var actor;
				var ilen = this.actors.length;
				for(var i = 0; i < ilen; i++)
				{
					actor = this.actors[i];
					if (!actor.disposed) actor.draw(this.context);
				}
			}

			//advance step for actors, remove when disposed
			if (this.playing)
			{
				this.player.showMagnet = false;

				i = this.actors.length;
				while(--i >= 0)
				{

					actor = this.actors[i];
					if (actor.disposed) this.actors.splice(i,1);
					else
					{
						if (actor == this.player)
						{
							if(this.flapping)
							{
								this.flapping = false;
								actor.speedY = -800;
								var particle = new Particle(this.images.fart[Math.floor(Math.random()*this.images.fart.length)], 0.05, 0, this.player.cX-30, this.player.cY+50);
								this.addActor(particle);
							}
							if (this.player.y+this.player.height+this.images.floor.height > GAME_HEIGHT)
							{
								this.player.gravity = 0;
								this.player.speedY = 0;
								this.player.speedX = 0;

								if (this.player.airborne)
								{
									if (this.upgrades.belt.enabled) this.shakeX = 20+this.upgrades.belt.level;
									else this.shakeX = 20;

									this.deactivateTemplates(ObstacleTemplate);
									this.sounds.fall.play();
								}
								this.player.airborne = false;

								this.player.dead = true;
								this.player.step(dt);
								this.player.y = GAME_HEIGHT-(this.images.floor.height+(this.player.height))+5;
								if (this.upgrades.belt.enabled) this.player.y += (5*this.upgrades.belt.level);
								if (this.upgrades.helmet.enabled && this.lives > 0) this.player.y += (5*this.upgrades.helmet.level);

								this.allowRestart = true;

								this.startButton.visible = true;
								
							}
						}
						else
						{
							//if (actor.x < this.player.x-this.cameraX) this.actor.dead = true;
							if (actor instanceof Obstacle || actor instanceof Enemy)
							{
								if (this.allowPasses && actor.passable && this.player.x > actor.cX)
								{
									actor.passable = false;
									this.passes++;
									this.lastPasses = this.passes;
									this.sounds.pass.play();
									if (this.local.best < this.passes)
									{
										this.local.best = this.passes;
										this.save();
									}
								}

								if(this.allowPasses && !this.player.invulnerable && actor.allowHit && actor.distance(this.player.cX) < 100 && actor.hitTest(this.player))
								{
									actor.allowHit = false;
									//actor.alpha = 0.5;
									//this.player.speedY = 0;
									this.player.speedX = actor.cX > this.player.cX ? -500 : 150;
									if (!this.player.recovering && !this.player.dead)
									{
										this.lives--;
										this.player.speedY = -100;
										this.shakeX = 10;
										this.addActor(new Particle(this.images.smack, 0.1, 0, this.player.cX, this.player.cY, 3));

										this.sounds.hit.play();
										this.player.hit(2);
										this.lastFlap = now;

										this.player.dead = this.lives < 0;
										if (this.player.dead) this.deactivateTemplates(ObstacleTemplate);
										else this.player.invulnerability(2);

										this.player.showHelmet = this.lives > 0;
									}
								}
							}
							else if (actor instanceof Egg && !actor.collected)
							{
								if(this.allowPasses && actor.distance(this.player.cX) < 100 && actor.hitTest(this.player))
								{
									this.local.eggs += actor.value;
									this.save();

									actor.collect();
									this.sounds.egg.play();
								}
								if (this.upgrades.magnet.enabled && this.upgrades.magnet.level > 0)
								{
									var distance = actor.distance(this.player.cX, this.player.cY);
									var pull = (this.upgrades.magnet.level*100) + 400;
									if (distance < pull)
									{
										this.player.showMagnet = true;
										pull = (pull/distance)*200*this.upgrades.magnet.level;
										actor.speedX -= actor.x > this.player.cX ? dt*pull : dt*-pull;
										actor.speedY -= actor.y > this.player.y ? dt*pull : dt*-pull;
									}
								}
							}
						}
						actor.step(dt);
					}
				}
				//if (this.player.x > this.nextStacleX) this.generateNextObstacles();
				//if (this.player.x > this.nextFloorX) this.generateNextFloors();

				this.screenLeft = this.camera.x;//+this.camera.followOffsetX;
				this.screenRight = this.screenLeft+this.screenWidth;


				if (this.generateTemplates)
				{
					this.generateTemplates = false;
					var left = (this.screenWidth*2);
					console.log("GENERATE TEMPLATES: " + (this.player.x-left), this.player.x);
					this.addTemplate(new FloorTemplate(this.player.x-left, {asset:this.images.floor, yMax:GAME_HEIGHT}));
					this.addTemplate(new WaterTemplate(this.player.x-left, {asset:this.images.water, yMax:GAME_HEIGHT}));
					this.addTemplate(new FishTemplate(this.player.x-left, {assets:this.images.fish, offsetY:0, yMax:GAME_HEIGHT}));
					this.addTemplate(new MountainTemplate(this.player.x-left,
					{
						asset:this.images.mountains,
						offsetY:this.images.floor.height-10,
						factor:0.75,
						player:this.player,
						yMax:GAME_HEIGHT
					}));
					this.addTemplate(new RocksTemplate(this.player.x-left,
					{
						asset:this.images.rocks,
						offsetY:this.images.floor.height-50,
						factor:0.5,
						player:this.player,
						yMax:GAME_HEIGHT
					}));
					this.addTemplate(new CloudsTemplate(this.player.x-left,
					{
						assets:this.images.clouds,
						player:this.player,
						yMax:GAME_HEIGHT*0.6
					}));
				}

				//this.context.fillStyle = "rgb(200,0,0)";
				//this.context.fillRect(screenLeft, 100, screenRight-screenLeft, 100);
				//Replicate new templates for templates that have entered the screen
				var template;
				i = this.startMapTemplates.length;
				while(--i >= 0)
				{
					template = this.startMapTemplates[i];
					if (template.getStartX() < this.screenRight)
					{
						this.startMapTemplates.splice(i,1);
						this.addTemplate(template.replicate(template.getEndX()));
						this.endMapTemplates.push(template);
					}
				}
				//Dispose templates that have been passed by the player and are off screen
				i = this.endMapTemplates.length;
				while(--i >= 0)
				{
					template = this.endMapTemplates[i];
					if (template.getEndX() < this.screenLeft-500)
					{
						this.endMapTemplates.splice(i,1);
						template.dispose();
					}
				}
			}

			//UI
			this.transform.reset();
			this.transform.applyToContext(this.context);

			var uiE = null;
			if (this.screen == SCREEN_START)
			{
				i = this.screen.elements.length;
				while(--i >= 0)
				{
					uiE = this.screen.elements[i];
					if (uiE.name == "mountains")
					{
						uiE.scaleX = this.scale*1.5;
						uiE.scaleY = this.scale*1.5;
					}
					else
					{
						uiE.scaleX = this.scale;
						uiE.scaleY = this.scale;
					}
					uiE.update(this.canvas.width, this.canvas.height);
					uiE.step(dt);
					uiE.draw(this.context);
				}
			}
			else if (this.screen == SCREEN_SHOP)
			{
				i = this.screen.elements.length;
				while(--i >= 0)
				{
					uiE = this.screen.elements[i];
					uiE.scaleX = this.scale;
					uiE.scaleY = this.scale;
					uiE.update(this.canvas.width, this.canvas.height);
					uiE.step(dt);
					uiE.draw(this.context);
				}
			}
			else
			{
				i = this.screen.elements.length;
				while(--i >= 0)
				{
					uiE = this.screen.elements[i];
					if (uiE.name == "start")
					{
						uiE.visible = this.allowRestart || this.allowStart;
						uiE.x = (this.canvas.width*0.48)-(uiE.width*0.5);
						uiE.y = (this.canvas.height*0.62)-(uiE.height);
					}
					else if (uiE.name == "ready")
					{
						uiE.visible = !this.allowPasses && !this.autoPlay;
						uiE.x = (this.canvas.width*0.5)-(uiE.width*0.5);
						uiE.y = this.canvas.height*0.25;
					}
					else if (uiE.name == "fart")
					{
						var fartLabel = this.allowRestart ? this.language.refart.get([this.language.interact.get()]) : this.language.fart.get([this.language.interact.get()]);
						uiE.text = fartLabel;
						uiE.format.size = 12/(fartLabel.length+1)*120;
						uiE.visible = this.allowRestart || this.allowStart;
						uiE.x = (this.canvas.width*0.5)-(uiE.width*0.5);
						uiE.y = this.canvas.height*0.7;
					}
					uiE.scaleX = this.scale;
					uiE.scaleY = this.scale;
					uiE.update(this.canvas.width, this.canvas.height);
					uiE.step(dt);
					uiE.draw(this.context);
				}
				this.passLabel.text = this.passes.toString();
			}

		//} finally {
			this.context.restore();
		//}
	};

	Game.prototype.addActor = function(actor)
	{
		for (var i = 0; i < this.actors.length; i++)
		{
			if (actor.z <= this.actors[i].z)
			{
				this.actors.splice(i,0,actor);
				return;
			}
		}
		this.actors.push(actor);
	};

	Game.prototype.addTemplate = function(mapTemplate)
	{
		var actor = null;
		for (var i = 0; i < mapTemplate.actors.length; i++)
		{
			actor = mapTemplate.actors[i];
			this.addActor(actor);
			actor.step(0);
		}
		this.startMapTemplates.push(mapTemplate);
	};

	Game.prototype.deactivateTemplates = function(templateClass)
	{
		var template;
		var i = this.startMapTemplates.length;
		while(--i >= 0)
		{
			template = this.startMapTemplates[i];
			if(template instanceof templateClass)
			{
				this.startMapTemplates.splice(i,1);
				template.deactivate();
			}
		}
	};

	Game.prototype.changeScreen = function(screen)
	{
		console.log("changeScreen", screen.name);
		if (screen == SCREEN_GAME)
		{
			this.allowRestart = true;
			this.reset();
		}
		else
		{
			if (this.screen == SCREEN_GAME && screen == SCREEN_START && spil != null && this.lastPasses > 5) spil.showAd();
		}
		this.screen = screen;
		this.playing = screen == SCREEN_GAME;
	};

	Game.prototype.initStartScreen = function()
	{
		var game = this;
		var ui = new Element("");
		ui = new Element("title");
		ui.verPct = -0.35;
		ui.hor = 0;
		ui.setImage(this.images.title);
		
		SCREEN_START.elements.push(ui);
		ui = new Element("left");
		ui.setImage(this.images.fartLeft);
		ui.verPct = -0.35;
		ui.leftPct = 0.5;
		
		SCREEN_START.elements.push(ui);
		ui = new Element("right");
		ui.verPct = -0.35;
		ui.rightPct = 0.5;
		ui.setImage(this.images.fartRight);
		SCREEN_START.elements.push(ui);

		ui = new Button("go", this.images.menubutton, new LabelFormat(FONT, 70, false, false, "#FFFFFF", 18, "#032e3f"));
		ui.text = this.language.start.get();
		ui.verPct = -0.135;
		ui.hor = -110;
		ui.signals.onUpdate = function() {this.hor = -230*game.scale;};
		ui.signals.onTap = function()
		{
			game.changeScreen(SCREEN_GAME);
		};
		SCREEN_START.elements.push(ui);
		ui = new Button("shop", this.images.menubutton, new LabelFormat(FONT, 70, false, false,"#FFFFFF", 18, "#032e3f"));
		ui.text = this.language.shop.get();
		ui.verPct = -0.135;
		ui.hor = 110;
		ui.signals.onUpdate = function() {this.hor = 230*game.scale;};
		ui.signals.onTap = function()
		{
			game.changeScreen(SCREEN_SHOP);
		};
		SCREEN_START.elements.push(ui);
		this.shopButton = ui;
		
		SCREEN_START.elements.push(ui);
		ui = new Button("more_games", this.images.menubutton, new LabelFormat(FONT, 50, false, false,"#FFFFFF", 18, "#032e3f"));
		ui.text = "More Games";
		ui.verPct = 0.026;
		ui.hor = 0;
		ui.signals.onUpdate = function() {this.hor = game.scale;};
		ui.signals.onTap = function()
		{
			window.open("https://m3m.me/gamefi");
			//game.changeScreen(SCREEN_SHOP);
		};
		SCREEN_START.elements.push(ui);
		

		var label = new Label("passes", new LabelFormat(FONT, 70, false, false, "#FFFFFF", 18, "#032e3f"));
		label.text = this.language.best.get(this.local.best);//"YOUR BEST: " + game.bestPasses;
		label.draw(this.context);

		//var statGroup = new ElementGroup("stats", label.width, 100);
		label.signals.onUpdate = function()
		{
			this.visible = game.local.best > 0;
			this.text = game.language.best.get([game.local.best]);
			//statGroup.baseWidth = this.baseWidth;
		};
		//statGroup.addElement(label);

		/*var eggIcon = new Element("egg");
		eggIcon.y = 90;
		eggIcon.setImage(this.images.eggIcon);
		label = new Label("eggs", new LabelFormat(FONT, 70, false, false, "#FFFFFF", 18, "#000000"));
		label.x = eggIcon.width+20;
		label.y = 95;
		label.text = this.eggs;
		label.signals.onUpdate = function()
		{
			this.text = game.eggs;
		};
		statGroup.addElement(eggIcon);
		statGroup.addElement(label);*/

		label.hor = 0;
		label.y = 200;
		SCREEN_START.elements.push(label);



		ui = new Element("polefront");
		ui.setImage(this.images.polehigh);
		ui.verPct = 0.48;
		ui.hor = 130;
		ui.signals.onUpdate = function()
		{
			label.y = this.y-(120*game.scale);
		};
		SCREEN_START.elements.push(ui);
		ui = new Element("blastoff");
		ui.setImage(this.images.blastoff);
		ui.verPct = 0.23;
		ui.hor = -60;
		SCREEN_START.elements.push(ui);
		ui = new Element("poleback");
		ui.setImage(this.images.polebot);
		ui.verPct = 0.46;
		ui.hor = -150;
		SCREEN_START.elements.push(ui);

		ui = new Element("cloud0");
		ui.setImage(this.images.clouds[0]);
		ui.verPct = -0.12;
		ui.hor = 250;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud1");
		ui.setImage(this.images.clouds[1]);
		ui.verPct = -0.415;
		ui.hor = 195;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud2");
		ui.setImage(this.images.clouds[2]);
		ui.verPct = -0.051;
		ui.hor = -160;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud3");
		ui.setImage(this.images.clouds[3]);
		ui.verPct = -0.25;
		ui.hor = -150;
		SCREEN_START.elements.push(ui);

		ui = new Element("cloud4");
		ui.setImage(this.images.clouds[0]);
		ui.verPct = -0.29;
		ui.hor = 690;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud5");
		ui.setImage(this.images.clouds[1]);
		ui.verPct = -0.12;
		ui.hor = 595;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud6");
		ui.setImage(this.images.clouds[2]);
		ui.verPct = -0.25;
		ui.hor = -560;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud7");
		ui.setImage(this.images.clouds[3]);
		ui.verPct = 0.015;
		ui.hor = -650;
		SCREEN_START.elements.push(ui);
		ui = new Element("cloud8");
		ui.setImage(this.images.clouds[2]);
		ui.verPct = -0.41;
		ui.hor = -750;
		SCREEN_START.elements.push(ui);

		ui = new Element("mountains");
		ui.setImage(this.images.mountains);
		ui.hor = 50;
		ui.bot = 0;
		SCREEN_START.elements.push(ui);
	};

	Game.prototype.initShop = function()
	{
		var game = this;

		var shopList = new ElementGroup("shoplist", 866, 184*5);
		shopList.verPct = -0.1;
		shopList.hor = 0;

		var group = new ElementGroup("title", 866, 164);
		group.x = 0;
		group.y = 0;
			var img = new Element("titlebg");
			img.setImage(this.images.store.titlebg);
			img.x = 0;
			img.y = 0;
			group.addElement(img);
			var label = new Label("titlelabel", new LabelFormat(FONT, 90, false, false, "#FFFFFF", 22, "#000000"));
			label.hor = 0;
			label.ver = 0;
			label.text = "STORE";
			group.addElement(label);
		shopList.addElement(group);

		var group = this.createshopItemGroup("helmet", this.images.store.helmbg, this.language.helmet.get(), this.language.helmetsub.get());
		group.x = 0;
		group.y = 184;
		shopList.addElement(group);
		group = this.createshopItemGroup("belt", this.images.store.beltbg, this.language.belt.get(), this.language.beltsub.get());
		group.x = 0;
		group.y = 184*2;
		shopList.addElement(group);
		group = this.createshopItemGroup("magnet", this.images.store.magnetbg, this.language.magnet.get(), this.language.magnetsub.get());
		group.x = 0;
		group.y = 184*3;
		shopList.addElement(group);
		group = this.createshopItemGroup("rexx", this.images.store.rexxbg, this.language.rexx.get(), this.language.rexxsub.get(), false);
		group.x = 0;
		group.y = 184*4;
		shopList.addElement(group);

		SCREEN_SHOP.elements.push(shopList);

		label = new Label("eggs", new LabelFormat(FONT, 70, false, false, "#FFFFFF", 20, "#000000"));
		label.top = 25;
		label.right = 15;
		label.text = "<Menu";
		label.buttonMode = true;
		label.signals.onTap = function()
		{
			game.changeScreen(SCREEN_START);
			game.player.setAnimations(game.upgrades.rexx.enabled ? game.images.rexx : game.images.kaiju);
		};
		SCREEN_SHOP.elements.push(label);


		/*var ui = new Element("egg");
		ui.setImage(this.images.eggIcon);
		ui.left = 15;
		ui.top = 15;
		SCREEN_SHOP.elements.push(ui);
		label = new Label("eggs", new LabelFormat(FONT, 70, false, false, "#FFFFFF", 18, "#000000"));
		label.left = ((ui.width+50)*this.scale);
		label.top = 25;
		label.signals.onUpdate = function()
		{
			this.text = game.eggs;
		};
		SCREEN_SHOP.elements.push(label);*/
		SCREEN_SHOP.elements.push(this.eggIcon);
		SCREEN_SHOP.elements.push(this.eggLabel);


		var ui = new Element("shopkeeper");
		ui.setImage(this.images.store.shopkeeper);
		ui.hor = 100;
		ui.bot = 0;
		SCREEN_SHOP.elements.push(ui);

		ui = new RepeatingImage("table", this.images.store.table);
		ui.x = 0;
		ui.bot = 0;
		ui.signals.onUpdate = function()
		{
			this.minWidth = game.screenWidth;
		};
		SCREEN_SHOP.elements.push(ui);

		ui = new Quad("black", "#000000", 100, 100);
		ui.alpha = 0.35;
		ui.signals.onUpdate = function()
		{
			this.width = game.canvas.width/game.scale;
			this.height = GAME_HEIGHT;
		};
		SCREEN_SHOP.elements.push(ui);

		ui = new RepeatingImage("water", this.images.water);
		ui.x = 0;
		ui.bot = 0;
		ui.minWidth = this.screenWidth;
		ui.signals.onUpdate = function()
		{
			this.minWidth = game.screenWidth;
		};
		SCREEN_SHOP.elements.push(ui);

		ui = new RepeatingImage("floor", this.images.floor);
		ui.x = 0;
		ui.bot = 0;
		ui.minWidth = this.screenWidth;
		ui.signals.onUpdate = function()
		{
			this.minWidth = game.screenWidth;
		};
		SCREEN_SHOP.elements.push(ui);

		ui = new Element("rocks");
		ui.setImage(this.images.rocks);
		ui.hor = 160;
		ui.bot = this.images.floor.height-40;
		ui.signals.onUpdate = function()
		{
			this.bot = (game.images.floor.height-40)*game.scale;
		};
		SCREEN_SHOP.elements.push(ui);

		ui = new Element("mountains");
		ui.setImage(this.images.mountains);
		ui.hor = 50;
		ui.bot = this.images.floor.height;
		ui.signals.onUpdate = function()
		{
			this.bot = game.images.floor.height*game.scale;
		};
		SCREEN_SHOP.elements.push(ui);
	};

	Game.prototype.createshopItemGroup = function(upgradeName, bg, title, sub, showLevels)
	{
		var game = this;

		var group = new ElementGroup(upgradeName, 866, 164);
		var img = new Element("bg");
		img.setImage(bg);
		img.x = 0;
		img.y = 0;
		group.addElement(img);
		img = new Element("check");
		img.setImage(this.images.store.check);
		img.x = 20;
		img.y = 70;
		img.signals.onUpdate = function() {this.visible = game.upgrades[upgradeName].enabled;};
		group.addElement(img);
		var label = new Label("cta", new LabelFormat(FONT, 30, false, false, "#FFFFFF", 12, "#032e3f", 'center'));
		label.x = 50;
		label.y = 45;
		label.text = this.language.activate.get([this.language.interact.get()]);
		label.signals.onUpdate = function() {this.visible = !game.upgrades[upgradeName].enabled && game.upgrades[upgradeName].level > 0;};
		group.addElement(label);

		label = new Label("title", new LabelFormat(FONT, 54, false, false, "#FFFFFF", 16, "#032e3f"));
		label.x = 250;
		label.y = 25;
		label.text = title;
		group.addElement(label);
		label = new Label("sub", new LabelFormat(FONT, 36, false, false, "#032e3f"));
		label.x = 245;
		label.y = 102;
		label.text = sub;
		//label.signals.onUpdate = function() {this.text = game.upgrades.helmet.level < 2 ? "Survive a hit!" : "Survive "+game.upgrades.helmet.level+" hits!";};
		group.addElement(label);

		if (showLevels == null|| showLevels == true)
		{
			img = new Element("level1");
			img.setImage(this.images.store.empty);
			img.x = 750;
			img.y = 110;
			img.signals.onUpdate = function() {this.setImage(game.upgrades[upgradeName].level < 1 ? game.images.store.empty : game.images.store.level);};
			group.addElement(img);
			img = new Element("level2");
			img.setImage(this.images.store.empty);
			img.x = 750+30;
			img.y = 110;
			img.signals.onUpdate = function() {this.setImage(game.upgrades[upgradeName].level < 2 ? game.images.store.empty : game.images.store.level);};
			group.addElement(img);
			img = new Element("level3");
			img.setImage(this.images.store.empty);
			img.x = 750+60;
			img.y = 110;
			img.signals.onUpdate = function() {this.setImage(game.upgrades[upgradeName].level < 3 ? game.images.store.empty : game.images.store.level);};
			group.addElement(img);
		}

		var eggLabel = new Label("egglabel", new LabelFormat(FONT, 54, false, false, "#FFFFFF", 16, "#000000"));
		eggLabel.right = 25;
		eggLabel.y = 30;
		eggLabel.text = "500";
		eggLabel.signals.onUpdate = function()
		{
			var upgrade = game.upgrades[upgradeName];
			this.text = upgrade.level >= upgrade.max ? "MAX" : upgrade.cost + (upgrade.cost*0.5*upgrade.level)+"";
		};
		group.addElement(eggLabel);
		img = new Element("egg");
		img.setImage(this.images.store.egg);
		img.right = 100;
		img.y = 17;
		img.signals.onUpdate = function()
		{
			this.visible = game.upgrades[upgradeName].level < game.upgrades[upgradeName].max;
			this.right = eggLabel.width+eggLabel.right+10;
		};
		group.addElement(img);

		group.signals.onTap = function(x,y)
		{
			if (game.upgrades[upgradeName].level > 0 && (x < this.width*0.3 || game.upgrades[upgradeName].level == game.upgrades[upgradeName].max))
			{
				game.upgrades[upgradeName].enabled = !game.upgrades[upgradeName].enabled;
				game.local[upgradeName].on = game.upgrades[upgradeName].enabled;
				game.save();
			}
			else
			{
				game.purchaseUpgrade(upgradeName);
			}
		};

		group.buttonMode = true;
		return group;
	};

	Game.prototype.purchaseUpgrade = function(upgradeName)
	{
		console.log("purchaseUpgrade", upgradeName);
		var upgrade = this.upgrades[upgradeName];
		var cost = upgrade.cost + (upgrade.cost*0.5*upgrade.level);
		if (this.local.eggs >= cost && upgrade.level < upgrade.max)
		{
			this.local.eggs -= cost;
			upgrade.level += 1;
			this.local[upgradeName].lvl = upgrade.level;
			this.local[upgradeName].on = true;
			upgrade.enabled = true;
			this.save();
		}
		else
		{
			//TODO cannot afford!
			console.log("Cannot afford: " + upgradeName + ", player has only " + this.local.eggs + " of " + upgrade.cost + ".");
		}
	};

	Game.prototype.readyToPlay = function()
	{
		console.log("readyToPlay");
		this.restarting = false;
		this.startButton.visible = true;
		
		this.allowStart = true;
	};

	Game.prototype.start = function()
	{
		if (spil != null && spil.logoImage != null) this.brandLogo.setImage(spil.logoImage);
		//if (spil != null && spil.logoImage != null) this.mgbrandLogo.setImage(spil.logoImage);


		this.sounds.music.play();

		this.pauseButton.setImage(this.images.buttonPause);
		this.startButton.setImage(this.images.hand);
		
		var game = this;
		this.returnButton = new Button("return", this.images.menubutton, new LabelFormat(FONT, 70, false, false, "#FFFFFF", 18, "#032e3f"));
		this.returnButton.text = this.language.menu.get();
		this.returnButton.verPct = -0.25;
		this.returnButton.hor = 0;
		this.returnButton.signals.onTap = function() { game.changeScreen(SCREEN_START); };
		this.returnButton.signals.onUpdate = function()	{ this.visible = game.allowRestart; };
		SCREEN_GAME.elements.push(this.returnButton);

		//start screen
		this.initStartScreen();

		this.initShop();

		console.log("start");
		this.allowStart = true;
		this.clearActors();
		this.clearMap();

		this.playing = true;
		this.started = new Date().getTime();

		//this.player.x += this.camera.x;
		this.player.y = STARTY;
		this.player.speedX = 400;
		this.player.gravity = 0;
		this.addActor(this.player);
		this.addActor(this.platform);

		this.generateTemplates = true;
		//this.allowRestart = true;
		//this.allowStart = true;
		//this.reset();
		this.player.showBelt = this.upgrades.belt.enabled;
		this.player.showHelmet = this.upgrades.helmet.enabled;
		this.player.showMagnet = false;
	};

	Game.prototype.play = function()
	{
		console.log("play");

		this.allowRestart = false;
		this.allowStart = false;
		this.allowPasses = true;

		this.startButton.visible = false;

		this.player.dead = false;
		this.player.airborne = true;
		//this.player.gravity = 2100+(200*this.);

		this.passes = 0;
		this.lastPasses = this.passes;
		this.lives = this.upgrades.helmet.enabled ? this.upgrades.helmet.level : 0;

		this.player.showBelt = this.upgrades.belt.enabled;
		this.player.showHelmet = this.upgrades.helmet.enabled;
		this.player.showMagnet = false;
	};

	Game.prototype.reset = function()
	{
		console.log("reset", this.screen);
		if (this.autoPlay) this.play();
		else
		{
			this.player.y = STARTY;
			this.startButton.visible = false;
			this.passes = 0;
			this.allowPasses = false;
			this.player.speedY = 0;

			this.lives = this.upgrades.helmet.enabled ? this.upgrades.helmet.level : 0;

			this.player.showBelt = this.upgrades.belt.enabled;
			this.player.showHelmet = this.upgrades.helmet.enabled;
			this.player.showMagnet = false;

			if (this.allowRestart)
			{
				this.player.x += this.screenWidth*3;//TODO one screen past last obstacle x
				this.camera._currentOffsetX -= this.screenWidth*3;
				this.player.speedX = 400;
				this.player.dead = false;
				this.player.airborne = true;
				this.restarting = true;
				this.allowRestart = false;
			}
			else
			{
				var game = this;
				var x = this.screenRight > this.player.x+1500 ? this.screenRight : this.player.x+1500;
				this.addTemplate(new ObstacleTemplate(x,
				{
					getPasses:function(){ return game.passes;},
					top:this.images.poletop,
					bot:this.images.polebot,
					screwHead:this.images.screwHead,
					egg:this.images.egg,
					eggAnim:this.images.eggAnim,
					eggGold:this.images.eggGold,
					eggGoldAnim:this.images.eggGoldAnim,
					gold:this.upgrades.belt.enabled ? this.upgrades.belt.level : 0,
					enemies:this.images.enemies,
					distance:500,
					yMin:0,
					yMax:GAME_HEIGHT,
					floorHeight:this.images.floor.height,
					size:150
				}, true));

				this.allowStart = false;
				this.autoPlay = true;
				console.log("allowAutoplay");

				this.player.speedY = 0;
				this.player.gravity = 2100;
				this.flap(true);
			}
		}
	};

	Game.prototype.queueDance = function()
	{
		this.nextDance = Date.now()+5000;
		console.log("next dance in " + (this.nextDance-Date.now()));
	};

	Game.prototype.clearActors = function()
	{
		for (var i = 0; i < this.actors.length; i++)
		{
			//this.actors[i].dispose();
		}
		this.actors.length = 0;
	};
	Game.prototype.clearMap = function()
	{
		for (var i = 0; i < this.startMapTemplates.length; i++)
		{
			this.startMapTemplates[i].dispose();
		}
		this.startMapTemplates.length = 0;
		for (var i = 0; i < this.endMapTemplates.length; i++)
		{
			//this.endMapTemplates[i].dispose();
		}
		this.endMapTemplates.length = 0;
	};
})();
