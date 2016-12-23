/* TODO:
    ClientList manager all clients join the game.
    - It will tell Prepare-Module when client list changes.
    - It will initialize the player data when game starts.
*/
﻿
var ClientList = function (opts_in) {
    "use strick";
    // Property -----------------------------------------------
    var that = this,
        _max = 5,
        _isLocker = false;

    var clients = {};       // { id:<number>, name:<string>}

    // callback ------------------------------------------
    this.onUpdateClient = null;               /* TODO: callback: send client data if update */
    this.onUpdateOb = null;                   /* TODO: deprecated */

    // API -----------------------------------------------
    this.reset = function (clientData) {
        /* TODO: reset all client data */
        clients = {};
        for (var id in clientData) {
            addClient(id, clientData[id]);
        }
        if (this.onUpdateClient) this.onUpdateClient(clients);
    };

    this.updateClientList = function (clientData) {
        /* TODO: update the client data, keep them as same as the input */
        for (var id in clients) {
            if (id in clientData) continue;
            removeClient(id);
        }
        for (var id in clientData) {
            if (id in clients) continue;
            addClient(id, clientData[id]);
        }
        if (this.onUpdateClient) this.onUpdateClient(clients);
    };

    this.updateObList = function (obData) {
        /* TODO: deprecated */
    };

    this.getClientList = function () {
        /* TODO: initialize the client data. */
        var players=[];
        for (var id in clients) {
            players.push(clients[id]);
        }

        return players=[];
    };

    // Lock -----------------------------------------------
    this.lock = function () {
        /* TODO: make client list unchangeable. */
        _isLocker = true;
    };

    this.unlock = function () {
        /* TODO: make client list changeable. */
        _isLocker = false;
    };

    // Client Add / Remove -----------------------------------------------
    var addClient = function (id, name) {
        if (_isLocker) return;
        clients[id] = {
            id: id,
            name: name
        };
    };

    var removeClient = function (id) {
        if (_isLocker) return;
        delete clients[id];
    };

    // Setup -----------------------------------------------
    var _init = function (opts_in) {
    }(opts_in);
};

module.exports = ClientList;
