module.exports = async (req, res, next, con) => {
    con.execute(
        'SELECT * FROM `profile` WHERE `userID` = ?', [req.user.id], function (err, results, fields) {
            if (err) return next(err); // Gérer les erreurs potentielles
            if (results.length == 0) {
                req.db = null;
            } else {
                req.db = results[0];
            }
            if (req.isAuthenticated()) {
                return next();
            }
            return next(); // Appeler la fonction next() à la fin du middleware
        }
    );
};
