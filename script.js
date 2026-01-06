"use strict";
// Memory Card Game - TypeScript
var _a, _b;
const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺', '🎻', '🎲', '⚽', '🏀'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let pairsCount = 8;
let isChecking = false;
let startTime = 0;
let timerInterval;
let gameStarted = false;
const board = document.getElementById('gameBoard');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const levelEl = document.getElementById('level');
const timeEl = document.getElementById('time');
function initGame() {
    board.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    // ✅ RESET TIMER STATE
    gameStarted = false;
    timeEl.textContent = '00:00';
    if (timerInterval !== undefined) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }
    movesEl.textContent = '0';
    matchesEl.textContent = '0';
    const selected = emojis.slice(0, pairsCount);
    const shuffled = [...selected, ...selected].sort(() => 0.5 - Math.random());
    shuffled.forEach((emoji) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = '?';
        const cardData = {
            emoji,
            element: cardEl,
            matched: false
        };
        cardEl.onclick = () => flipCard(cardData);
        board.appendChild(cardEl);
        cards.push(cardData);
    });
    updateGrid();
}
function updateGrid() {
    const cols = pairsCount === 8 ? 4 : pairsCount === 10 ? 5 : 6;
    // board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}
function flipCard(card) {
    if (isChecking ||
        card.matched ||
        flippedCards.some(c => c === card))
        return;
    // 🟢 START TIMER ON FIRST MOVE
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    card.element.classList.add('flipped');
    card.element.textContent = card.emoji;
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = moves.toString();
        checkMatch();
    }
}
function checkMatch() {
    isChecking = true;
    const [a, b] = flippedCards;
    if (a.emoji === b.emoji) {
        a.matched = true;
        b.matched = true;
        a.element.classList.add('matched');
        b.element.classList.add('matched');
        matchedPairs++;
        matchesEl.textContent = matchedPairs.toString();
        flippedCards = [];
        isChecking = false;
        if (matchedPairs === pairsCount) {
            stopTimer();
            onWin();
        }
    }
    else {
        setTimeout(() => {
            a.element.classList.remove('flipped');
            b.element.classList.remove('flipped');
            a.element.textContent = '?';
            b.element.textContent = '?';
            flippedCards = [];
            isChecking = false;
        }, 800);
    }
}
function onWin() {
    console.log('🎉 You won!');
}
function resetGame() {
    initGame();
}
function changeLevel() {
    pairsCount = pairsCount === 8 ? 10 : pairsCount === 10 ? 12 : 8;
    levelEl.textContent = pairsCount === 8 ? 'Easy' : pairsCount === 10 ? 'Medium' : 'Hard';
    initGame();
}
(_a = document.getElementById('resetBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', resetGame);
(_b = document.getElementById('levelBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', changeLevel);
initGame();
function startTimer() {
    startTime = Date.now();
    timerInterval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timeEl.textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}
function stopTimer() {
    if (timerInterval !== undefined) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }
}
