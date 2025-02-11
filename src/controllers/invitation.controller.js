const Invitation = require('../models/invitation.model');

exports.createInvitation = (req, res, next) => {
    const invitation = new Invitation({
        roomId: req.body.roomId,
        usernameHost: req.body.usernameHost,
        socketHost: req.body.socketHost,
        usernameEnnemy: req.body.usernameEnnemy,
        socketEnnemy: req.body.socketEnnemy,
        accept: req.body.accept
    });

    invitation.save()
        .then(() => res.status(201).json({ message: '[ SUCCESS ] Invitation créé !' }))
        .catch(error => res.status(500).json({ message: '[ ERROR ]' + error }));
}

exports.editResponse = (req, res, next) => {
    Invitation.update({ accept: req.body.accept }, { where: { roomId: req.body.roomId } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "[ SUCCESS ] La réponse de l'invitation à été envoyer avec succès."
                });
            } else {
                res.status(401).send({
                    message: "[ ERROR ] Impossible de répondre à l'invitation."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] erreur lors de la MAJ du status de l'invitation." + err
            });
        });
}

exports.deleteInvitation = (req, res, next) => {
    Invitation.destroy({ where: { roomId: req.body.roomId } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "[ SUCCESS ] L'invitation à bien été supprimé."
                });
            } else {
                res.status(401).send({
                    message: "[ ERROR ] Impossible de supprimer l'invitation."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] erreur lors de la suppression de l'invitation." + err
            });
        });
}

exports.getEnnemyInvitations = (req, res, next) => {
    Invitation.findAll({ where: { usernameEnnemy: req.body.username } })
        .then(invitations => {
            res.status(200).json(invitations)
        })
        .catch(err => {
            res.status(500).send({
                message: "[ ERROR ] invitation introuvable" + err
            });
        });
}