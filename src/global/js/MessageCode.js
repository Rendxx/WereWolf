var MSGCODE = {};

MSGCODE.HOST={
    UPDATE: 0,            // update client
    INIT_DATA: 1          // [ 1 | inited?1:0 | number | name | role ] // send init data to specific client
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 |  number | name | role ] // send init data to host, once per game
    GET_INIT: 1,          // [ 1 ] // ask for init data from host
};

module.exports = MSGCODE;
