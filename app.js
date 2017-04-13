var BasicFlashcard = require('./basicFC.js');

var ClozeFlashcard = require('./clozeFC.js');

var inquirer = require('inquirer');

var fs = require('fs');


//inquirer prompt for user input
// add or show flashcards

inquirer.prompt([{
    name: 'userInput',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'add-flashcard'
    }, {
        name: 'show-all-cards'
    }]
}]).then(function(answer) {
    if (answer.userInput === 'add-flashcard') {
        addCard(); // next question...
    } else if (answer.userInput === 'show-all-cards') {
        showCards(); // show flashCards made
    }
});

var addCard = function() {
    // get user input for add card
    inquirer.prompt([{
        name: 'cardType',
        message: 'What kind of flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'basic-flashcard'
        }, {
            name: 'cloze-flashcard'
        }]
    }]).then(function(answer) {
        if (answer.cardType === 'basic-flashcard') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?',

                // validate function (input) to ensure user inputs data, else return true
                validate: function(input) {
                    if (input === '') {
                        console.log('Please provide a question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'What is the answer?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please provide an answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicFlashcard(answer.front, answer.back);
                newBasic.create();
                nextStep();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full question?', // User inputs entire question
                validate: function(input) {
                    if (input === '') {
                        console.log('Please provide the full question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?', // text that will be removed
                validate: function(input) {
                    if (input === '') {
                        console.log('Please provide the cloze portion');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                // housekeeping vars
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeFlashcard(text, cloze);
                    newCloze.create(); // make clozed card
                    nextStep();
                } else { // make sure cloze === removed
                    console.log('The cloze you provided is not found in the text. Please try again.');
                    addCard();
                }
            });
        }
    });
};

// next step function, after user succesfully creates a card

var nextStep = function() {
    // get user input
    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
                name: 'create-new-card'
            }, {
                name: 'show-all-cards'
            }, {
                name: 'nothing'
            }]
            // user selected
    }]).then(function(answer) {
        if (answer.nextAction === 'create-new-card') {
            addCard();
        } else if (answer.nextAction === 'show-all-cards') {
            showCards();
        } else if (answer.nextAction === 'nothing') {
            return;
        }
    });
};

var showCards = function() {
    // read the log.txt file
    fs.readFile('./log.txt', 'utf8', function(error, data) {

        if (error) {
            console.log("There was a glitch in the Matrix: " + error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        }; //someone said i should link where i got this from     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

// show the questions
//parsed questions
var showQuestion = function(array, index) {
    question = array[index];
    var jSONparse = JSON.parse(question); // added JSON.parse var for housekeeping
    var questionText;
    var correctReponse;
    if (jSONparse.type === 'basic') {
        questionText = jSONparse.front;
        correctReponse = jSONparse.back;
    } else if (jSONparse.type === 'cloze') {
        questionText = jSONparse.clozeDeleted;
        correctReponse = jSONparse.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('You got it duuuuuuude!');
            if (index < array.length - 1) {
                showQuestion(array, index + 1);
            }
        } else {
            console.log('That is incorrect...');
            if (index < array.length - 1) {
                showQuestion(array, index + 1);
            }
        }
    });
};
