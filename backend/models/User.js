class User {
  constructor({ id, password, purpose }) {
    this.id = id;
    this.password = password;
    this.purpose = purpose;
    this.createdAt = new Date();
  }
}

module.exports = User;