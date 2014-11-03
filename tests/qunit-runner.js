var testrunner = require('qunit');

testrunner.setup({
	log: {
		// log assertions overview
		assertions: true,
		// log expected and actual values for failed tests
		errors: true,
		// log tests overview
		tests: true,
		// log summary
		summary: true,
		// log global summary (all files)
		globalSummary: false,
		// log currently testing code file
		testing: true
	}
});

testrunner.run({
    code: "../dist/vignette.js",
    tests: "vignette.js"
}, function () { console.log('Done'); });
