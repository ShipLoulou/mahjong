const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.registration = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                password: hash,
                score: req.body.score,
                connected: req.body.connected
            });

            user.save()
                .then(() => res.status(201).json({ message: '[ SUCCESS ] Utilisateur créé !' }))
                .catch(error => res.status(400).json({ message: '[ ERROR ]' + error }));
        })
        .catch(error => res.status(500).json({ message: '[ ERROR ]' + error }));
}

exports.login = (req, res, next) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        username: user.username,
                        token: jwt.sign(
                            { userId: user.id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });

                    // Changement de l'état de connection de l'utilisateur en 'true'.
                    User.update({ connected: true }, { where: { id: user.id } })
                })
                .catch(error => res.status(500).json({ message: '[ ERROR ]', error }));
        })
        .catch(error => res.status(500).json({ message: '[ ERROR ]', error }));
}

exports.logout = (req, res, next) => {
    User.update({ connected: false }, { where: { id: req.body.id } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "[ SUCCESS ] L'état de connexion de l'utilisateur à été modifier avec succès."
                });
            } else {
                res.status(401).send({
                    message: "[ ERROR ] Impossible de modifier l'état de connexion de l'utilisateur."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] erreur lors de la MAJ de l'état de connexion de l'utilisateur." + err
            });
        });
}

exports.editSocket = (req, res, next) => {
    User.update({ socket: req.body.socket }, { where: { id: req.body.id } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "[ SUCCESS ] Le socket à été modifier avec succès."
                });
            } else {
                res.status(401).send({
                    message: "[ ERROR ] Impossible de modifier le socket."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] erreur lors de la MAJ du socket de l'utilisateur." + err
            });
        });
}

exports.userConnected = (req, res, next) => {
    User.findAll({ where: { connected: true } })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ]" + err
            });
        });
}

exports.editScore = (req, res, next) => {
    User.update({ score: req.body.score }, { where: { id: req.body.id } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "[ SUCCESS ] Le score à été modifier avec succès."
                });
            } else {
                res.status(401).send({
                    message: "[ ERROR ] Impossible de modifier le score."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] erreur lors de la MAJ du score de l'utilisateur." + err
            });
        });
}

exports.getUser = (req, res, next) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: '[ ERROR ] utilisateur introuvable.' });
            }
            res.status(200).json(user);
        })
        .catch(error => res.status(500).json({ message: '[ ERROR ] utilisateur introuvable.', error }));
}