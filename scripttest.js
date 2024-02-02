let questionsAnswered = 0;
let currentDifficultyIndex = 0; 

const questions = {
    easy: [
        { question: "Who was the Ancient Greek God of the Sun? ", answer: "Apollo" },
        { question: "What is the capital of the Philippines?", answer: "Manila" },
        { question: "What planet is closest to the sun? ", answer: "Mercury" },
        { question: "Who painted the Mona Lisa?", answer: "Leonardo Da Vinci" },
        { question: "Who was the first 3D Disney princess? ", answer: "Rapunzel" },
        { question: "How many colors are there in a rainbow? ", answer: "Seven" },
        { question: "Who painted the Sistine Chapel? ", answer: "Michelangelo" },
        { question: "What is the oldest city in the Philippines? ", answer: "Cebu" },
        { question: "Who is the father of the Filipino language? ", answer: "Manuel Quezon" },
        { question: "What do they call the traditional script in the Philippines? ", answer: "Baybayin" },
    ],
    medium: [
        { question: "What programming language is often used for artificial intelligence and machine learning?", answer: "Python" },
        { question: "Which company introduced the first commercially available smartphone?", answer: "IBM" },
        { question: "Which tech giant was founded by Bill Gates and Paul Allen?", answer: "Microsoft" },
        { question: "Which programming language was developed by Sun Microsystems and is often used for building web applications?", answer: "Java" },
        { question: "What technology is used to connect devices in a wireless personal area network, commonly known as PAN?", answer: "Bluetooth" },
        { question: "Which tech giant is associated with the slogan “Think Different”?", answer: "Apple" },
        { question: "What programming language is commonly used for building dynamic web pages?  ", answer: "Javascript" },
        { question: "Which tech company is known for its search engine and was founded by Larry Page and Sergey Brin? ", answer: "Google" },
        { question: "Which common file format is used for images and photographs? ", answer: "JPEG" },
        { question: "What is the name of the device that allows computers to communicate with each other over a network?  ", answer: "Router" },
    ],
    difficult: [
        { question: "Which country has launched a national AI strategy to become a global leader in the field?", answer: "China" },
        { question: "Which company has developed a virtual assistant that can understand and respond to natural language?", answer: "Amazon" },
        { question: "What programming language is commonly used for developing mobile applications on the iOS platform?", answer: "Swift" },
        { question: "What does IDE stand for in software development?", answer: "Integrated Development Environment" },
        { question: "What is the name of the first computer bug?", answer: "Moth" },
        { question: "In networking, what does VPN stand for?", answer: "Virtual Private Network" },
        { question: "What was the first popular web browser, released in 1993?", answer: "Mosaic" },
        { question: "This is described as the rights of individuals and companies to deny or restrict the collection and use of information about them.", answer: "Privacy" },
        { question: "A method that allows a programmer to represent the algorithm in a more programming related way.", answer: "Pseudocode" },
        { question: "An algorithm that runs from top down without interruption until it finishes the program", answer: "Sequential" },
    ]
};

const gameModes = ['easy', 'medium', 'difficult'];
let gameMode = gameModes[currentDifficultyIndex];
let askedQuestions = {
    easy: [],
    medium: [],
    difficult: []
};

let currentQuestions = null;
let currentQuestion = null;
let currentWord = null;
let score = 0;
let cluesLeft = 3;
let incorrectGuesses = 0;

function displayQuestion() {
    // Filter out questions that have already been asked in the current game mode
    const currentQuestions = questions[gameMode].filter(question => !askedQuestions[gameMode].includes(question));
    
    // Check if all questions in the current game mode have been asked
    if (currentQuestions.length === 0) {
        // Reset asked questions for the current game mode
        askedQuestions[gameMode] = [];
        
        // If all questions have been asked, switch to the next difficulty level
        if (gameMode === 'easy') {
            gameMode = 'medium';
        } else if (gameMode === 'medium') {
            gameMode = 'difficult';
        } else {
            // Handle case where all questions in all difficulty levels have been asked
            alert('Congratulations! You have completed all difficulty levels.');
            return;
        }
        
        // Update displayed game mode
        document.getElementById('gameMode').textContent = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);
        
        // Get questions for the new game mode
        displayQuestion();
        return;
    }

    // Randomly select a question from the remaining questions
    const currentQuestion = currentQuestions[Math.floor(Math.random() * currentQuestions.length)];
    
    // Add the selected question to the list of asked questions
    askedQuestions[gameMode].push(currentQuestion);
    
    // Display the question
    document.getElementById('question').textContent = currentQuestion.question;
    
    // Display the word to guess
    currentWord = currentQuestion.answer.toUpperCase();
    displayWord();
    
    // Reset alphabet buttons
    displayAlphabet();
}

function displayWord() {
    const wordDiv = document.getElementById('word');
    wordDiv.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        if (currentWord[i] === ' ') {
            box.style.visibility = 'hidden';
        }
        wordDiv.appendChild(box);
    }
}

function displayAlphabet() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    const alphabetDiv = document.getElementById('alphabet');
    alphabetDiv.innerHTML = '';

    const rows = 3; // Number of rows
    const lettersPerRow = Math.ceil(alphabet.length / rows);

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = i * lettersPerRow; j < (i + 1) * lettersPerRow && j < alphabet.length; j++) {
            const button = document.createElement('button');
            button.textContent = alphabet[j];
            button.addEventListener('click', () => handleGuess(alphabet[j]));
            row.appendChild(button);
        }
        alphabetDiv.appendChild(row);
    }
}

function handleGuess(letter) {
    const regex = new RegExp(letter, 'gi');
    const wordWithoutSpaces = currentWord.replace(/\s/g, ''); // Remove spaces from the current word
    if (regex.test(wordWithoutSpaces)) {
        const boxes = document.querySelectorAll('.box');
        currentWord.split('').forEach((char, index) => {
            if (char === letter || char === ' ') { // Treat spaces as correct guesses
                boxes[index].textContent = char;
                boxes[index].classList.add('correct');
            }
        });

        if (Array.from(boxes).every(box => box.textContent !== '')) {
            score += 10; // Increment score
            document.getElementById('score').textContent = score;
            if (questionsAnswered === 10) {
                currentDifficultyIndex++;
                if (currentDifficultyIndex < gameModes.length) {
                    gameMode = gameModes[currentDifficultyIndex];
                    questionsAnswered = 0; // Reset questions answered counter
                    document.getElementById('gameMode').textContent = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);
                } else {
                    alert('Congratulations! You have completed all difficulty levels. You have a final score of: ' + score);
                    resetGame();
                }
            } else {
                displayQuestion();
            }
        }
    } else {
        incorrectGuesses++;
        document.getElementById('incorrectCount').textContent = incorrectGuesses;
        if (incorrectGuesses === 3) {
            gameOver();
        }
    }
}

function provideClue() {
    if (cluesLeft > 0) {
        if (score >= 25) {
            score -= 25;
            document.getElementById('score').textContent = score;
            cluesLeft--;
            document.getElementById('cluesLeft').textContent = cluesLeft;
            const type = prompt("Choose clues using consonants or vowels (c / v):").toLowerCase();
            if (type === 'c' || type === 'consonants') {
                provideConsonantClue();
            } else if (type === 'v' || type === 'vowels') {
                provideVowelClue();
            } else {
                alert('Invalid input! Please choose either consonants (c) or vowels (v).');
            }
        } else {
            alert('Not enough points to get a clue!');
        }
    } else {
        alert('No clues left!');
    }
}

function provideConsonantClue() {
    const wordLetters = currentWord.toUpperCase().split('');
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
    const buttons = document.querySelectorAll('#alphabet button');
    buttons.forEach(button => {
        if (consonants.includes(button.textContent.toUpperCase()) && wordLetters.includes(button.textContent.toUpperCase())) {
            button.classList.add('clue-highlight');
        }
    });
}

function provideVowelClue() {
    const wordLetters = currentWord.toUpperCase().split('');
    const vowels = 'AEIOU'.split('');
    const buttons = document.querySelectorAll('#alphabet button');
    buttons.forEach(button => {
        if (vowels.includes(button.textContent.toUpperCase()) && wordLetters.includes(button.textContent.toUpperCase())) {
            button.classList.add('clue-highlight');
        }
    });
}

function gameOver() {
    alert('Game Over! Your final score is : ' + score);
    resetGame();
}


function resetGame() {
    score = 0;
    cluesLeft = 3;
    incorrectGuesses = 0;
    gameMode = 'easy';
    document.getElementById('gameMode').textContent = 'Easy';
    document.getElementById('score').textContent = score;
    document.getElementById('cluesLeft').textContent = cluesLeft;
    document.getElementById('incorrectCount').textContent = incorrectGuesses;
    displayQuestion();
}

document.getElementById('clueBtn').addEventListener('click', provideClue);
document.getElementById('restartBtn').addEventListener('click', resetGame);

displayQuestion();
