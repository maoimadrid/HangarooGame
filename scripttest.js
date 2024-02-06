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

        // If all questions have been asked in the current difficulty level and there are remaining difficulty levels,
        // switch to the next difficulty level
        if (gameMode === 'easy' && askedQuestions['easy'].length === questions['easy'].length) {
            if (gameModes[currentDifficultyIndex + 1]) {
                currentDifficultyIndex++;
                gameMode = gameModes[currentDifficultyIndex];

                // Update displayed game mode
                document.getElementById('gameMode').textContent = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);

                // Reset questions answered counter
                questionsAnswered = 0;
            } else {
                // Handle case where all questions in all difficulty levels have been asked
                alert('Congratulations! You have completed all difficulty levels.');
                resetGame();
                return;
            }
        } else if (gameModes[currentDifficultyIndex + 1]) {
            currentDifficultyIndex++;
            gameMode = gameModes[currentDifficultyIndex];

            // Update displayed game mode
            document.getElementById('gameMode').textContent = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);
        } else {
            // Handle case where all questions in all difficulty levels have been asked
            alert('Congratulations! You have completed all difficulty levels.');
            resetGame();
            return;
        }
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

function displayAlphabet() { //Displays all the alphabets
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
            button.addEventListener('click', () => {
                handleGuess(alphabet[j]);
                button.disabled = true; // Disable the button after it's clicked
            });
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
            questionsAnswered++; // Increment the number of questions answered
            document.getElementById('score').textContent = score;

            if (questionsAnswered === 10) {
                currentDifficultyIndex++;
                if (currentDifficultyIndex < gameModes.length) {
                    gameMode = gameModes[currentDifficultyIndex];
                    displayNextQuestionPopup(); // Display the next question pop-up
                    questionsAnswered = 0; // Reset questions answered counter
                    document.getElementById('gameMode').textContent = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);
                } else {
                    alert('Congratulations! You have completed all difficulty levels. You have a final score of: ' + score);
                    resetGame();
                }
            } else {
                displayNextQuestionPopup(); // Display the next question pop-up
            }
        }
    } else {
        incorrectGuesses++;
        updateHearts();
        if (incorrectGuesses === 3) {
            gameOver();
        }
    }
}



// Function to display the pop-up for the next question
function displayNextQuestionPopup() {
    const nextQuestionPopup = document.getElementById('nextQuestionPopup');
    nextQuestionPopup.style.display = 'block';
}

// Function to hide the pop-up for the next question
function hideNextQuestionPopup() {
    const nextQuestionPopup = document.getElementById('nextQuestionPopup');
    nextQuestionPopup.style.display = 'none';
}

// Event listener for the button to display the next question
document.getElementById('nextQuestionButton').addEventListener('click', function() {
    hideNextQuestionPopup(); // Hide the pop-up when the button is clicked
    displayQuestion(); // Display the next question
});


function updateHearts() {
    const heartsSpan = document.getElementById('hearts');
    heartsSpan.textContent = '❤️'.repeat(Math.max(0, 3 - incorrectGuesses));

    if (incorrectGuesses === 3) {
        gameOver();
    }
}

function disableAlphabetButtons() {
    const buttons = document.querySelectorAll('#alphabet button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function enableAlphabetButtons() {
    const buttons = document.querySelectorAll('#alphabet button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

let cluesLeftDisplay = document.getElementById('cluesLeft');
let cluesLeftBtnDisplay = document.getElementById('cluesLeftBtn');
function provideClue() {
    if (cluesLeft > 0) {
        if (score >= 25) {
            score -= 25;
            document.getElementById('score').textContent = score;
            cluesLeft--;
            document.getElementById('cluesLeft').textContent = cluesLeft;
            displayClueTypePopup();
        } else {
            displayPopup('Not enough points!', 'You need at least 25 points to get a clue.');
        }
        cluesLeftDisplay.textContent = cluesLeft;
        cluesLeftBtnDisplay.textContent = cluesLeft;
        
        // Disable the button when no clues are left
        if (cluesLeft === 0) {
            document.getElementById('clueBtn').disabled = true;
        }
    } else {
        displayPopup('No clues left!', 'You have used all your clues.');
    }
}

// Function to display the pop-up for choosing clue type (consonants or vowels)
function displayClueTypePopup() {
    const popup = document.getElementById('clueTypePopup');
    popup.style.display = 'block';

    // Event listener for the consonants button
    document.getElementById('consonantsButton').addEventListener('click', function() {
        provideConsonantClue();
        popup.style.display = 'none';
    });

    // Event listener for the vowels button
    document.getElementById('vowelsButton').addEventListener('click', function() {
        provideVowelClue();
        popup.style.display = 'none';
    });
}

function displayPopup(title, message) {
    // Get the popup elements
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popup = document.getElementById('popup1');

    // Set the title and message
    popupTitle.textContent = title;
    popupMessage.textContent = message;

    // Display the popup
    popup.style.display = 'block';

    // Add event listener to close the popup when the close button is clicked
    const closeButton = document.getElementById('popupCloseButton');
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });
}

function provideConsonantClue() {
    const wordLetters = currentWord.toUpperCase().split('');
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
    const eligibleLetters = wordLetters.filter(letter => consonants.includes(letter));
    if (eligibleLetters.length === 0) {
        displayPopup('No Consonants!', 'There are no consonants left in the word.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * eligibleLetters.length);
    const letterToReveal = eligibleLetters[randomIndex];
    revealLetter(letterToReveal);
}

function provideVowelClue() {
    const wordLetters = currentWord.toUpperCase().split('');
    const vowels = 'AEIOU'.split('');
    const eligibleLetters = wordLetters.filter(letter => vowels.includes(letter));
    if (eligibleLetters.length === 0) {
        displayPopup('No Vowels!', 'There are no vowels left in the word.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * eligibleLetters.length);
    const letterToReveal = eligibleLetters[randomIndex];
    revealLetter(letterToReveal);
}

function revealLetter(letter) {
    const boxes = document.querySelectorAll('.box');
    let revealed = false; // Flag to ensure only one letter is revealed

    // Loop through each box element
    boxes.forEach(box => {
        // Check if the box contains the letter to reveal and is not already revealed
        if (box.textContent.toUpperCase() === letter && !revealed) {
            box.textContent = letter; // Reveal the letter
            box.classList.add('correct'); // Add the 'correct' class to style the revealed letter
            revealed = true; // Set the flag to true to indicate that a letter has been revealed
        }
    });
}

function gameOver() {
    displayPopup('Game Over! Your final score is : ' + score);
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
    document.getElementById('hearts').textContent = '❤️❤️❤️';
    displayQuestion();
}

document.addEventListener("DOMContentLoaded", function() {
            var rulesPopup = document.getElementById("rulesPopup");
            var ruleBtn = document.getElementById("ruleBtn");
            var closeBtn = document.getElementById("closeBtn");

            ruleBtn.addEventListener("click", function() {
                rulesPopup.style.display = "block";
            });

            closeBtn.addEventListener("click", function() {
                rulesPopup.style.display = "none";
            });
        });
		
		
function updateGameModeColor() {
    const gameModeElement = document.getElementById('gameMode');
    
    // Remove existing color classes
    gameModeElement.classList.remove('easy-color', 'medium-color', 'difficult-color');
    
    // Add the appropriate color class based on the current game mode
    if (gameMode === 'easy') {
        gameModeElement.classList.add('green-color');
    } else if (gameMode === 'medium') {
        gameModeElement.classList.add('orange-color');
    } else if (gameMode === 'difficult') {
        gameModeElement.classList.add('red-color');
    }
}

// Call the function initially to set the initial color
updateGameModeColor();

document.getElementById('menuBtn').addEventListener('click', function() {
    // Goes back to Main Menu
    window.location.href = 'index.html';
});

document.getElementById('clueBtn').addEventListener('click', provideClue);
document.getElementById('restartBtn').addEventListener('click', resetGame);

displayQuestion();
