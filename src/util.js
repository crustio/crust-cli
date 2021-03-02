function withHelper(arg, err, handler) {
    if (!arg) {
        err();
    } else {
        handler();
    }
}

module.exports = {
    withHelper,
}