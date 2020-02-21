QUnit.module('Vignette tests');

QUnit.test('Vignette creates thumbnail URL', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			options: {
				mode: Vignette.mode.topCrop,
				width: 500,
				height: 200
			},
			expectedOutput: 'https://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
				'/top-crop/width/500/height/200?cb=20130614225714'
		},
		{
			url: 'http://static.igor.wikia-dev.us/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			options: {
				mode: Vignette.mode.topCrop,
				width: 500,
				height: 200
			},
			expectedOutput: 'https://vignette.wikia-dev.us/thelastofus/images/9/99/Robert.png/revision/latest' +
				'/top-crop/width/500/height/200?cb=20130614225714'
		},
		{
			url: 'http://static.igor.wikia-dev.pl/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			options: {
				mode: Vignette.mode.topCrop,
				width: 500,
				height: 200
			},
			expectedOutput: 'https://vignette.wikia-dev.pl/thelastofus/images/9/99/Robert.png/revision/latest' +
				'/top-crop/width/500/height/200?cb=20130614225714'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.fixedAspectRatio,
				width: 100,
				height: 100
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/fixed-aspect-ratio/width/100/height/100?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.scaleToWidth,
				width: 100,
				height: 100
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/scale-to-width/100?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.windowCrop,
				width: 100,
				height: 100,
				xOffset1: 10,
				yOffset1: 10,
				xOffset2: 90,
				yOffset2: 90
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/window-crop/width/100/x-offset/10/y-offset/10/window-width/80/window-height/80?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.windowCrop,
				width: 100,
				height: 100,
				xOffset1: 0,
				yOffset1: 0,
				xOffset2: 90,
				yOffset2: 90
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/window-crop/width/100/x-offset/0/y-offset/0/window-width/90/window-height/90?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.windowCropFixed,
				width: 100,
				height: 100,
				xOffset1: 10,
				yOffset1: 10,
				xOffset2: 90,
				yOffset2: 90
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/window-crop-fixed/width/100/height/100/x-offset/10/y-offset/10/window-width/80/window-height/80' +
				'?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			options: {
				mode: Vignette.mode.windowCropFixed,
				width: 100,
				height: 100,
				xOffset1: 0,
				yOffset1: 0,
				xOffset2: 90,
				yOffset2: 90
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/window-crop-fixed/width/100/height/100/x-offset/0/y-offset/0/window-width/90/window-height/90' +
				'?cb=20100311231730'
		},
		{
			url: 'http://static.igor.wikia-dev.com/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			// With no options passed, should return a Vignette URL to a full-size image
			expectedOutput: 'https://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
				'?cb=20130614225714'
		},
		{
			url: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest'
		},
		{
			url: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg?cb=123',
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest?cb=123'
		}
	];

	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(testCase.url, testCase.options),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Vignette creates thumbnail mode from existing Vignette URL', function () {
	var testCases = [
		{
			url: 'https://vignette3.wikia.nocookie.net/scrubs/images/4/46/S8-HQ-Elliot-4.jpg/revision/latest?cb=20091115204314',
			options: {
				mode: Vignette.mode.thumbnailDown,
				width: 100,
				height: 100
			},
			expectedOutput: 'https://vignette3.wikia.nocookie.net/scrubs/images/4/46/S8-HQ-Elliot-4.jpg/revision/latest' +
				'/thumbnail-down/width/100/height/100?cb=20091115204314'
		},
		{
			url: 'https://vignette2.wikia.nocookie.net/scrubs/images/c/cf/8x1_Janitor_fired.jpg/revision/latest' +
				'/scale-to-width/400?cb=20090108012745',
			options: {
				mode: Vignette.mode.windowCrop,
				width: 100,
				height: 100,
				xOffset1: 10,
				yOffset1: 10,
				xOffset2: 90,
				yOffset2: 90
			},
			expectedOutput: 'https://vignette2.wikia.nocookie.net/scrubs/images/c/cf/8x1_Janitor_fired.jpg/revision/latest' +
				'/window-crop/width/100/x-offset/10/y-offset/10/window-width/80/window-height/80?cb=20090108012745'
		},
		{
			url: 'https://vignette3.wikia.nocookie.net/scrubs/images/4/46/S8-HQ-Elliot-4.jpg/revision/latest' +
				'/fixed-aspect-ratio/width/90/height/90?cb=20091115204314',
			// With no options passed, should return a Vignette URL to a full-size image
			expectedOutput: 'https://vignette3.wikia.nocookie.net/scrubs/images/4/46/S8-HQ-Elliot-4.jpg/revision/latest' +
				'?cb=20091115204314'
		},
		{
			url: 'https://vignette.wikia.nocookie.net/muppet/images/8/82/Muppet.JPG/revision/latest?cb=20080223040055',
			options: {
				mode: Vignette.mode.smart,
				width: 250,
				height: 150
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/8/82/Muppet.JPG/revision/latest/smart/width/250/height/150?cb=20080223040055'
		}
	];

	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(testCase.url, testCase.options),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer verifies thumbnailer URL', function () {
	var testCases = [
		{
			url: 'https://vignette.wikia-dev.com/thelastofus/9/99/Robert.png',
			expectedOutput: true
		},
		{
			url: 'https://vignette.wikia-dev.us/thelastofus/9/99/Robert.png',
			expectedOutput: true
		},
		{
			url: 'https://vignette.wikia-dev.pl/thelastofus/9/99/Robert.png',
			expectedOutput: true
		},
		{
			url: 'https://vignette-poz.wikia-dev.com/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'https://vignette-poz.wikia-dev.us/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'https://vignette-poz.wikia-dev.pl/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'https://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: true
		},
		{
			url: 'https://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: false
		},
		{
			url: 'http://static.igor.wikia-dev.pl/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: false
		},
		{
			url: 'http://static.igor.wikia-dev.us/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: false
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
				'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: false
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: false
		},
		{
			url: 'https://vignette.fandom-dev.pl/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'https://static.fandom-dev.pl/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'https://static.wikia-dev.pl/thelastofus/9/99/Robert.png/revision/latest',
			expectedOutput: true
		}
	];

	testCases.forEach(function (testCase) {
		equal(Vignette.isThumbnailerUrl(testCase.url), testCase.expectedOutput, testCase.url);
	});
});

QUnit.test('Thumbnailer verifies legacy URL', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: true
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
				'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: true
		},
		{
			url: 'https://vignette.wikia-dev.com/thelastofus/9/99/Robert.png',
			expectedOutput: false
		},
		{
			url: 'https://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: false
		}
	];

	testCases.forEach(function (testCase) {
		equal(Vignette.isLegacyUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer parses legacy URL and returns list of parameters', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: {
				domain: 'wikia-dev.com',
				cacheBuster: '20100311231730',
				wikiaBucket: 'muppet/images',
				pathPrefix: '',
				imagePath: 'd/d9/Jim-and-jim.jpg'
			}
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
				'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20140419225911',
				wikiaBucket: 'thelastofus/images',
				pathPrefix: '',
				imagePath: 'e/ef/Ellie.png'
			}
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '0',
				wikiaBucket: 'common/avatars',
				pathPrefix: '',
				imagePath: '7/7c/1271044.png'
			}
		}
	];

	testCases.forEach(function (testCase) {
		deepEqual(Vignette.getParametersFromLegacyUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer creates thumb URL from list of parameters', function () {
	var testCases = [
		{
			urlParameters: {
				domain: 'wikia-dev.com',
				cacheBuster: '20130614225714',
				wikiaBucket: 'thelastofus/images',
				imagePath: '9/99/Robert.png'
			},
			options: {
				mode: Vignette.mode.topCrop,
				width: 500,
				height: 100
			},
			expectedOutput: 'https://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
				'/top-crop/width/500/height/100?cb=20130614225714'
		},
		{
			urlParameters: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20100311231730',
				wikiaBucket: 'muppet/images',
				imagePath: 'd/d9/Jim-and-jim.jpg'
			},
			options: {
				mode: Vignette.mode.fixedAspectRatio,
				width: 300,
				height: 150
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
				'/fixed-aspect-ratio/width/300/height/150?cb=20100311231730'
		},
		{
			urlParameters: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '0',
				wikiaBucket: 'common/avatars',
				imagePath: '7/7c/1271044.png'
			},
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 100,
				height: 100
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest' +
				'/zoom-crop/width/100/height/100?cb=0'
		},
		{
			urlParameters: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20100311231982',
				wikiaBucket: 'common/avatars',
				imagePath: '7/7c/1271044.png'
			},
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 100,
				height: 100,
				frame: '2'
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest' +
				'/zoom-crop/width/100/height/100?cb=20100311231982&frame=2'
		}
	];

	testCases.forEach(function (testCase) {
		equal(
			Vignette.createThumbnailUrl(
				testCase.urlParameters,
				testCase.options
			),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer creates thumb URL for domains with prefixes', function () {
	var testCases = [
		{
			url: 'http://img2.wikia.nocookie.net/__cb20070118203456/memoryalpha/en/images/3/3e/Picard_on_holiday.jpg',
			options: {
				mode: Vignette.mode.topCrop,
				width: 300,
				height: 300
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/memoryalpha/images/3/3e/Picard_on_holiday.jpg/revision/latest' +
				'/top-crop/width/300/height/300?cb=20070118203456&path-prefix=en'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/poznan/bg/images/4/49/IMG_0035.jpg',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/poznan/images/4/49/IMG_0035.jpg/revision/latest' +
				'/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=bg'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/p__/psychusa/images/a/ab/Upload2.jpg',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/p__/images/a/ab/Upload2.jpg/revision/latest' +
				'/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=psychusa'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/p__/pokemanshop/zh/images/1/11/002.jpg',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/p__/images/1/11/002.jpg/revision/latest' +
				'/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=pokemanshop/zh'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20111213104442/swtor/ru/images/thumb/f/fe/Jediknightnew_icon.png' +
				'/200px-43%2C286%2C0%2C121-Jediknightnew_icon.png',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette.wikia.nocookie.net/swtor/images/f/fe/Jediknightnew_icon.png/revision/latest' +
				'/zoom-crop/width/150/height/260?cb=20111213104442&path-prefix=ru'
		}
	];
	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(testCase.url, testCase.options),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer creates thumb URL for new UUID based URLs', function () {
	var testCases = [
		{
			url: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5/',
			options: {
				mode: Vignette.mode.topCrop,
				width: 300,
				height: 300
			},
			expectedOutput: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5' +
			'/top-crop/width/300/height/300'
		},
		{
			url: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5' +
			'/zoom-crop/width/150/height/260'
		},
		{
			url: 'https://vignette-poz.wikia-dev.com/C8A832D4-7BE6-4748-BE94-ED09876547B5',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette-poz.wikia-dev.com/C8A832D4-7BE6-4748-BE94-ED09876547B5' +
			'/zoom-crop/width/150/height/260'
		},
		{
			url: 'http://vignette.wikia-dev.pl/f4291758-ffd8-479f-be5f-b19cf5cd6c2d',
			options: {
				mode: Vignette.mode.smart,
				width: 300,
				height: 300
			},
			expectedOutput: 'http://vignette.wikia-dev.pl/f4291758-ffd8-479f-be5f-b19cf5cd6c2d/smart/width/300/height/300'
		},
	];
	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(testCase.url, testCase.options),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer recognizes vignette URLs vs static.wikia.nocookie.net/ Urls with suffix', function () {
	var testCases = [
		{
			url: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5/',
			options: {
				mode: Vignette.mode.topCrop,
				width: 300,
				height: 300
			},
			expectedOutput: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5' +
			'/top-crop/width/300/height/300'
		},
		{
			url: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://vignette-poz.wikia-dev.com/c8a832d4-7be6-4748-be94-ed09876547b5' +
			'/zoom-crop/width/150/height/260'
		},
		{
			url: 'https://static.wikia.nocookie.net/6f2431a7-19de-494c-91d0-391536b44377/fixed-aspect-ratio/width/128/height/128',
			options: {
				mode: Vignette.mode.scaleToWidth,
				width: 256,
				height: 512
			},
			expectedOutput: 'https://static.wikia.nocookie.net/6f2431a7-19de-494c-91d0-391536b44377' +
			'/scale-to-width/256'
		},
		{
			url: 'https://static.fandom-dev.us/c8a832d4-7be6-4748-be94-ed09876547b5',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://static.fandom-dev.us/c8a832d4-7be6-4748-be94-ed09876547b5' +
				'/zoom-crop/width/150/height/260'
		},
		{
			url: 'https://static.fandom-dev.pl/c8a832d4-7be6-4748-be94-ed09876547b5',
			options: {
				mode: Vignette.mode.zoomCrop,
				width: 150,
				height: 260
			},
			expectedOutput: 'https://static.fandom-dev.pl/c8a832d4-7be6-4748-be94-ed09876547b5' +
				'/zoom-crop/width/150/height/260'
		},
	];
	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(testCase.url, testCase.options),
			testCase.expectedOutput
		);
	});
});
