function Response() {
    function r(data) {
        r.data = data;
        setTimeout(function() { //Hack to escape try
            r.onReply();
        }, 0);
    }
    r.data = {};
    r.hasErrors = false;
    r.errors = null;
    r.error = function(err) {
        r.hasErrors = true;
        r.errors = err;
        setTimeout(function() { //Hack to escape try
            r.onReply();
        },0);
    };
    r.onReply = function() {};

    return r;
}

module.exports = Response;