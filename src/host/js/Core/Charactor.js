var Charactor = function (id, number, role, name, clientName,status) {
    this.id = id;
    this.number = number;
    this.role = role;
    this.name = name;
    this.clientName = clientName;
    this.alive = true;
    this.status = status || [];
}

module.exports = Charactor;
