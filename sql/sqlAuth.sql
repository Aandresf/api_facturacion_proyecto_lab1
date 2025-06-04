-- ###############################################################
-- # Esquema de Base de Datos para Usuarios, Roles y Permisos  #
-- # PostgreSQL 16 - Versión Completa y Consolidada            #
-- ###############################################################

-- Deshabilitar la salida de mensajes si no es necesario (opcional)
-- SET client_min_messages TO warning;

-- Borrar objetos existentes en orden inverso de dependencia (para empezar de cero)
DROP VIEW IF EXISTS user_role_permissions_view;

DROP FUNCTION IF EXISTS insert_user_with_details(VARCHAR, TEXT, VARCHAR);
DROP FUNCTION IF EXISTS update_user_details(INT, VARCHAR, TEXT, VARCHAR, BOOLEAN);
DROP FUNCTION IF EXISTS deactivate_user_details(INT);
DROP FUNCTION IF EXISTS get_user_credentials_for_login(VARCHAR);

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;

-- ####################
-- # Tablas           #
-- ####################

-- Tabla de Permisos
CREATE TABLE Permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de Roles
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de Usuarios
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Almacenar el hash de bcrypt
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL, -- Para eliminación lógica
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Tabla de unión para Roles y Permisos (muchos a muchos)
CREATE TABLE Role_Permissions (
    role_permission_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    UNIQUE (role_id, permission_id), -- Evita duplicados
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id)
);

-- ####################
-- # Datos Iniciales  #
-- ####################

-- Insertar Permisos
INSERT INTO Permissions (permission_name) VALUES
('Lectura'),
('Escritura'),
('Actualizacion'),
('Eliminacion');

-- Insertar Roles
INSERT INTO Roles (role_name) VALUES
('Auditor'),
('Caja'),
('Admin'),
('SuperAdmin');

-- Asignar Permisos a Roles
-- Auditor: Lectura
INSERT INTO Role_Permissions (role_id, permission_id) VALUES
((SELECT role_id FROM Roles WHERE role_name = 'Auditor'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Lectura'));

-- Caja: Lectura, Escritura
INSERT INTO Role_Permissions (role_id, permission_id) VALUES
((SELECT role_id FROM Roles WHERE role_name = 'Caja'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Lectura')),
((SELECT role_id FROM Roles WHERE role_name = 'Caja'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Escritura'));

-- Admin: Lectura, Escritura, Actualizacion
INSERT INTO Role_Permissions (role_id, permission_id) VALUES
((SELECT role_id FROM Roles WHERE role_name = 'Admin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Lectura')),
((SELECT role_id FROM Roles WHERE role_name = 'Admin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Escritura')),
((SELECT role_id FROM Roles WHERE role_name = 'Admin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Actualizacion'));

-- SuperAdmin: Lectura, Escritura, Actualizacion, Eliminacion
INSERT INTO Role_Permissions (role_id, permission_id) VALUES
((SELECT role_id FROM Roles WHERE role_name = 'SuperAdmin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Lectura')),
((SELECT role_id FROM Roles WHERE role_name = 'SuperAdmin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Escritura')),
((SELECT role_id FROM Roles WHERE role_name = 'SuperAdmin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Actualizacion')),
((SELECT role_id FROM Roles WHERE role_name = 'SuperAdmin'), (SELECT permission_id FROM Permissions WHERE permission_name = 'Eliminacion'));


-- ####################
-- # Funciones        #
-- ####################

-- 1. Función para insertar un nuevo usuario y retornar sus detalles
CREATE OR REPLACE FUNCTION insert_user_with_details(
    p_username VARCHAR(100),
    p_password_hash TEXT,
    p_role_name VARCHAR(50)
)
RETURNS TABLE (
    new_user_id INT,
    inserted_username VARCHAR(100),
    inserted_role_name VARCHAR(50)
)
LANGUAGE plpgsql AS $$
DECLARE
    v_role_id INT;
    v_new_user_id INT;
BEGIN
    SELECT role_id INTO v_role_id FROM Roles WHERE role_name = p_role_name;

    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'El rol "%" no existe.', p_role_name;
    END IF;

    INSERT INTO Users (username, password_hash, role_id)
    VALUES (p_username, p_password_hash, v_role_id)
    RETURNING user_id INTO v_new_user_id;

    RETURN QUERY
    SELECT
        v_new_user_id AS new_user_id,
        p_username AS inserted_username,
        p_role_name AS inserted_role_name;

    RAISE NOTICE 'Usuario "%" con rol "%" y ID % insertado exitosamente (desde DB).', p_username, p_role_name, v_new_user_id;
END;
$$;


-- 2. Función para actualizar un usuario y retornar los detalles del usuario actualizado
CREATE OR REPLACE FUNCTION update_user_details(
    p_user_id INT,
    p_new_username VARCHAR(100) DEFAULT NULL,
    p_new_password_hash TEXT DEFAULT NULL,
    p_new_role_name VARCHAR(50) DEFAULT NULL,
    p_new_is_active BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    updated_user_id INT,
    current_username VARCHAR(100),
    current_role_name VARCHAR(50),
    current_is_active BOOLEAN
)
LANGUAGE plpgsql AS $$
DECLARE
    v_role_id INT;
    v_affected_username VARCHAR(100);
    v_affected_role_name VARCHAR(50);
    v_affected_is_active BOOLEAN;
BEGIN
    -- Validar si el usuario existe antes de intentar actualizar
    SELECT username, is_active
    INTO v_affected_username, v_affected_is_active
    FROM Users
    WHERE user_id = p_user_id;

    IF v_affected_username IS NULL THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_user_id;
    END IF;

    -- Obtener el ID del nuevo rol si se proporciona
    IF p_new_role_name IS NOT NULL THEN
        SELECT role_id INTO v_role_id FROM Roles WHERE role_name = p_new_role_name;
        IF v_role_id IS NULL THEN
            RAISE EXCEPTION 'El nuevo rol "%" no existe.', p_new_role_name;
        END IF;
    END IF;

    -- Realizar la actualización
    UPDATE Users
    SET
        username = COALESCE(p_new_username, username),
        password_hash = COALESCE(p_new_password_hash, password_hash),
        role_id = COALESCE(v_role_id, role_id),
        is_active = COALESCE(p_new_is_active, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id
    RETURNING username, role_id, is_active -- Captura los valores resultantes de la actualización
    INTO v_affected_username, v_role_id, v_affected_is_active;

    -- Obtener el nombre del rol actualizado
    SELECT role_name INTO v_affected_role_name FROM Roles WHERE role_id = v_role_id;

    -- Retornar los detalles del usuario actualizado
    RETURN QUERY
    SELECT
        p_user_id AS updated_user_id,
        v_affected_username AS current_username,
        v_affected_role_name AS current_role_name,
        v_affected_is_active AS current_is_active;

    RAISE NOTICE 'Usuario con ID % actualizado exitosamente (desde DB).', p_user_id;
END;
$$;


-- 3. Función para desactivar (eliminación lógica) un usuario y retornar los detalles del usuario desactivado
CREATE OR REPLACE FUNCTION deactivate_user_details(
    p_user_id INT
)
RETURNS TABLE (
    deactivated_user_id INT,
    deactivated_username VARCHAR(100),
    deactivated_role_name VARCHAR(50),
    is_now_active BOOLEAN
)
LANGUAGE plpgsql AS $$
DECLARE
    v_affected_username VARCHAR(100);
    v_role_id INT;
    v_role_name VARCHAR(50);
    v_current_is_active BOOLEAN;
BEGIN
    -- Validar si el usuario existe
    SELECT username, role_id, is_active
    INTO v_affected_username, v_role_id, v_current_is_active
    FROM Users
    WHERE user_id = p_user_id;

    IF v_affected_username IS NULL THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_user_id;
    END IF;

    -- Realizar la eliminación lógica
    UPDATE Users
    SET
        is_active = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id
    RETURNING username, role_id, is_active
    INTO v_affected_username, v_role_id, v_current_is_active;

    -- Obtener el nombre del rol
    SELECT role_name INTO v_role_name FROM Roles WHERE role_id = v_role_id;

    -- Retornar los detalles del usuario desactivado
    RETURN QUERY
    SELECT
        p_user_id AS deactivated_user_id,
        v_affected_username AS deactivated_username,
        v_role_name AS deactivated_role_name,
        v_current_is_active AS is_now_active; -- Aquí será FALSE

    RAISE NOTICE 'Usuario con ID % desactivado (eliminación lógica) exitosamente (desde DB).', p_user_id;
END;
$$;


-- 4. Función para obtener las credenciales de login (hash de contraseña y estado)
CREATE OR REPLACE FUNCTION get_user_credentials_for_login(
    p_username VARCHAR(100)
)
RETURNS TABLE (
    user_id_out INT,
    username_out VARCHAR(100),
    password_hash_out TEXT,
    is_active_out BOOLEAN,
    role_id_out INT
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.password_hash,
        u.is_active,
        u.role_id
    FROM
        Users u
    WHERE
        u.username = p_username;
END;
$$;

-- ####################
-- # Vista            #
-- ####################

-- Vista para mostrar usuario, rol y permisos asociados como un ARRAY
CREATE OR REPLACE VIEW user_role_permissions_view AS
SELECT
    u.user_id,
    u.username,
    r.role_name AS user_role,
    u.is_active,
    COALESCE(ARRAY_AGG(p.permission_name ORDER BY p.permission_name) FILTER (WHERE p.permission_name IS NOT NULL), '{}') AS permissions
FROM
    Users u
JOIN
    Roles r ON u.role_id = r.role_id
LEFT JOIN
    Role_Permissions rp ON r.role_id = rp.role_id
LEFT JOIN
    Permissions p ON rp.permission_id = p.permission_id
GROUP BY
    u.user_id, u.username, r.role_name, u.is_active
ORDER BY
    u.username;


-- ####################
-- # Ejemplos de Uso  #
-- ####################

-- Insertar usuarios de ejemplo (usando el hash de bcrypt del ejemplo Node.js)
-- Hash de "password123": $2b$10$tQ/P.qM3j5J0x.M8bY/X0.pC2p9r4r5h6j7k8l9m0o1p2q3r4s5t6u7v8w9x
-- En una aplicación real, el hash se generaría en el backend.
DO $$
DECLARE
    v_user_details RECORD;
BEGIN
    RAISE NOTICE '--- INSERCIONES ---';
    SELECT * INTO v_user_details FROM insert_user_with_details('auditor_user', '$2b$10$tQ/P.qM3j5J0x.M8bY/X0.pC2p9r4r5h6j7k8l9m0o1p2q3r4s5t6u7v8w9x', 'Auditor');
    RAISE NOTICE 'Insertado: ID %, Usuario: %, Rol: %', v_user_details.new_user_id, v_user_details.inserted_username, v_user_details.inserted_role_name;

    SELECT * INTO v_user_details FROM insert_user_with_details('cashier_user', '$2b$10$tQ/P.qM3j5J0x.M8bY/X0.pC2p9r4r5h6j7k8l9m0o1p2q3r4s5t6u7v8w9x', 'Caja');
    RAISE NOTICE 'Insertado: ID %, Usuario: %, Rol: %', v_user_details.new_user_id, v_user_details.inserted_username, v_user_details.inserted_role_name;

    SELECT * INTO v_user_details FROM insert_user_with_details('admin_user', '$2b$10$tQ/P.qM3j5J0x.M8bY/X0.pC2p9r4r5h6j7k8l9m0o1p2q3r4s5t6u7v8w9x', 'Admin');
    RAISE NOTICE 'Insertado: ID %, Usuario: %, Rol: %', v_user_details.new_user_id, v_user_details.inserted_username, v_user_details.inserted_role_name;

    SELECT * INTO v_user_details FROM insert_user_with_details('superadmin_user', '$2b$10$tQ/P.qM3j5J0x.M8bY/X0.pC2p9r4r5h6j7k8l9m0o1p2q3r4s5t6u7v8w9x', 'SuperAdmin');
    RAISE NOTICE 'Insertado: ID %, Usuario: %, Rol: %', v_user_details.new_user_id, v_user_details.inserted_username, v_user_details.inserted_role_name;

END $$;

-- Consultar la vista para ver los usuarios, sus roles y permisos
RAISE NOTICE '--- VISTA INICIAL ---';
SELECT * FROM user_role_permissions_view;

-- Actualizar un usuario (cambiar username, rol a 'Admin', y activar si estaba inactivo)
-- Primero, obtenemos el user_id de 'cashier_user'
-- En un entorno real, tu aplicación sabría el ID.
SELECT user_id FROM Users WHERE username = 'cashier_user';
-- Suponiendo que el user_id de 'cashier_user' es 2:
DO $$
DECLARE
    v_updated_details RECORD;
BEGIN
    RAISE NOTICE '--- ACTUALIZACION ---';
    SELECT * INTO v_updated_details FROM update_user_details(2, 'new_cashier_admin', NULL, 'Admin', TRUE);
    RAISE NOTICE 'Actualizado: ID %, Usuario: %, Rol: %, Activo: %', v_updated_details.updated_user_id, v_updated_details.current_username, v_updated_details.current_role_name, v_updated_details.current_is_active;
END $$;


-- Desactivar un usuario (eliminación lógica de 'auditor_user')
-- Primero, obtenemos el user_id de 'auditor_user'
SELECT user_id FROM Users WHERE username = 'auditor_user';
-- Suponiendo que el user_id de 'auditor_user' es 1:
DO $$
DECLARE
    v_deactivated_details RECORD;
BEGIN
    RAISE NOTICE '--- DESACTIVACION LOGICA ---';
    SELECT * INTO v_deactivated_details FROM deactivate_user_details(1);
    RAISE NOTICE 'Desactivado: ID %, Usuario: %, Rol: %, Activo: %', v_deactivated_details.deactivated_user_id, v_deactivated_details.deactivated_username, v_deactivated_details.deactivated_role_name, v_deactivated_details.is_now_active;
END $$;

-- Consultar la vista de nuevo para ver los cambios
RAISE NOTICE '--- VISTA DESPUES DE CAMBIOS ---';
SELECT * FROM user_role_permissions_view;

-- --- Ejemplos de uso de la función de login (para probar desde DB) ---
-- Esta función NO hace la comparación de la contraseña (eso es en Node.js)
-- Solo recupera el hash y el estado de actividad para que tu aplicación lo compare.
RAISE NOTICE '--- VERIFICACION DE CREDENCIALES (PARA LOGIN) ---';
SELECT * FROM get_user_credentials_for_login('superadmin_user');
SELECT * FROM get_user_credentials_for_login('auditor_user'); -- Este está desactivado
SELECT * FROM get_user_credentials_for_login('non_existent_user'); -- No devolverá filas