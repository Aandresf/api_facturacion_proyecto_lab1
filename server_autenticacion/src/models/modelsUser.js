import db from '../utils/db.js';
//const db = require('../utils/db');

/**
 * Busca a todos los usuarios
 * @returns Todas los usuarios encontrados
 */

export const selectAllUsers = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM user_role_permissions_view;';
    try {
        const result = await connect.query(sql);
        console.log('Usuarios encontrados');
        return result.rows;
    }  catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
};

/**
 * busca a un usuario por su id
 * @param {unmber} id
 * @returns el usuario que tenga el id solicitado
 */

export const selectUser_byId = async (id)  => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM user_role_permissions_view WHERE user_id = $1';
    try {
        const result = await connect.query(sql, [id]);
        //console.log('Resultados Encontrados');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){connect.release(); }
    }
}

/**
 * busca a un usuario por su usernName
 * @param {string} userName
 * @returns el usuario que tenga el userName solicitado
 */

export const selectUser = async (userName)  => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM user_role_permissions_view WHERE username = $1';
    try {
        const result = await connect.query(sql, [userName]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){connect.release(); }
    }
}

/**
 * Busca usuarios poor su rol
 * @param {string} rol
 * @returns los usuarios que tengan el rol solicitado
 */
export const selectUsers_byRol = async (rol)  => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM user_role_permissions_view WHERE user_role = $1';
    try {
        const result = await connect.query(sql, [rol]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){connect.release(); }
    }
}

/**
 * Para hacer incersiones en la tabla usuarios
 * @param {{userName:string, hash:string, rol:string}} user
 * @returns nuevos usuarios registrados
 */
export const insertUser = async (user) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM insert_user_with_details($1, $2, $3)';
    try {
        const result = await connect.query(sql, [user.usuario, user.password, user.rol]);
        console.log('Resultado de la base de datos:', result.row);

        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect) { connect.release(); }
    }
}

/**
 * Actualiza a un usuario
 * @param {{id:number, userName:string, hash:string, rol:string}} user
 * @returns al cliente actualizado
 */
export const updateUser = async (user) => {
    //Se actualiza al usuario
    const connect = await db.connect();
    let sql = 'SELECT * FROM update_user_details($1, $2, $3, $4)';
    try {
        const result = await connect.query(sql, [user.id, user.username, user.hash, user.rol]);
        console.log('Usuario Actualizado');
        console.log('Resultado de la base de datos:', result.rows);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    }finally{
        if (connect){connect.release();}
    }
}

/**
 * Elimina a un usuario
 * @param {number} id 
 * @returns el usuario eliminado
 */

export const deleteUser = async (id) => {

    // se elimina al cliente
        const connect = await db.connect();
        let sql = 'SELECT * FROM deactivate_user_details($1)';
        try {
            const result = await connect.query(sql, [id]);
            console.log('Uusario Eliminado', result.rows);
            return result.rows;
        } catch (error) {
            console.error(error.message);
        } finally {
            if(connect){ connect.release(); }
        }
 }




/**
 * Busca las credenciales de un usuario para el login
 * @param {string} userName 
 * @returns
 */
export const validateUser = async (userName) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM get_user_credentials_for_login($1)';
    try {
            const result = await connect.query(sql, [userName]);
            if (result.rows.length === 0) {
                return { msg: 'Usuario no encontrado' };
            }
            console.log('Uusario Encontrado');
            return result.rows[0];
        } catch (error) {
            console.error(error.message);
        } finally {
            if(connect){ connect.release(); }
        }
}
