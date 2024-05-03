const passSocket = (io) => async (req, res, next) => {
    try {
        req.io = io

        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = passSocket