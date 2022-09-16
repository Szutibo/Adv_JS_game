export class InputHandler {
    constructor(game, boostBtn) {
        this.game = game;
        this.boostBtn = boostBtn;
        this.keys = [];
        this.touchX = '';
        this.touchY = '';
        this.touchTreshold = 30;

        // desktop
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' || e.key === 's') && this.keys.indexOf('ArrowDown') === -1) {
                this.keys.push('ArrowDown');
            };
            if ((e.key === 'ArrowUp' || e.key === 'w') && this.keys.indexOf('ArrowUp') === -1) {
                this.keys.push('ArrowUp');
            };
            if ((e.key === 'ArrowRight' || e.key === 'd') && this.keys.indexOf('ArrowRight') === -1) {
                this.keys.push('ArrowRight');
            };
            if ((e.key === 'ArrowLeft' || e.key === 'a') && this.keys.indexOf('ArrowLeft') === -1) {
                this.keys.push('ArrowLeft');
            };
            if (e.key === 'Enter' && this.keys.indexOf('Enter') === -1) this.keys.push('Enter');
            if (e.key === 'b') this.game.debug = !this.game.debug;
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.splice(this.keys.indexOf('ArrowLeft'), 1);
            if (e.key === 'Enter') this.keys.splice(this.keys.indexOf('Enter'), 1);
        });

        // mobile
        window.addEventListener('touchstart', e => {
            [...e.changedTouches].forEach(touch => {
                if (touch.pageX < this.game.width * 0.35) {
                    if (this.keys.indexOf('Enter') === -1) this.keys.push('Enter');
                };
                if (touch.pageX > this.game.width * 0.5) {
                    this.touchX = touch.pageX;
                    this.touchY = touch.pageY;
                };
            });

        });
        window.addEventListener('touchmove', e => {
            let swipeDistanceX = 0;
            let swipeDistanceY = 0;
            [...e.changedTouches].forEach(touch => {
                if (touch.pageX > this.game.width * 0.5) {
                    swipeDistanceX = touch.pageX - this.touchX;
                    swipeDistanceY = touch.pageY - this.touchY;
                };
            });
            if (swipeDistanceX > this.touchTreshold && this.keys.indexOf('swipe left') === -1) this.keys.push('swipe left');
            if (swipeDistanceX < -this.touchTreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
            if (swipeDistanceY < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
            if (swipeDistanceY > this.touchTreshold && this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down');
        });
        window.addEventListener('touchend', e => {
            if (this.keys.indexOf('swipe left') !== -1) this.keys.splice(this.keys.indexOf('swipe left'), 1);
            if (this.keys.indexOf('swipe right') !== -1) this.keys.splice(this.keys.indexOf('swipe right'), 1);
            if (this.keys.indexOf('swipe up') !== -1) this.keys.splice(this.keys.indexOf('swipe up'), 1);
            if (this.keys.indexOf('swipe down') !== -1) this.keys.splice(this.keys.indexOf('swipe down'), 1);
            if (e.touches.length === 0 && this.keys.indexOf('Enter') !== -1) {
                this.keys.splice(this.keys.indexOf('Enter'), 1);
            };
        });
    }
}