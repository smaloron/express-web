const mysql = require('./connection');

const DAO = function (tableName) {
    this.tableName = tableName;

    const query = async (sql, data) => {
        const connection = await mysql.connection;
        const result = await connection.query(sql, data);
        return result;
    };

    const findAll = async () => {
        const results = await query(
            'SELECT * FROM ??;',
            [this.tableName]
        );
        return results[0];
    };

    const findOneById = async (id) => {
        const result = await query(
            'SELECT * FROM ?? WHERE id = ?',
            [this.tableName, id]
        );
        return result[0][0];
    };

    const findBy = async (fieldName, value) => {
        const results = await query(
            'SELECT * FROM ?? WHERE ?? = ?',
            [this.tableName, fieldName, value]
        );
        return results[0];
    };

    const findOneBy = async (fieldName, value) => {
        const results = await query(
            'SELECT * FROM ?? WHERE ?? = ?',
            [this.tableName, fieldName, value]
        );
        return results[0].length>0?results[0][0]: null;
    };

    const find = async (search) => {
        let sql = 'SELECT * FROM ?? '
        searchData = [];
        if (search) {
            sql += 'WHERE ' + Object
                .keys(search)
                .map(
                    (fieldName) => {
                        return '`' + fieldName + '` = ?'
                    })
                .join(' AND ');

            searchData = Object.values(search);
        }

        const results = await query(sql, [this.tableName, ...searchData]);
        return results[0];
    };

    const insert = async (data)=> {
        const sql = 'INSERT INTO ?? SET ?';
        const result = await query(sql, [
            this.tableName,
            data
        ]);
        return result[0];
    };

    const update = async (data, id)=> {
        const sql = 'UPDATE ?? SET ? WHERE id = ?';
        const result = await query(sql, [
            this.tableName,
            data,
            id
        ]);
        return result[0];
    };

    const deleteOneById = async (id) => {
        const sql = 'DELETE FROM ?? WHERE id = ?';
        const result = await query(sql, [
            this.tableName,
            id
        ]);
        return result[0];
    }


    return {
        findAll,
        findOneById,
        findBy,
        findOneBy,
        find,
        insert,
        update,
        deleteOneById,
        query
    }
}


module.exports = DAO;
