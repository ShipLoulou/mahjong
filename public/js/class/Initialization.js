export default class Initialization {
    constructor(dataPiece, dataFigure) {
        this.container = document.querySelector('.container');
        this.dataPiece = dataPiece;
        this.dataFigure = dataFigure;
        this.creatingPieces();
    }

    /**
     * Création des 144 pièces.
     */
    creatingPieces() {
        this.dataPiece.forEach(item => {
            // Création de la div .piece.
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.classList.add(item);

            // Création de div .transparent qui permet d'améliorer l'expérience utilisateur.
            const transparentDiv = document.createElement('div');
            transparentDiv.classList.add('transparent');
            piece.append(transparentDiv);

            this.container.append(piece);
        });
        this.creatingImages();
    }

    /**
     * Pour chaque image inséré dans la dossier './images', 4 images sont créer et sont inséré dans le tableau image
     */
    creatingImages() {
        const images = [];

        for (let index = 0; index < 4; index++) {
            this.dataFigure.forEach(item => {
                images.push(item);
            });
        }

        this.matchImagesToPieces(images);
    }

    /**
     * Génère un nombre aléatoire
     * @param {int} max nombre maximum
     * @returns retourne un nombre aléatoire entre 1 et max 
     */
    getRandomInt(max) {
        const min = 0;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Associe à l'emsemble des pièces une image et un code 
     * @param {array} images emsembles des images
     */
    matchImagesToPieces(images) {
        // Récupère l'emsemble des pièces
        const pieces = document.querySelectorAll('.piece');

        pieces.forEach(item => {
            if (images.length !== 0) {
                const randomInt = this.getRandomInt(images.length);
                // if () {génère l'emsemble des tuiles} else {génère la dernière tuile}
                if (images.length > 1) {
                    item.classList.add(images[randomInt].name)
                    const image = document.createElement('img');
                    image.src = `/images/tuiles/${images[randomInt].name}.png`;
                    item.append(image);
                    images.splice(randomInt, 1);
                } else {
                    const image = document.createElement('img');
                    item.classList.add(images[0].name)
                    image.src = `/images/tuiles/${images[0].name}.png`;
                    item.append(image);
                    images.shift();
                }
            }
        });
    }
}