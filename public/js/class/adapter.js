export default class Adapter {
    constructor() {
        this.element1();
    }

    element1() {
        let largeur = document.documentElement.clientWidth;

        let source = document.querySelectorAll('.piece');

        let ok = document.querySelectorAll('.piece .transparent');
        source.forEach(item => {
            item.style.width = largeur / 18 + 'px';
            item.style.height = largeur / 13 + 'px';
        })

        ok.forEach(item => {
            item.style.width = largeur / 18 + 'px';
            item.style.height = largeur / 13 + 'px';
        })
    }
}