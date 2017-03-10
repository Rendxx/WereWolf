/* TODO:
    Prepare-Screen is the screen before game starting.
    You can set game options while waiting for other players.
*/

var Style = require('./Render.Prepare.less');

var HTML = {
};

var Prepare = function (container, opts_in) {
    "use strick";
    // Property -------------------------------------
    var // html
        html = {
            container: $(container)
        },

        // data
        clientName = '';

    // Callback -------------------------------------

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
        html['container'].fadeIn();
    };

    this.hide = function () {
        /* TODO: hide Prepare-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.updateGame = function (gameData) {
        /* TODO: do nothing */
    };

    // Private ---------------------------------------

    // Setup -----------------------------------------
    var _setupHtml = function () {
    };

    var _init = function (opts_in) {
        clientName = opts_in.name;
        _setupHtml();
    }(opts_in);
};

module.exports = Prepare;
