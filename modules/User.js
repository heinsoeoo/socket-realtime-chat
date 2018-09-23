const Model = require('tneuqole');

class User extends Model {
	constructor(values) {
        super(values);

        this.columns = ['name', 'age', 'password'];
        this.table = 'users';
        this.primaryKey = 'id';
    }
}

module.exports = User;