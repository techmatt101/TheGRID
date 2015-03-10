console.log("\n" +
    " __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __\n" +
    "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|\n" +
    "  _________  _      _  _______     _______  _______   _  ________  \n" +
    " |___   ___|| |    | ||  _____|   / ______||______ \\ | ||_______ \\ \n" +
    "     | |    | |____| || |___     | |  ____  ______| || | _      | |\n" +
    "     | |    |  ____  ||  ___|    | | |__  ||  ___  / | || |     | |\n" +
    "     | |    | |    | || |_____   | |____| || |   \\ \\ | || |_____| |\n" +
    "     |_|    |_|    |_||_______|   \\_______||_|    \\_\\|_||________/ \n" +
    " __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __\n" +
    "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|\n" +
    " \\__\\__\\__\\__\\__\\__\\__\\__\\__\\__\\_|_/__/__/__/__/__/__/__/__/__/__/"
);

function foo () {
    return true;
}

window.addEventListener('load', () => {
    var cvs = document.createElement("canvas");
    var ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    drawStars(ctx, window.innerWidth, window.innerHeight);
    document.body.style.backgroundImage = 'url(' + cvs.toDataURL('image/png')+ ')';
});

function drawStars (ctx, width, height) {
    var hmTimes = Math.round(width + height);
    for (var i = 0; i <= hmTimes; i++) {
        var randomX = Math.floor((Math.random() * width) + 1);
        var randomY = Math.floor((Math.random() * height) + 1);
        var randomSize = Math.floor((Math.random() * 2) + 1);
        var randomOpacityOne = Math.floor((Math.random() * 9) + 1);
        var randomOpacityTwo = Math.floor((Math.random() * 9) + 1);
        var randomHue = Math.floor((Math.random() * 360) + 1);
        if (randomSize > 1) {
            ctx.shadowBlur = Math.floor((Math.random() * 15) + 5);
            ctx.shadowColor = "white";
        }
        ctx.fillStyle = "hsla(" + randomHue + ", 30%, 80%, ." + randomOpacityOne + randomOpacityTwo + ")";
        ctx.fillRect(randomX, randomY, randomSize, randomSize);
    }
}