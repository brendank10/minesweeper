document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const indexes = [];
    for(i=0; i<squares.length; i++) {
        indexes.push(i);
    }
    
    const mineImg = document.getElementById('img');
    const flagImg = document.getElementById('flagImg');

    const mineCountDisplay = document.querySelector('#flagCounter');

    const width = 30;

    let flagCount = 99;

    init();
    console.log(squares);

    function init() {
        squares.forEach(square => square.classList.add('unrevealed'));
        mineCountDisplay.innerHTML = flagCount;
        generateMines();
        generateValues();
        enableRevealing();
        enableFlagging();
        // temp
        // revealAll();
    }

    function generateMines() {
        let count = 0;
        let rand = 0;
        let c = 0;
        squares.forEach(square => {
            if(!square.classList.contains('mine')) {
                count ++;
            }
        });
        for(i=0; i<99; i++) {
            rand = Math.floor(Math.random() * count);
            c = 0;
            for(j=0; j<=rand; j++) {
                if(squares[j].classList.contains('mine')) {
                    c++;
                }
            }
            squares[rand + c].classList.add('mine');
            count --;
        }
    }

    function generateValues() {
        indexes.forEach(index => {
            if(!squares[index].classList.contains('mine')){
                let count = countAdjacent(index);
                if(count == 0) {
                    squares[index].classList.add('zero');
                }
                if(count == 1) {
                    squares[index].classList.add('one');
                }
                if(count == 2) {
                    squares[index].classList.add('two');
                }
                if(count == 3) {
                    squares[index].classList.add('three');
                }
                if(count == 4) {
                    squares[index].classList.add('four');
                }
                if(count == 5) {
                    squares[index].classList.add('five');
                }
                if(count == 6) {
                    squares[index].classList.add('six');
                }
                if(count == 7) {
                    squares[index].classList.add('seven');
                }
                if(count == 8) {
                    squares[index].classList.add('eight');
                }
            }
        });
    }

    function countAdjacent(index) {
        if(index < width) {
            if(index % width == 0) { // top-left
                return [
                    squares[index + 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width + 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else if((index + 1) % width == 0) { // top-right
                return [
                    squares[index - 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width - 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else { // top-middle
                return [
                    squares[index - 1].classList.contains('mine'),
                    squares[index + 1].classList.contains('mine'),
                    squares[index + width + 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width - 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
        }
        else if(index >= width*15 - 1) {
            if(index % width == 0) { // bottom-left
                return [
                    squares[index + 1].classList.contains('mine'),
                    squares[index - width].classList.contains('mine'),
                    squares[index - width + 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else if((index + 1) % width == 0) { // bottom-right
                return [
                    squares[index - 1].classList.contains('mine'),
                    squares[index - width].classList.contains('mine'),
                    squares[index - width - 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else { //bottom-middle
                return [
                    squares[index - width + 1].classList.contains('mine'),
                    squares[index - width].classList.contains('mine'),
                    squares[index - width - 1].classList.contains('mine'),
                    squares[index - 1].classList.contains('mine'),
                    squares[index + 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
        }
        else {
            if(index % width == 0) { // middle-left
                return [
                    squares[index - width].classList.contains('mine'),
                    squares[index - width + 1].classList.contains('mine'),
                    squares[index + 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width + 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else if((index + 1) % width == 0) { // middle-right
                return [
                    squares[index - width].classList.contains('mine'),
                    squares[index - width - 1].classList.contains('mine'),
                    squares[index - 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width - 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
            else { //middle-middle
                return [
                    squares[index - width].classList.contains('mine'),
                    squares[index - width - 1].classList.contains('mine'),
                    squares[index - width + 1].classList.contains('mine'),
                    squares[index - 1].classList.contains('mine'),
                    squares[index + 1].classList.contains('mine'),
                    squares[index + width].classList.contains('mine'),
                    squares[index + width - 1].classList.contains('mine'),
                    squares[index + width + 1].classList.contains('mine')
                ].filter(p => p == true).length;
            }
        }
    }

    function flag(index) {
        if(squares[index].classList.contains('unrevealed')) {
            if(squares[index].classList.contains('flagged')) {
                squares[index].classList.remove('flagged');
                squares[index].removeChild(squares[index].lastChild);
                flagCount ++;
                mineCountDisplay.innerHTML = flagCount;
            }
            else {
                squares[index].classList.add('flagged');
                squares[index].appendChild(flagImg.cloneNode());
                flagCount --;
                mineCountDisplay.innerHTML = flagCount;
            }
        }
    }

    function enableFlagging() {
        indexes.forEach(index=> {
            squares[index].addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                flag(index);
                return false;
            }, false);
        });
    }

    function revealSquare(index) {
        let square = squares[index];
        if(square.classList.contains('unrevealed')) {
            square.classList.remove('unrevealed');
            if(square.classList.contains('mine')) {
                square.appendChild(mineImg.cloneNode());
                gameOver();
                revealAll();
            }
            if(square.classList.contains('zero')){
                revealAdjacent(index);
            }
            if(square.classList.contains('one')){
                square.innerHTML += '1';
            }
            if(square.classList.contains('two')){
                square.innerHTML += '2';
            }
            if(square.classList.contains('three')){
                square.innerHTML += '3';
            }
            if(square.classList.contains('four')){
                square.innerHTML += '4';
            }
            if(square.classList.contains('five')){
                square.innerHTML += '5';
            }
            if(square.classList.contains('six')){
                square.innerHTML += '6';
            }
            if(square.classList.contains('seven')){
                square.innerHTML += '7';
            }
            if(square.classList.contains('eight')){
                square.innerHTML += '8';
            }
        }
    }

    function enableRevealing() {
        indexes.forEach(index=> {
            squares[index].addEventListener('click', function() {
                revealSquare(index);
            });
        });
    }

    function revealAll() {
        indexes.forEach(index => revealSquare(index));
    }

    function revealAdjacent(index) {
        if(index < width) {
            if(index % width == 0) { // top-left
                revealSquare(index + 1);
                revealSquare(index + width);
                revealSquare(index + width + 1);
            }
            else if((index + 1) % width == 0) { // top-right
                revealSquare(index - 1);
                revealSquare(index + width);
                revealSquare(index + width - 1);
            }
            else { // top-middle
                revealSquare(index - 1);
                revealSquare(index + 1);
                revealSquare(index + width + 1);
                revealSquare(index + width);
                revealSquare(index + width - 1);
            }
        }
        else if(index >= width*15 - 1) {
            if(index % width == 0) { // bottom-left
                revealSquare(index + 1);
                revealSquare(index - width);
                revealSquare(index - width + 1);
            }
            else if((index + 1) % width == 0) { // bottom-right
                revealSquare(index - 1);
                revealSquare(index - width);
                revealSquare(index - width - 1);
            }
            else { //bottom-middle
                revealSquare(index - width + 1);
                revealSquare(index - width);
                revealSquare(index - width - 1);
                revealSquare(index - 1);
                revealSquare(index + 1);
            }
        }
        else {
            if(index % width == 0) { // middle-left
                revealSquare(index - width);
                revealSquare(index - width + 1);
                revealSquare(index + 1);
                revealSquare(index + width);
                revealSquare(index + width + 1);
            }
            else if((index + 1) % width == 0) { // middle-right
                revealSquare(index - width);
                revealSquare(index - width - 1);
                revealSquare(index - 1);
                revealSquare(index + width);
                revealSquare(index + width - 1);
            }
            else { //middle-middle
                revealSquare(index - width);
                revealSquare(index - width - 1);
                revealSquare(index - width + 1);
                revealSquare(index - 1);
                revealSquare(index + 1);
                revealSquare(index + width);
                revealSquare(index + width - 1);
                revealSquare(index + width + 1);
            }
        }
    }

    function gameOver() {
        document.getElementById('gap').innerHTML = "GAME OVER";
    }
});