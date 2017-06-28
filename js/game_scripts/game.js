/* TODO to make game better*/
/*
1. Implement check containing only verb, adjectives, nouns (ie, no future tense 'will get'-like stuff)
2. Take the root of the given word and add the variations of words to previousWords[]
*/

/* global $ */
$(document).ready(function() {

    // create nlp variable for easier access to nlp_compromise methods 
    var nlp = window.nlp_compromise;

    var wordList = Object.keys(nlp.lexicon()); // Get all words from NLP_compromise

    // variable array to hold all banned words previously chosen.
    var previousWords = [];

    // define game round
    var gameRound = 1;

    // next valid letter.
    var letter = null;

    // last word used.
    var lastWord = null;

    // computer word chosen.
    var compWord = null;

    // user word chosen.
    var userWord = null;

    // losing key for CPU... 
    var losingKey = "Rqwyt6BlaQ";

    // large number to have cpu iterate randomly amongst the lexicon
    var CPUAttempts = 550;

    // Start game button
    var $startGameBtn = $('#start-game-btn');

    // Variable for the main message element with id #main-message-prompt
    var $mainMessagePrompt = $('#main-message-prompt');

    //Button variables for debugging // testing
    var $generateMessageBtn = $("#generateMessage");
    var $removeMessageBtn = $("#removeMessage");

    var $userThoughtInput = $('#user-thought-input');
    var $userThoughtBtn = $('#user-thought-btn');

    // This will define the textillate effects for mainMessagePrompt.
    $mainMessagePrompt.textillate({
        autoStart: false,
        in: {
            effect: 'fadeIn'
        },
        out: {
            effect: 'fadeOutUp',
            sync: true
        }
    });
    // apiMessage is a variable that makes triggering the mainMessagePrompt less verbose. 
    var apiMessage = $mainMessagePrompt.data('textillate');


    /////////////////////////////////////////////////////////////////////
    // Start screen


    // Trigger the beginning of the game.
    $startGameBtn.click(function() {
        $('#instructions').addClass('hidden');
        $('#main-message-prompt').removeClass('hidden');
        $('#user-thoughts').removeClass('hidden');
        $startGameBtn.addClass('hidden');
        enableInput();
        startWord();
    });


    /////////////////////////////////////////////////////////////////////  


    function startWord() {
        var randomNumber = Math.floor(Math.random() * wordList.length);
        lastWord = wordList[randomNumber];
        previousWords.push(lastWord);
        getLastLetter(lastWord);
        showMessage(lastWord);
    }

    // computer's turn. 
    function compTurn() {
        compWord = compFindWord();
        if (compWord === losingKey) {
            playerWins();
        }
        else {
            previousWords.push(compWord);
            lastWord = compWord;
            getLastLetter(lastWord);
            removeMessage();
            showMessage(lastWord);
            gameRound++;
            enableInput();
        }
    }

    function disableInput() {
        $userThoughtBtn.prop('disabled', true);
        $userThoughtInput.prop('disabled', true);
    }

    function enableInput() {
        $userThoughtBtn.prop('disabled', false);
        $userThoughtInput.prop('disabled', false);
    }

    // player win functions
    function playerWins() {
        $('#user-thoughts').addClass('hidden');
        showMessage("You win");
    }

    // player loses functions
    function playerLoses() {
        $('#user-thoughts').addClass('hidden');
        showMessage("You Lose");
    }

    // gets last letter of the word and stored in the letter variable.
    function getLastLetter(word) {
        letter = word.charAt(word.length - 1);
    }

    // compares the first letter with the word variable. returns true if both correct, returns false if not.
    function matchFirstLetter(word) {
        if (word.charAt(0) === letter) return true;
        if (word.charAt(0) != letter) return false;
    }

    // compares word to all past words to ensure the past word hasn't been picked. returns true if the word is in the array, false if not.
    function noPreviousWords(word) {
        var zeroPreviousWord = true;
        // linear search
        for (var i = 0; i < previousWords.length; i++) {
            if (word === previousWords[i]) zeroPreviousWord = false;
        }
        return zeroPreviousWord;
    }

    //search the NLP_Compromise lexicon for a match and returns a true or false depending if there is a match or not. 
    function searchForMatch(word) {
        var match = false; //default to false
        // implimenting a linear search. 
        for (var i = 0; i < wordList.length; i++) {
            if (wordList[i] === word) match = true;
        }
        console.log(match);
        return match;
    }

    // computer attempts to find a word in the NLP_Compromise lexicon
    function compFindWord() {
        var chosenWord = losingKey;
        for (var i = 0; i < CPUAttempts; i++) {
            var randomNumber = Math.floor(Math.random() * wordList.length);
            var word = wordList[randomNumber];
            if (matchFirstLetter(word)) {
                if (noPreviousWords(word)) {
                    chosenWord = word;
                    break;
                }
            }
        }
        return chosenWord;
    }

    // toggle the textillate out effect
    function removeMessage() {
        apiMessage.out();
    }


    // toggle the textillate in effect
    function showMessage(message) {
        $mainMessagePrompt.find('.texts li:first').text(message);
        apiMessage.in();
        //$mainMessagePrompt.textillate('start');
        //apiMessage.start();
    }


    // Input box for User's Thoughts. Defines the user-thought-btn and user-thought-input
    $userThoughtInput.on('keypress', function(e) {
        if (e.which === 13) {
            console.log('Enter Pressed');
            userThoughtsToggle($userThoughtInput.val());
            clearUserThoughts();
        }
    });

    $userThoughtBtn.click(function() {
        console.log('Enter Pressed');
        userThoughtsToggle($userThoughtInput.val());
        clearUserThoughts();
    });

    //Main function when thoughts are toggles. Parameters : string.
    function userThoughtsToggle(string) {
        disableInput();
        if (noPreviousWords(string) && matchFirstLetter(string) && searchForMatch(string)) {
            lastWord = string;
            previousWords.push(lastWord);
            getLastLetter(lastWord);
            removeMessage();
            showMessage(lastWord);
            compTurn();
        }
        else {
            playerLoses();
        }
    }

    //Clear the input box when user enters a thought. 
    function clearUserThoughts() {
        $($userThoughtInput).val(null);
    }


});
