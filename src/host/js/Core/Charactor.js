var Charactor = function (id, number, name, role, status) {
    this.id = id;
    this.number = number;
    this.role = role;
    this.name = name;
    this.alive = true;
    this.status = status || [];
}

module.exports = Charactor;
