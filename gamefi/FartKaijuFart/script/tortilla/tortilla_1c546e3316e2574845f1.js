(function() {

	function trace(x) {
		console.log("[tortilla/browser] " + x);
	}
	trace("0.3 starting up");

	var eventListeners = {};

	function eventListenerList(event) {
		if (eventListeners.hasOwnProperty(event)) {
			return eventListeners[event];
		} else {
			return eventListeners[event] = {};
		}
	}

	var tortilla = {

		EV_VISIBILITY_CHANGED: "visibilityChanged",
		EV_FULLSCREEN_CHANGED: "fullscreenChanged",
		EV_RESIZED: "resized",

		platform: "browser",

		BUILD_TIME: 1396552562005,
		MANIFEST: {"index.html":{"hash":"dad978a21d84a58e944a195f1cca421fe0afdf264881b680e0d6f59e8dee546d"},"assets/bg.jpg":{"hash":"45500669d88febdd4de421ea0b9f7915b7981ffbb1585f062f4eed37e383a61c"},"assets/blastoff.png":{"hash":"e07b929d0b234e776be21ed47a0be6f9d029eda2cb9641f5c52ed9dec68eb11c"},"assets/brandlogo.png":{"hash":"b6d100d6cf39fce19738c963df61f6d4fda6ffb4efbc6aa4d81cce9e37b84111"},"assets/button-menu.png":{"hash":"3737faf87d50deb62a0220424fa05c80303d39dc6c7b34b21af4bd858cce3604"},"assets/button-pause.png":{"hash":"0d572df71c3672d96ecc0c9a5e904fc042e80639d520ec9eca4fb2003de14be0"},"assets/button-start.png":{"hash":"17a2d44b659b7c7daf3cecdcf02c82c900b02e3297a07e360ad63d678378f39c"},"assets/cloud1.png":{"hash":"232faf71d506ff66e7bfb13b6f62b8fc889e54d317c586516e73133adcf42549"},"assets/cloud2.png":{"hash":"b74576f858576998d5e114eff831cb0c83eaa2d0f5aaca28c1254985223fc51e"},"assets/cloud3.png":{"hash":"33190b68f1e13760f861f1b56daab314bc94ac85220682cd39a001b34e1fc192"},"assets/cloud4.png":{"hash":"66aca45fd535665eeb2ec1c2627616ce94123d4985c95baac72050a6201d7642"},"assets/egg-gold-poof1.png":{"hash":"9798b229b584f65a19fb79dba56cae7e613061c1152f0546b8b75e0fa69388be"},"assets/egg-gold.png":{"hash":"90046f8bc32528dc91d0653b3e14d6831669eb68df6ab2b04d9c3ca143d0bdef"},"assets/egg-poof1.png":{"hash":"294619d8faec38187b52198626da09c8c6c20da1a026877d524193437388fabc"},"assets/egg-poof2.png":{"hash":"9112afaa5857918b4219e8045868c955377300b9ff02f5e44460795550b7f0c4"},"assets/egg-poof3.png":{"hash":"be46307533a082e70fc24c1f3d6ca06b3abf58dbdb29fb47b1a9fb923ff0423b"},"assets/egg-poof4.png":{"hash":"29a5998255771e2b97cea7706868d912e098e40750b17899124c42df74f02055"},"assets/egg.png":{"hash":"5d02823b65d29c6c662faa3aa2c6f9597b7d6f5be4784098cdfd737e0ac44b28"},"assets/empty.png":{"hash":"25081f8195661c8960768d82c5c188f214a01651532715cf6225d2da4513ecf6"},"assets/enemy1.png":{"hash":"beaa70c23424e756bc09cb605ea4d668d60e5b21cb0e4c08830e6b0ddfde8dce"},"assets/enemy2.png":{"hash":"563e4a4ff784f5b39795f6d29bacf9f6fe47b966428dd8e9ab8fe3f0adf5a0eb"},"assets/fish1.png":{"hash":"6f2b93df11247a4a1f4152bee818a2404ed49f2505bebac9939c8e0b84cdcc25"},"assets/fish2.png":{"hash":"ecbf0fc7d49b32a6eeb9710c5472b80a7396fc68a957ad3f63ecd1628007a352"},"assets/floor.png":{"hash":"d999cecb51c2caaede0854a4779fcce3755d6aaf791dba244ecf50f650ad6a87"},"assets/hand.png":{"hash":"3eaa1e694077cbb6e25d7d734c114d628362586bd00ddbcf21004c493ea55284"},"assets/magnetic1.png":{"hash":"64e4d313020f082c3dab573ea4185c8925aae082b18d8395e5ba9d7c48830a59"},"assets/magnetic2.png":{"hash":"4bddf2b1ea2587074bac5f774f61602bf57e709ba5fa8cc7b35ac945dd0b52d6"},"assets/mountains.png":{"hash":"766eb7b9cc7d5b0bbe8732801c4c851b178750380d6019453fdbee88ae63911a"},"assets/pixelkaiju-dance-ass1.png":{"hash":"e562f406446ba51f752c37147b0f26ee780e352407d7a3fe3980a9ac89937f2b"},"assets/pixelkaiju-dance-ass2.png":{"hash":"6607367db2e9262524cc57a1d8c9c6257e499e71e8959abe9f0ac2735c5e3a00"},"assets/pixelkaiju-dance-ass3.png":{"hash":"2af7ffdbec8edfbcc7688c67e6d04f4e5b86dbfc8f2e842e5d63fa8a5d3c1e79"},"assets/pixelkaiju-dance-left1.png":{"hash":"2eb39466368392a79e9dc3ce788925ccde7f0ce6c488305962a32c17da25135f"},"assets/pixelkaiju-dance-right1.png":{"hash":"6fe7597fe75fc752b3010521807a6b6a89512d33185a917f94d7c98a2600ff03"},"assets/pixelkaiju-fart1-1.png":{"hash":"2d8c487a3782d6f2979bbdc91c5cdd3ffa642840968af7fccb73303c2963a225"},"assets/pixelkaiju-fart1-2.png":{"hash":"aea74c7c4f547b8c67a99cf5c9c09d13260d8523a1aba66c23008d29b7a470a7"},"assets/pixelkaiju-fart1-3.png":{"hash":"c3fd15e67d060aeac0cc9f2f659a3dde0cc4d234edc5a6f32fffe142d6392ad1"},"assets/pixelkaiju-fart1-4.png":{"hash":"77bf90a3ade60046854176d935840f54f35386c8cd55afb5b51e4a57483d8ad2"},"assets/pixelkaiju-fart2-1.png":{"hash":"cd64a501b76cb1ba85798d0ba1d589107239c0299ceb47ee06f8ef786a6165e3"},"assets/pixelkaiju-fart2-2.png":{"hash":"9451eea7b61e623c91574c19458beef572d397f2028bc0a8b3c8cf8aef38e976"},"assets/pixelkaiju-fart2-3.png":{"hash":"8792a6706b6653359ff45f3e874f882379dc0b5f19702eed97eed7a9197a78e1"},"assets/pixelkaiju-fart2-4.png":{"hash":"d92bc611f991998e3e7c14d8efd32173a21e60e1b73cdfb36a784925ab78250d"},"assets/pixelkaiju-loadingbar-vulling.png":{"hash":"17254da2ee2ed6fcf645ca6b74a397efc883fd315f1450e6d0f5caf4b8b009eb"},"assets/pixelkaiju-loadingbar.png":{"hash":"ce3e092bbcc7472559241fcc9cc50d4c7e296f4df9e7b55856952457ea5ff353"},"assets/platform.png":{"hash":"1ff6c4c30d0f1f98799df7dae8e0d7d87f182499a170bd5e3d45a2c8082e8c23"},"assets/pole-high.png":{"hash":"967b8bead683321eee0dfd9a17ab4f451d2d09f31432878d5c3d6f753fdd54b2"},"assets/polebot.png":{"hash":"62f68a662522791f2d77f15be5d53f468f4a477787d36d57c983d6f55f9c372c"},"assets/poletop.png":{"hash":"e84c4311b882b601ebe9f6d2763ec31fb5a704b05d41363f0777b485ad899d6b"},"assets/rocks.png":{"hash":"19ec35a4299aa2260779dd79fcc55cf255a704699469a906c1f3258f14157fe6"},"assets/screw.png":{"hash":"d8a15d1cc7a324e65ffe6323231b43b284f3627e3ded07bace7855eacdc8b6d9"},"assets/screwhead1.png":{"hash":"f3a4e6c5a221c31d67e7126d406f08ca879ec0cc17efa4368f8246e8fc16950f"},"assets/screwhead2.png":{"hash":"01bd388c2d372936dd89097f4bb6257ab01a464ce34da40bf301497b37deacaf"},"assets/screwhead3.png":{"hash":"beee35bb0a1f406075fe72196a26039a2f1bf155ec3061690f20a075861ab433"},"assets/screwhead4.png":{"hash":"21aa760c4f1c5a1e89b8d1fec5de95c1abb6a878c33c5d69b8b42dbe7147444f"},"assets/screwheadup1.png":{"hash":"6065f54534f02103e86fa5e619cd07c1c6de9e589ecb7539ac8fe264544ef21e"},"assets/screwheadup2.png":{"hash":"f96163b828d3c7e2870fc5086d79ad4e238538756c3cf5c51aae333b13795374"},"assets/screwheadup3.png":{"hash":"0efd8e19c1159525c30b53a8af6a53ad597a4a9a80801d69ae6cf2366e0fa994"},"assets/screwheadup4.png":{"hash":"e2068a7854656a82410e163d13b8e6ed48dd93ffaff393991b8ff462b2a50528"},"assets/shop-header.png":{"hash":"f62a56c0507ea4fe555a56bc37e8f10aa8814259a7bd63daac0b7dc6c775a564"},"assets/shop-item-belt.png":{"hash":"280a6ec31cd7fc2c396382bd2caa86ce4d0d0e10dc5fd50297e27513ae1bba1c"},"assets/shop-item-check.png":{"hash":"84a4b8e616e25f54a5777a1c5d67d66b9b06e9dbda6e8310df542c26f6dc9eed"},"assets/shop-item-egg.png":{"hash":"4e5897c3ba0964c56074349405b1e4bc3eb5b5cffd01a76634cdc6e8bfb532c0"},"assets/shop-item-empty.png":{"hash":"1104a71b01c9e3c7ba546601407b3fe46a91bcc1d3e025407fbfeb97c78db64c"},"assets/shop-item-helm.png":{"hash":"8c3eccab7326197034cf1b324a142231ebcff722b1fc7981aa2964a86ed3a9f8"},"assets/shop-item-level.png":{"hash":"fe0db016a5fd2081086aac0246dee752b4da273881a18ad7625f89edc054b1c3"},"assets/shop-item-magnet.png":{"hash":"5c04912ae81bd14c821084993b681e9edf6b073cca483ba0185fc15f85449f5b"},"assets/shop-item-rexx.png":{"hash":"9b7fa85497f0925a6e780553b728922cecd31b9282b1ee6f8efeeffcc4a03132"},"assets/shop-shopkeeper.png":{"hash":"3efdc012a9079af769c265fa1efd2cfd45839db8802e4ec3e3100907db72ef69"},"assets/shop-table.png":{"hash":"db54c37587eca40fe8f2d91dece8e55082a5ce68978504cceffed7ff5816d3b9"},"assets/smack.png":{"hash":"551cca8c2427d01d403adbc51cb8ff0b3224b3d31ffe61c5d0624b3259c1a64d"},"assets/title.png":{"hash":"d8736c6aa269a268f5b2d386054535a67c00618ba80f5c3f90daa0840817c203"},"assets/titlefartleft.png":{"hash":"21b72899ec202910413bfa24fcce02dc5d225c889c0cb0c3643aefd25115987b"},"assets/titlefartright.png":{"hash":"e197316966168fb18c578351da78de37aa7e22970d656d84f69ad6fb0cabf7fa"},"assets/ui-egg.png":{"hash":"ad6ff4d7d5e942afdf94f21dd7ba5fb12f9807f4a0052ea66b16d380cc68e630"},"assets/water.png":{"hash":"618201859458d8c5546ce4e2a3738e63f48b32b4ea806bd36b7f2652091b70d3"},"assets/sounds/bling.m4a":{"hash":"9ae93a732238a3ba0e733e4b156bb8dff216663545123ff32520577e245b6788"},"assets/sounds/bling.ogg":{"hash":"0a790dfa095a3089e35c630ca2c1e811850d43120e297a992d5474770440387c"},"assets/sounds/Bomb.m4a":{"hash":"c6d27d1fb6f3e6ada8859cd8fa54b2cf03795c96ca22ab5581e2b050744c8bf2"},"assets/sounds/Bomb.ogg":{"hash":"30b3fae7813174cd61b0006d41fca05b2ecd013cdaf4596a0faecc8d66db20e7"},"assets/sounds/coin.m4a":{"hash":"ba9a150775359de1d808c0b24efd1cfa017cec8337d05c1a0a5d4660dc103207"},"assets/sounds/coin.ogg":{"hash":"0f30737b0f8d29d4a33c5d2ad9b0b61eb93b3a992dcf3a2fe59d6d9ee9db14a2"},"assets/sounds/fart11.m4a":{"hash":"41c368d7da6041ca1a516b9f0fc3e854bda22f4a9e28b32b9a5c810e692145ff"},"assets/sounds/fart11.ogg":{"hash":"dc2dbfabe5b44d28c1c1eb1c5e41b851d9d46beb6cdc1972677b67afe442ad26"},"assets/sounds/fart18.m4a":{"hash":"8f3e09ffd97ac930ef534899fd0d3f28e74153b67d04a6a4d52bf22d8dda2068"},"assets/sounds/fart18.ogg":{"hash":"a0db761f1cea2794247e6a2d2acd763ea678695c18075f8d6827d48bd060aaa4"},"assets/sounds/fart21.m4a":{"hash":"7b7aae9d28f384afbc30a850c15fac251de98221acdf6f4dcb5c61a80c275070"},"assets/sounds/fart21.ogg":{"hash":"9e36031e70553acc5abdc20442bfffa791d67abff34a4208eb499916fdd34fdb"},"assets/sounds/juicy_fart_21.m4a":{"hash":"fb0ce13d0d1a7878fda960223b1049b44e86cf115601e8addd1c3c6fe191c991"},"assets/sounds/juicy_fart_21.ogg":{"hash":"9d0d2e3cf84dbafe168b7f5d22e2cc58e0ba43170d20c5ea1e437463991c1bf4"},"assets/sounds/juicy_fart_24.m4a":{"hash":"9d1dc39c83f136c7ffbff8938cf9692c6522d6c84e49524fb955f4b56c26abc5"},"assets/sounds/juicy_fart_24.ogg":{"hash":"44919235fd4c229d193ff40e8acf26a5ac27e58021c01840189096a0472d3e5c"},"assets/sounds/jump.m4a":{"hash":"182950445da8e2d4dbca0a2f4dac280e5aed3e17681437d1dc819666fee860be"},"assets/sounds/jump.ogg":{"hash":"11c29665fe98d7ca59fefcef3bd261f9bab48c583220dae72862143cfe98cf33"},"assets/sounds/Punch1.m4a":{"hash":"58f528b50a74817455c9bd297819272d8bc33940f47ce6ae83324d6de9a0a0b2"},"assets/sounds/Punch1.ogg":{"hash":"2575846a5b993eda3829831a81862912245661c5be8e6ced91017551a310aba1"},"assets/rexx/belt-dead.png":{"hash":"895634801f8ce5180befc0ca6b8e0ba21c20a694367cf709630976b1d6eeaa63"},"assets/rexx/belt-fall1.png":{"hash":"2f37aea36318f43fae4535e0cb587ec9b381eec3224940286fe26ff759a8e902"},"assets/rexx/belt-fall2.png":{"hash":"b216c47cd05115dd58fbd7c0067f8066e943839ae8a49ff01e343c46afe2ebfa"},"assets/rexx/belt-fall3.png":{"hash":"49867319b29e30b080f050a8cb9b24dcdb491e4c58ef25e2feb344b5d3f9facf"},"assets/rexx/belt-hit.png":{"hash":"4e7a6c824c122b2db78424bcd09542688e7adc055e3c5d8f4bf45d7df57705fa"},"assets/rexx/belt-idle.png":{"hash":"3c0066fe8920a3d082bb1edd1ff4bfa09957ab237da3503c821f14fcddd0c9ee"},"assets/rexx/dead.png":{"hash":"55b8bd3e7642ff654dac4c53acb33c65858453e02280ff5facc8df900e5f6c29"},"assets/rexx/fall1.png":{"hash":"c54ae97ff45bf5b4812fb4b630f66f1ef72c14ad579785aca9bf92d363026d30"},"assets/rexx/fall2.png":{"hash":"92cca6803f1d0ca41143d225096d94bfdccc29b45576ff880e424cce9552dfe4"},"assets/rexx/fall3.png":{"hash":"c1736770fa041228da0e2c531747b31181b5554bb77109303c5fe2d9e2a1370a"},"assets/rexx/helmet-fall1.png":{"hash":"f841a4edfff9d50cdb76314ebbc0784ac465b630525b96c3cdc65d16849e828f"},"assets/rexx/helmet-fall2.png":{"hash":"b3f2294b72028a02f9dc08c06cd235ffdaab17a40a0881706e5fbc953ff69f0e"},"assets/rexx/helmet-fall3.png":{"hash":"729823852afd1e48e2466c0afc59524a8e81f19f2afb85fdf12144912920c9b6"},"assets/rexx/helmet-hit.png":{"hash":"2ee0623bf59efd55ea565ff5797c2c6edb96d26f49c65680ef589f40104a72d2"},"assets/rexx/helmet-idle.png":{"hash":"029599d2a3be1c0f517df003a563e1514c5c9c929469987b81c7e613604e4356"},"assets/rexx/hit.png":{"hash":"42f411473221ffcda1bd21857ee86c31bb828c5ec79f3f98a278766e5ecd28e0"},"assets/rexx/idle.png":{"hash":"77577bea9abfd5922a1b5a2a7f931098de73c0b60f65ddbe34e9234f5caa4019"},"assets/music/loop_game.m4a":{"hash":"1737b550bc30937cc3081c0fdbee907577ec5662be1a10d52af9c8da4a6ebc43"},"assets/music/loop_game.ogg":{"hash":"b4c047c6ec51dcd458e209ca8853f064a7610db5caed691af998b4ac3c458e4d"},"assets/kaiju/belt-dead.png":{"hash":"af9b269a34a6f987bc29d8e2e456ffd4faf4d72bee0670002083cafaf0d88a29"},"assets/kaiju/belt-fall1.png":{"hash":"a9e1e5ea31f106b0f6459d3593953229b9338fcf3229295f072d0d0607daf774"},"assets/kaiju/belt-fall2.png":{"hash":"e3ad98a3982eebe183741c0fe1f9fbd5a169f9468a7e433f4bc3ee428d25dc80"},"assets/kaiju/belt-fall3.png":{"hash":"d497e8ab2af3767a816f5cc345f36e75bfbb2893f21432870e54694a20af3b61"},"assets/kaiju/belt-hit.png":{"hash":"66b55680cf39aab603ac2065e5ee199736ff0ab529fc418ab24823a2f0f8aa48"},"assets/kaiju/belt-idle.png":{"hash":"a00917b19da6fb7754f4dfc4cd74acce4b14ed8a1610a84687430f2f1a4104f0"},"assets/kaiju/dead.png":{"hash":"8e5793a2865fd66d2100ae05296dc6a792c3c33f03fdd532136b63e55bb17154"},"assets/kaiju/fall1.png":{"hash":"c8696159259ac76efc4795ea14c2a4c99cd5f65c62901ae70d8705427ce0afbd"},"assets/kaiju/fall2.png":{"hash":"1ff6f355f4b8c3b64323d13c41473e5d2674bafd7847d9a24a73f557f657e2e2"},"assets/kaiju/fall3.png":{"hash":"d14f7e3ce847010a15a86d43ec4499d07a46da09dcf28e4cf21aa3968ef2d7d4"},"assets/kaiju/helmet-fall1.png":{"hash":"ef96f2d13fd713a2a94a0d1f8ccfa1cd24c5ea1d55b7f20d5309dbc2ab1a78e3"},"assets/kaiju/helmet-fall2.png":{"hash":"5eb4ebb409f42a4b22167c2420bde0bf5c77159105b43591f217872f6ceed20d"},"assets/kaiju/helmet-fall3.png":{"hash":"dbcb876607eaed8115ca3e81fec73bff930efa662c3c4c156f7557787be24d75"},"assets/kaiju/helmet-hit.png":{"hash":"2fffa0d3141b1c293d25481705bf4c5d89d05081be8f6f3a3fe531ec4b976501"},"assets/kaiju/helmet-idle.png":{"hash":"e89c8c4760107ede039f3284c7bd5e8f2b3bdd82bf299ba5886961ef76ac2a0b"},"assets/kaiju/hit.png":{"hash":"a7a29c2a79b035d5617e053d445e845a9c8efbfabcbe04e3ca5b97cdfd73b4e7"},"assets/kaiju/idle.png":{"hash":"5bfac054fcc6b6d45e9775c78c7dd0e6f8a87df58dcffdddbf51573f301e114f"}},
		FONTS: ["dimboitalic","dimboregular"],

		Point: function(x,y) {
			this.x = x;
			this.y = y;
		},

		isVisible: function() {
			return Visibility.state() == "visible";
		},

		addEventListener: function(event, cb) {
			var l = eventListenerList(event);

			var key;
			do {
				key = Math.floor(Math.random() * 10000000).toString();
			} while (l.hasOwnProperty(key));
			l[key] = cb;

			return key;
		},

		removeEventListener: function(event, listener) {
			var l = eventListenerList(event);
			if (typeof listener === "string") delete l[listener];
			else {
				for (key in l) {
					if (l[key] == listener) {
						delete l[key];
					}
				}
			}
		},

		dispatchEvent: function(event, args) {
			var l = eventListenerList(event);
			for (key in l) {
				var cb = l[key];
				try {
					cb.apply(null, args);
				} catch (e) {
					console.error("Error in event listener", e);
				}
			}
		},

		loadScript: function (url, done) {
			$.getScript(url)
				.done(function() {
					done(true);
				})
				.fail(function(jqxhr, settings, exception) {
					done(false, exception);
				});
		},

		createBuffer: function(width,height) {
			var buf = document.createElement("canvas");
			buf.width = width;
			buf.height = height;
			return buf;
		},

		fullscreenSupported: screenfull.enabled,

		isFullscreen: function() {
			return screenfull.isFullscreen;
		},

		setFullscreen: function(fs) {
			if (fs == this.isFullscreen) return;
			if (fs) screenfull.request();
			else screenfull.exit();
		},

		storagePut: function(key, value) {
			var v;
			switch (typeof value) {
				case "string":
				case "number":
				case "boolean":
					v = value.toString();
					break;
				case "object":
					v = JSON.stringify(value);
					break;
				default:
					throw new Error("Can't store value of type " + typeof value);
			}
			window.localStorage.setItem(this.namespace + "." + key, v);
		},

		storageGetString: function(key, fallback) {
			var k = this.namespace + "." + key;
			var v = window.localStorage.getItem(k);
			if (v == null) return fallback;
			else return v;
		},

		storageGetBoolean: function(key, fallback) {
			var k = this.namespace + "." + key;
			var v = window.localStorage.getItem(k);
			if (v == null) return fallback;
			else return v == "true";
		},

		storageGetNumber: function(key, fallback) {
			var k = this.namespace + "." + key;
			var v = window.localStorage.getItem(k);
			if (v == null) return fallback;
			else return parseFloat(v);
		},

		storageGetObject: function(key, fallback) {
			var k = this.namespace + "." + key;
			var v = window.localStorage.getItem(k);
			if (v == null) return fallback;
			else return JSON.parse(v);
		}

		// TODO focus property and listener

	};

	$.extend(tortilla.Point.prototype, {
		x: 0,
		y: 0
	});

	window.tortilla = tortilla;

	tortilla.parameters = {
		all: parseUrl().params,

		has: function(key) {
			return this.all.hasOwnProperty(key);
		},

		get: function(key, fallback) {
			if (this.has(key)) return this.all[key];
			else return fallback;
		}
	};

	var preInitSteps = 2;

	Visibility.onVisible(function() {
		if (Visibility.isSupported()) {
			Visibility.change(function(e) {
				tortilla.dispatchEvent(tortilla.EV_VISIBILITY_CHANGED, [tortilla.isVisible()]);
			});
		}
		initStepDone();
	});

	if (screenfull) {
	$(document).on(screenfull.raw.fullscreenchange, function () {
		tortilla.dispatchEvent(tortilla.EV_FULLSCREEN_CHANGED, [tortilla.isFullscreen()]);
	});
	}

	function initStepDone() {
		preInitSteps--;
		if (preInitSteps == 0) start();
	}

	$(document).ready(function() {
		if (tortilla.FONTS.length == 0) initStepDone();
		else {
			trace("Loading fonts");
			WebFont.load({
				custom: {
					families: tortilla.FONTS,
					urls: ["fonts.css?v=" + tortilla.BUILD_TIME]
				},
				active: function() {
					trace("Fonts loaded");
					initStepDone();
				},
				inactive: function() {
					trace("Fonts not loaded");
					initStepDone();
				}
			});
		}
	});

	function start() {

		var game = tortilla.game;

		var jCanvas = $("<canvas/>");
		$(document.body).append(jCanvas);

		var canvas = jCanvas[0];
		tortilla.canvas = canvas;
		var context = canvas.getContext("2d");
		tortilla.context = context;

		var gs = typeof(game.settings) === "function" ? game.settings() : {};
		tortilla.namespace = gs.namespace;

		var meter = null;
		if (gs.showFps) {
			meter = new FPSMeter();
		}

		var win = $(window);

		var dpr;
		if (window.devicePixelRatio) dpr = window.devicePixelRatio;
		else dpr = 1;

		tortilla.windowToCanvas = function(x, y) {
			return new tortilla.Point(x*dpr,y*dpr);
		};

		function sizeCanvas() {

			var ww = window.innerWidth ? window.innerWidth : win.width();
			var wh = window.innerHeight ? window.innerHeight : win.height();

			trace("canvas size " + ww + "x" + wh);

			canvas.width = ww * dpr;
			canvas.height = wh * dpr;

			if (dpr != 1) {
				jCanvas.css({width: ww + "px", height: wh + "px"});
			}

			tortilla.dispatchEvent(tortilla.EV_RESIZED, []);

		}
		win.resize(sizeCanvas);
		sizeCanvas();

		// prevent input events
		function pd(e) {
			if (!document.hasFocus()) window.focus();
			e.preventDefault();
		}
		document.addEventListener("click", pd);
		document.addEventListener("dblclick", pd);
		document.addEventListener("mousedown", pd);
		document.addEventListener("mouseup", pd);

		document.addEventListener("touchcancel", pd);
		document.addEventListener("touchend", pd);
		document.addEventListener("touchenter", pd);
		document.addEventListener("touchleave", pd);
		document.addEventListener("touchmove", pd);
		document.addEventListener("touchstart", pd);

//		document.addEventListener("keydown", kpd);
//		document.addEventListener("keyup", kpd);
//		document.addEventListener("keypress", kpd);

		if (typeof(game.init) === "function")
			game.init();

		if (typeof(game.frame) === "function") {

			var time = Date.now(); // TODO high precision timer
			function frame() {

				var now = Date.now();
				var dt = Math.min(1/15, (now-time)/1000);
				time = now;

				try {
					if (meter != null) meter.tick();
					game.frame(dt);
				} catch (e) {
					console.log("Error in frame", e);
					if (e instanceof Error && e.stack) console.error(e.stack);
					debugger;
					//if (42 < 1) alert("The end is here"); // you can place a breakpoint on this line
				}
				requestAnimationFrame(frame);

			}
			requestAnimationFrame(frame);

		}

	}

	function parseUrl() {

		// url params and self url
		var params = {};
		console.log(location);
		var selfUrl = location.href;
		for (var i = 0; i < 2; i++) {

			// # params come after ? params, so do # first (working from the back of the url string)
			var parChar = i == 0 ? "#" : "?";

			// extract param string
			var qin = selfUrl.indexOf(parChar);
			if (qin != -1) {

				var urlPartParams = selfUrl.substr(qin+1);
				selfUrl = selfUrl.substr(0, qin);

				// parse param string
				var pairs = urlPartParams.split("&");
				$.each(pairs, function(i,pair) {
					var parts = pair.split("=");
					params[decodeURIComponent(parts[0])] = parts.length > 1 ? decodeURIComponent(parts[1]) : null;
				});

			}

		}
		trace("Self URL: " + selfUrl);
		trace("Params");
		console.log(params);

		return {
			params: params,
			selfUrl: selfUrl
		};

	}

})();
