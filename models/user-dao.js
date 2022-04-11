const DAO = require('./generic-dao');

const userDAO = new DAO('users');



userDAO.checkIfEmailAlreadyExists = async (email)=> {
    sql = 'SELECT EXISTS(SELECT id FROM users WHERE email=?)'
    const data = await userDAO.query(sql, [email]);
    return data[0][0] == 1;
}

module.exports = userDAO;

