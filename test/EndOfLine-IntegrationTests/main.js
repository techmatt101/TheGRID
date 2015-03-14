casper.options.viewportSize = {width: 1024, height: 768};

casper.test.begin("The GRID", 1, function redditTest(test) {
    casper.start("http://127.0.0.1/", function() {
        test.assertTitleMatch(/The GRID/, "Title is what we'd expect");
        casper.clickLabel('Dashboard', 'a');
    });

    casper.then(function() {
        casper.capture("tmp/screen-shot.png");
    });

    casper.run(function() {
        test.done();
    });
});