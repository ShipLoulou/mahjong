export default class VerificationTouch {
    constructor(socket, players, ennemyUsername) {
        this.determinesPiecesToBeActivated(null);
        this.socket = socket;
        this.players = players;
        this.ennemyUsername = ennemyUsername;
        this.username = localStorage.getItem('username');
    }

    determinesPiecesToBeActivated(arrayPieces) {
        const numberStage = 3;

        const pieces = [];

        if (arrayPieces === null) {
            const balisePiece = document.querySelectorAll('.piece');
            balisePiece.forEach(item => {
                pieces.push(item);
            });
        } else {
            arrayPieces.forEach(item => {
                pieces.push(item);
            });
        }

        if (pieces.length === 0) {
            this.finish();
            return;
        }

        if (pieces.length === 2) {
            const piece1 = pieces[0];
            const piece1ClassList = piece1.classList[1];
            const piece1Item = piece1.classList[2];
            const piece1Split = piece1ClassList.split('-');
            const piece1WithoutStage = `${piece1Split[0]}-${piece1Split[1]}`;

            const piece2 = pieces[1];
            const piece2ClassList = piece2.classList[1];
            const piece2Item = piece1.classList[2];
            const piece2Split = piece2ClassList.split('-');
            const piece2WithoutStage = `${piece2Split[0]}-${piece2Split[1]}`;

            if (piece1WithoutStage === piece2WithoutStage) {
                piece1.classList.remove(piece1ClassList);
                piece1.classList.remove(piece1.classList[2]);
                piece1.classList.add('item6-09-0');
                piece1.classList.add(piece1Item);
                // const piece1Image = document.querySelector(`.${piece1ClassList} img`);
                // piece1Image.src = `/images/tuiles/${piece1Item}.png`;


                piece2.classList.remove(piece2ClassList);
                piece2.classList.remove(piece2.classList[2]);
                piece2.classList.add('item6-08-0');
                piece2.classList.add(piece2Item);
                // const piece2Image = document.querySelector(`.${piece2ClassList} img`);
                // piece2Image.src = `/images/tuiles/${piece2Item}.png`;
            }
        }


        for (let indexStage = 0; indexStage < numberStage; indexStage++) {
            const data = this.arrayWithPiecesPerStage(indexStage);

            const linesFromLeftSide = { line8: false, line7: false, line6: false, line5: false, line4: false, line3: false, line2: false, line1: false };

            for (let index = 0; index < 9; index++) {
                pieces.forEach(item => {
                    if (item.className[10] === `${index}` || item.classList[1] === 'item-rigth' || item.classList[1] === 'item-left1' || item.classList[1] === 'item-left2') {
                        if (linesFromLeftSide[`line${index}`] === false) {
                            const idPiece = item.classList[1];
                            if (data[index]?.includes(idPiece)) {
                                item.classList.add('active');
                                linesFromLeftSide[`line${index}`] = true;
                            }
                        }
                    }
                });
            }

            const pieceReverse = pieces.reverse();
            const linesFromRightSide = { line8: false, line7: false, line6: false, line5: false, line4: false, line3: false, line2: false, line1: false };

            for (let index = 1; index < 9; index++) {
                let indexDESC = 9 - index;
                pieceReverse.forEach(item => {
                    if (item.className[10] === `${indexDESC}` || item.classList[1] === 'item-rigth' || item.classList[1] === 'item-left1' || item.classList[1] === 'item-left2') {
                        if (linesFromRightSide[`line${indexDESC}`] === false) {
                            const idPiece = item.classList[1];
                            if (data[indexDESC]?.includes(idPiece)) {
                                item.classList.add('active');
                                linesFromRightSide[`line${indexDESC}`] = true;
                            }
                        }
                    }
                });
            }

        }

        this.activationManagementAccordingToStage(pieces);
    }

    activationManagementAccordingToStage(pieces) {

        for (let index = 0; index < 4; index++) {
            pieces.forEach(item => {
                const id = item.classList[1];
                const idSplit = id.split('-');
                const idWithoutStage = `${idSplit[0]}-${idSplit[1]}`;
                pieces.forEach(item2 => {
                    const id2 = item2.classList[1];
                    const idSplit2 = id2.split('-');
                    const idWithoutStage2 = `${idSplit2[0]}-${idSplit2[1]}`;
                    if (item.className[15] === `${index}` && item2.className[15] === `${index + 1}`) {
                        if (idWithoutStage === idWithoutStage2 && id !== id2) {
                            item.classList.remove('active');
                        }
                    }

                });
            })
        }

        let topPiecePresents = false;
        const piecesInLastStage = [];

        pieces.forEach(item => {
            const idLastItem = "item4-08-4";
            if (item.classList[1] === idLastItem) {
                item.classList.add('active')
                topPiecePresents = true;
            }
            if (item.className[15] === '3') {
                piecesInLastStage.push(item);
            }
        });

        piecesInLastStage.forEach(item => {
            if (topPiecePresents === false) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.help();
        this.clickDetection();
    }

    clickDetection() {
        let firstClick = null;
        let secondClick = null;

        // Sélectionne toutes les pièces actives
        const piecesActive = document.querySelectorAll('.active');

        this.randomMixing(piecesActive);

        piecesActive.forEach(item => {
            item.addEventListener('click', () => {
                // Sélectionne tous les pièces qui sont encore en jeu
                const allPieces = document.querySelectorAll('.piece');
                allPieces.forEach(piece => {
                    piece.classList.remove('surbri');
                });
                if (firstClick === null) {
                    firstClick = [item.classList[2], item.classList[1]];

                    const clickClass = document.querySelector(`.${item.classList[1]} div`)
                    if (clickClass !== null) {
                        clickClass.classList.add('choise');
                    }
                } else {
                    secondClick = [item.classList[2], item.classList[1]];
                    const clickClass = document.querySelector(`.${firstClick[1]} div`)
                    if (clickClass !== null) {
                        clickClass.classList.remove('choise');
                    }
                    if (firstClick[0] === secondClick[0] && firstClick[1] !== secondClick[1]) {
                        const pieceNumberOne = document.querySelector(`.${firstClick[1]}`);
                        const pieceNumberTwo = document.querySelector(`.${secondClick[1]}`);
                        if (pieceNumberTwo !== null) {
                            pieceNumberOne.remove();
                            pieceNumberTwo.remove();

                            const newAllPieces = document.querySelectorAll('.piece');

                            this.determinesPiecesToBeActivated(newAllPieces);

                            firstClick = null;
                            secondClick = null;
                        }
                    } else {
                        firstClick = null;
                        secondClick = null;
                    }
                }
            });
        });

    }

    /**
     * Retourne le tableau des pièces en fonction de l'étage.
     * @param {int} stage pièce pour l'étage 0 [0] - étage 1 [1] - étage 2 [2] - étage 3 [3]
     */
    arrayWithPiecesPerStage(stage) {

        let pieces = null;

        switch (stage) {
            case 0:
                pieces = {
                    '1': ['item1-14-0', 'item1-13-0', 'item1-12-0', 'item1-11-0', 'item1-10-0', 'item1-09-0', 'item1-08-0', 'item1-07-0', 'item1-06-0', 'item1-05-0', 'item1-04-0', 'item1-03-0'],
                    '2': ['item2-12-0', 'item2-11-0', 'item2-10-0', 'item2-09-0', 'item2-08-0', 'item2-07-0', 'item2-06-0', 'item2-05-0', 'item2-04-0'],
                    '3': ['item3-13-0', 'item3-12-0', 'item3-11-0', 'item3-10-0', 'item3-09-0', 'item3-08-0', 'item3-07-0', 'item3-06-0', 'item3-05-0', 'item3-04-0'],
                    '4': ['item-rigth', 'item4-14-0', 'item4-13-0', 'item4-12-0', 'item4-11-0', 'item4-10-0', 'item4-09-0', 'item4-08-0', 'item4-07-0', 'item4-06-0', 'item4-05-0', 'item4-04-0', 'item4-03-0', 'item-left2', 'item-left1'],
                    '5': ['item-rigth', 'item5-14-0', 'item5-13-0', 'item5-12-0', 'item5-11-0', 'item5-10-0', 'item5-09-0', 'item5-08-0', 'item5-07-0', 'item5-06-0', 'item5-05-0', 'item5-04-0', 'item5-03-0', 'item-left2', 'item-left1'],
                    '6': ['item6-13-0', 'item6-12-0', 'item6-11-0', 'item6-10-0', 'item6-09-0', 'item6-08-0', 'item6-07-0', 'item6-06-0', 'item6-05-0', 'item6-04-0'],
                    '7': ['item7-12-0', 'item7-11-0', 'item7-10-0', 'item7-09-0', 'item7-08-0', 'item7-07-0', 'item7-06-0', 'item7-05-0'],
                    '8': ['item8-14-0', 'item8-13-0', 'item8-12-0', 'item8-11-0', 'item8-10-0', 'item8-09-0', 'item8-08-0', 'item8-07-0', 'item8-06-0', 'item8-05-0', 'item8-04-0', 'item8-03-0']
                };
                break;

            case 1:
                pieces = {
                    '2': ['item2-11-1', 'item2-10-1', 'item2-09-1', 'item2-08-1', 'item2-07-1', 'item2-06-1'],
                    '3': ['item3-11-1', 'item3-10-1', 'item3-09-1', 'item3-08-1', 'item3-07-1', 'item3-06-1'],
                    '4': ['item4-11-1', 'item4-10-1', 'item4-09-1', 'item4-08-1', 'item4-07-1', 'item4-06-1'],
                    '5': ['item5-11-1', 'item5-10-1', 'item5-09-1', 'item5-08-1', 'item5-07-1', 'item5-06-1'],
                    '6': ['item6-11-1', 'item6-10-1', 'item6-09-1', 'item6-08-1', 'item6-07-1', 'item6-06-1'],
                    '7': ['item7-11-1', 'item7-10-1', 'item7-09-1', 'item7-08-1', 'item7-07-1', 'item7-06-1'],
                };
                break;

            case 2:
                pieces = {
                    '3': ['item3-10-2', 'item3-09-2', 'item3-08-2', 'item3-07-2'],
                    '4': ['item4-10-2', 'item4-09-2', 'item4-08-2', 'item4-07-2'],
                    '5': ['item5-10-2', 'item5-09-2', 'item5-08-2', 'item5-07-2'],
                    '6': ['item6-10-2', 'item6-09-2', 'item6-08-2', 'item6-07-2'],
                };
                break;

            case 3:
                pieces = {
                    '4': ['item4-09-3', 'item4-08-3'],
                    '5': ['item5-09-3', 'item5-08-3'],
                };
                break;
        }
        return pieces;
    }

    /**
     * Permet de trier un tableau dans un ordre aléatoire
     * @param {array} tab tableau des pieces
     * @returns tableau dans un ordre aléatoire
     */
    randomize(tab) {
        let i, j, tmp;
        for (i = tab.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = tab[i];
            tab[i] = tab[j];
            tab[j] = tmp;
        }
        return tab;
    }

    /**
     * 
     * @param {*} piecesActive 
     */
    randomMixing(piecesActive) {
        let activePiecesAvailable = false;

        piecesActive.forEach(item => {
            const pieceCurrent = item;
            piecesActive.forEach(piece => {
                if (pieceCurrent.classList[2] === piece.classList[2] && pieceCurrent.classList[1] !== piece.classList[1]) {
                    activePiecesAvailable = true;
                }
            });
        });

        if (activePiecesAvailable === false) {
            const arrayPiece = document.querySelectorAll('.piece');
            const arrayFigure = [];

            arrayPiece.forEach(item => {
                arrayFigure.push(item.classList[2]);
            })

            const tab = this.randomize(arrayFigure);

            let index = 0;
            arrayPiece.forEach(item => {
                const name = item.classList[1];
                const currentClass = item.classList[2];
                const newClass = tab[index];
                item.classList.remove('active');
                item.classList.remove(currentClass);
                item.classList.add(newClass)
                const image = document.querySelector(`.${name} img`);
                image.src = `/images/tuiles/${newClass}.png`;
                index++;
            });


            const arrayPieces = document.querySelectorAll('.piece');

            this.determinesPiecesToBeActivated(arrayPieces);
        }
    }

    help() {
        const allPiece = document.querySelectorAll('.piece');
        const arrayPece = [];

        allPiece.forEach(item => {
            if (item.classList[3] === undefined) {
                arrayPece.push(item);
            }
        });

        arrayPece.forEach(item => {
            item.addEventListener('click', () => {
                arrayPece.forEach(element => {
                    element.classList.add('surbri')
                });
            })
        });
    }

    finish() {
        if (this.socket === undefined) {
            this.setTurnMessage(`Félicitations, tu as gagné la partie !`)
            return;
        }
        this.players.forEach(player => {
            if (player.username === this.username) {
                player.win = true;
                this.socket.emit('play', player)
            }
        });
    }

    setTurnMessage(html) {
        finishContainer.classList.add('d-flex');
        finishMsg.innerHTML = html;
    }
}