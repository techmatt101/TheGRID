casper.options.viewportSize = { width: 1024, height: 768 };

casper.test.begin("The GRID", 2, function redditTest(test) {
    casper.start("http://127.0.0.1/", function() {
        test.assertTitleMatch(/The GRID/, "Title is what we'd expect");
    });

    casper.then(function() {
        casper.clickLabel('Get started', 'a');
    });

    casper.then(function() {
        casper.clickLabel('API Docs', 'a');
    });

    casper.then(function() {
        test.assertTitleMatch(/Apiary/, "Title is what we'd expect");
    });

    casper.run(function() {
        test.done();
    });
});