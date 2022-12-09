module.exports = callingFunc => (req, res, next) => {
    Promise.resolve(callingFunc(req, res, next)).catch(next);
}