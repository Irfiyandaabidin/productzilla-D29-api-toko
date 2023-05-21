const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const key = 'qwertyuiop';
    if (authHeader !== key){
        res.status(401).send({
            msg: "Unauthorized"
        });
    }
    next();
}

module.exports = auth;