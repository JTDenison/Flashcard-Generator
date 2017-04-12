
var fs = require("fs");

module.exports = BasicFlashcard;

// constructor for BasicFlashcard
function BasicFlashcard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {
        // added var data to grab object
        var data = {
            front: this.front,
            back: this.back,
            type: "basic",
        };
        // append FC to log
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            // stringify data object
            //log error...sike what error!
            if (error) {
                console.log("There has been a glitch in the matrix: " + error);
            }
        });
    };
}
