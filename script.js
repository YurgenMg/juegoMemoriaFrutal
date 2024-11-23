// script.js
/*
const cards = [
    { name: 'aguacate', img: 'Images/aguacate-150x150.jpg' },
    { name: 'banana', img: 'Images/bananos-150x150.jpg' },
    { name: 'cereza', img: 'Images/cerezas-150x150.jpg' },
    { name: 'arandanos', img: 'Images/arandanos-150x150.jpg' },
    { name: 'limon', img: 'Images/limones-150x150.jpg' },
    { name: 'mandarina', img: 'Images/mandarinas-150x150.jpg' },
    { name: 'mango', img: 'Images/mango-150x150.jpg' },
    { name: 'fresa', img: 'Images/fresas-150x150.jpg' },
];

const gameBoard = document.getElementById('tablero');
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('tarjeta');
    cardElement.dataset.name = card.name;

    const frontFace = document.createElement('div');
    frontFace.classList.add('delantera');
    frontFace.style.backgroundImage = `url(${card.img})`;

    const backFace = document.createElement('div');
    backFace.classList.add('trasera');

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);

    cardElement.addEventListener('click', flipCard);

    return cardElement;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('volteada')) {
        this.classList.add('volteada');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.name === card2.dataset.name) {
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cards.length) {
            alert('¡Ganaste!');
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('volteada');
            card2.classList.remove('volteada');
            flippedCards = [];
        }, 1000);
    }
}

function startGame() {
    const shuffledCards = shuffle([...cards, ...cards]);
    gameBoard.innerHTML = '';
    shuffledCards.forEach(card => {
        gameBoard.appendChild(createCard(card));
    });
}

document.getElementById('iniciar').addEventListener('click', startGame);*/

/**
 * Configuración global del juego
 */
const CONFIG = {
    GAME_TIME: 180,        // 3 minutos en segundos
    FLIP_DELAY: 1000,      // Tiempo para mostrar cartas no coincidentes (ms)
    VICTORY_DELAY: 500,    // Retraso antes de mostrar mensaje de victoria (ms)
    PAIRS_TO_WIN: 8,       // Número de parejas necesarias para ganar
    LOCALE: 'es-ES'        // Configuración regional para fechas
};

/**
 * Datos de las cartas del juego
 */
const CARDS = [
    { name: 'aguacate', img: 'Images/aguacate-150x150.jpg' },
    { name: 'banana', img: 'Images/bananos-150x150.jpg' },
    { name: 'cereza', img: 'Images/cerezas-150x150.jpg' },
    { name: 'arandanos', img: 'Images/arandanos-150x150.jpg' },
    { name: 'limon', img: 'Images/limones-150x150.jpg' },
    { name: 'mandarina', img: 'Images/mandarinas-150x150.jpg' },
    { name: 'mango', img: 'Images/mango-150x150.jpg' },
    { name: 'fresa', img: 'Images/fresas-150x150.jpg' }
];

/**
 * Clase principal del juego de memoria
 */
class MemoryGame {
    constructor() {
        this.initializeElements();
        this.initializeGameState();
        this.initializeEventListeners();
        this.startDateTimeUpdate();
    }

    /**
     * Inicializa las referencias a elementos del DOM
     */
    initializeElements() {
        this.gameBoard = document.getElementById('tablero');
        this.iniciarBtn = document.getElementById('iniciar');
        this.reiniciarBtn = document.getElementById('reiniciar');
        this.recargarBtn = document.getElementById('recargar');
        this.tiempoElement = document.getElementById('tiempo');
        this.parejasElement = document.getElementById('contador-parejas');
    }

    /**
     * Inicializa el estado del juego
     */
    initializeGameState() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timer = null;
        this.timeRemaining = CONFIG.GAME_TIME;
        this.isPlaying = false;
    }

    /**
     * Inicializa los event listeners
     */
    initializeEventListeners() {
        this.iniciarBtn.addEventListener('click', () => this.startGame());
        this.reiniciarBtn.addEventListener('click', () => this.restartGame());
        this.recargarBtn.addEventListener('click', () => this.reloadPage());
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Inicia la actualización de fecha y hora
     */
    startDateTimeUpdate() {
        setInterval(() => {
            const now = new Date();
            document.getElementById('fecha-hora').textContent = 
                now.toLocaleString(CONFIG.LOCALE);
        }, 1000);
    }

    /**
     * Maneja los eventos de teclado
     */
    handleKeyboard(e) {
        if (e.code === 'Space' && !this.isPlaying) {
            this.startGame();
        }
    }

    /**
     * Inicia el juego
     */
    startGame() {
        this.resetGame();
        this.setupGameBoard();
        this.startTimer();
        this.isPlaying = true;
        this.iniciarBtn.disabled = true;
        this.reiniciarBtn.disabled = false;
    }

    /**
     * Reinicia el juego
     */
    restartGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timeRemaining = CONFIG.GAME_TIME;
        this.gameBoard.innerHTML = '';
        this.tiempoElement.textContent = this.formatTime(this.timeRemaining);
        this.parejasElement.textContent = CONFIG.PAIRS_TO_WIN.toString();
        this.iniciarBtn.disabled = false;
        this.reiniciarBtn.disabled = true;
        const cards = this.gameBoard.querySelectorAll('.tarjeta');
        cards.forEach(card => {
            card.classList.remove('volteada', 'encontrada');
        });
        this.startGame();
    }

    /**
     * Reinicia el estado del juego
     */
    resetGame() {
        clearInterval(this.timer);
        this.gameBoard.innerHTML = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timeRemaining = CONFIG.GAME_TIME;
        this.updateUI();
    }

    /**
     * Configura el tablero de juego
     */
    setupGameBoard() {
        const shuffledCards = [...CARDS, ...CARDS]
            .sort(() => Math.random() - 0.5);

        shuffledCards.forEach(card => {
            this.gameBoard.appendChild(this.createCard(card));
        });
    }

    /**
     * Crea un elemento de carta
     */
    createCard(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('tarjeta');
        cardElement.dataset.name = card.name;

        cardElement.innerHTML = `
            <div class="delantera" style="background-image: url(${card.img})"></div>
            <div class="trasera"></div>
        `;

        cardElement.addEventListener('click', () => this.flipCard(cardElement));
        return cardElement;
    }

    /**
     * Inicia el temporizador
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.tiempoElement.textContent = this.formatTime(this.timeRemaining);

            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    /**
     * Maneja el volteo de una carta
     */
    flipCard(card) {
        if (
            this.flippedCards.length >= 2 || 
            card.classList.contains('volteada') ||
            card.classList.contains('encontrada') ||
            !this.isPlaying
        ) {
            return;
        }

        card.classList.add('volteada');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }

    /**
     * Verifica coincidencia entre cartas
     */
    async checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.dataset.name === card2.dataset.name;

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isMatch) {
            this.handleMatch(card1, card2);
        } else {
            await this.handleMismatch(card1, card2);
        }
    }

    /**
     * Maneja cartas coincidentes
     */
    handleMatch(card1, card2) {
        this.matchedPairs++;
        card1.classList.add('encontrada');
        card2.classList.add('encontrada');
        this.flippedCards = [];
        this.parejasElement.textContent = CONFIG.PAIRS_TO_WIN - this.matchedPairs;

        if (this.matchedPairs === CONFIG.PAIRS_TO_WIN) {
            this.handleVictory();
        }
    }

    /**
     * Maneja cartas no coincidentes
     */
    async handleMismatch(card1, card2) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.FLIP_DELAY));
        card1.classList.remove('volteada');
        card2.classList.remove('volteada');
        this.flippedCards = [];
    }

    /**
     * Maneja el tiempo agotado
     */
    handleTimeout() {
        this.isPlaying = false;
        clearInterval(this.timer);
        alert('¡Se acabó el tiempo! Intenta de nuevo.');
        this.reiniciarBtn.disabled = false;
        this.iniciarBtn.disabled = false;
    }

    /**
     * Maneja la victoria del juego
     */
    handleVictory() {
        this.isPlaying = false;
        clearInterval(this.timer);
        setTimeout(() => {
            alert('¡Felicitaciones! ¡Has ganado!');
            this.reiniciarBtn.disabled = false;
            this.iniciarBtn.disabled = false;
        }, CONFIG.VICTORY_DELAY);
    }

    /**
     * Formatea el tiempo en formato mm:ss
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Actualiza la interfaz de usuario
     */
    updateUI() {
        this.tiempoElement.textContent = this.formatTime(this.timeRemaining);
        this.parejasElement.textContent = CONFIG.PAIRS_TO_WIN.toString();
    }

    /**
     * Recarga la página
     */
    reloadPage() {
        window.location.reload();
    }
}

// Iniciar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});