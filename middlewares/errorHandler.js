const handleErrors = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        console.error('handleErrors: ', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = handleErrors;
