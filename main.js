import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;
    const fullScreenButton = document.getElementById('fullScreenButton');

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.fontSize = 30;
            this.fontFamily = 'Creepster';
            this.speed = 0;
            this.maxSpeed = 2;
            this.background = new Background(this);
            this.player = new Player(this);
            this.UI = new UI(this);
            this.input = new InputHandler(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 30;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.bgMusic = new Audio();
            this.bgMusic.src = './audio/bgmusic2.mp3';
            this.gameOverMusic = new Audio();
            this.gameOverMusic.src = './audio/gameOver.wav';
            this.victoryMusic = new Audio();
            this.victoryMusic.src = './audio/gameovervictory.ogg';
            this.isUserInteracted = false;
        }
        restart() {
            this.speed = 0;
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.debug = false;
            this.score = 0;
            this.time = 0;
            this.lives = 5;
            this.gameOverMusic.pause();
            this.gameOverMusic.currentTime = 0;
            this.isUserInteracted = false;
        }
        update(deltaTime) {
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            // handle particles
            this.particles.forEach((particle) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            };
            // handle collision sprites
            this.collisions.forEach((collision) => {
                collision.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(ctx);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    function restartGame() {
        game.gameOver = false;
        game.restart();
        game.player.restart();
        game.background.restart();
        animate(0);
    }

    this.window.addEventListener('keydown', e => {
        if (e.key === ' ' && game.gameOver) {
            restartGame();
            game.victoryMusic.pause();
            game.victoryMusic.currentTime = 0;
            game.gameOverMusic.pause();
            game.gameOverMusic.currentTime = 0;
        };
    });

    this.window.addEventListener('touchstart', e => {
        if (e.changedTouches && game.gameOver) {
            restartGame();
            game.victoryMusic.pause();
            game.victoryMusic.currentTime = 0;
            game.gameOverMusic.pause();
            game.gameOverMusic.currentTime = 0;
        }
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    fullScreenButton.addEventListener('click', toggleFullScreen);

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (game.isUserInteracted) game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) {
            if (game.input.keys.length > 0) {
                game.isUserInteracted = true;
                game.bgMusic.play();
            };
            requestAnimationFrame(animate);
        } else {
            if (game.score > game.winningScore) {
                game.bgMusic.pause();
                game.bgMusic.currentTime = 0;
                game.victoryMusic.play();
            } else {
                game.bgMusic.pause();
                game.bgMusic.currentTime = 0;
                game.gameOverMusic.play();
            }
        };
    }
    animate(0);
});