// 1. Deposit some money
// 2. Determine how many lines they want to bet on
// 3. Collect the bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings or take their bet if they lost
// 7. Play again

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const symbolsCount = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const symbolValues = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

// -----------------Step 1-------------------
const deposit = () => {
    while (true) {
        const depositAmount = prompt('Enter a deposit amount: ');
        const numberDepositAmount = parseFloat(depositAmount);
    
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log('Invalid deposit amount, try again.')
        }
        else{
            return numberDepositAmount;
        }
    }
};

// ---------------------Step 2--------------------
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt('Enter the number of lines to bet on (1-3): ');
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalid number of lines, try again.')
        }
        else {
            return numberOfLines;
        }
    }
};


// ---------------------Step 3---------------------

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt('Enter the total bet per line: ');
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log('Invalid bet, try again.')
        }
        else {
            return numberBet;
        }
    }
};

// ------------------------Step 4-----------------------

const spin = () => {
    const symbols = [];
    for (const[symbol, count] of Object.entries(symbolsCount)){
        for(let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = []; 
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols]; //Here youre making a copy of the 'symbols' array and storing it in another array 'reelSymbols'
        // so that you can have all the symbols avaliable for each reel(cols). for example: In the first reel there are all the symbol values 
        //('A', 'B', 'C', 'D'), but 2 'A's have already been selected, we need to remove the 'A's from the current reel so that they are no longer 
        //avaliable to the current reel but are avaliable for the next reel.
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }

    return rows;
};

const printRows = (rows) => {
    for(const row of rows){
        let rowString = '';
        for(const[i,symbol] of row.entries()){
            rowString += symbol
            if(i != row.length - 1){
                rowString += ' | '
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * symbolValues[symbols[0]]
        }
    }

    return winnings;
}

const game = () => {
    let balance = deposit(); //Calling Step 1's function
    
    while(true){
        console.log('You have a balance of $' + balance);
        const numberOfLines = getNumberOfLines(); //Calling step 2's function
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings;
        console.log('You won, $' + winnings.toString()); 
        
        if(balance <= 0){
            console.log('You ran out of money.');
            break;
        }

        const playAgain = prompt('Do you want to play again? (y/n) ');
        if(playAgain != 'y')break;
    }
};

game();
