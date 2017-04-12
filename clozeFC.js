// require fs
var fs = require("fs");

module.exports = ClozeFlashcard;

// constructor for ClozeFlashcard
function ClozeFlashcard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '_____'); // asking question to remove answer
    this.create = function() {
        // addded data var to grab object

        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
        };
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            // if there is an error, log the error
            if (error) {
                console.log("There has been a glitch in the matrix: " + error);
            }
        });
    };
}