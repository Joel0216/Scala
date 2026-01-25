-- ============================================
-- ESQUEMA PARA BAJAS Y REINGRESOS DE ALUMNOS
-- ============================================

-- Tabla de Bajas (Histórico de alumnos dados de baja)
CREATE TABLE IF NOT EXISTS alumnos_bajas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID,  -- Referencia al alumno original (puede ser null si se eliminó)
  credencial1 VARCHAR(10) NOT NULL,
  credencial2 VARCHAR(10),
  nombre VARCHAR(200) NOT NULL,
  apellidos VARCHAR(200),
  edad INTEGER,
  fecha_nacimiento DATE,
  direccion1 VARCHAR(300),
  direccion2 VARCHAR(300),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  telefono VARCHAR(20),
  celular VARCHAR(20),
  email VARCHAR(150),
  nombre_padre VARCHAR(200),
  celular_padre VARCHAR(20),
  nombre_madre VARCHAR(200),
  celular_madre VARCHAR(20),
  rfc_tutor VARCHAR(13),
  grupo VARCHAR(20),
  curso VARCHAR(100),
  grado VARCHAR(50),
  instrumento_id UUID REFERENCES instrumentos(id),
  medio_entero_id UUID REFERENCES medios_contacto(id),
  motivo_baja_id UUID REFERENCES motivos_baja(id),
  fecha_ingreso DATE,
  fecha_baja DATE NOT NULL DEFAULT CURRENT_DATE,
  beca BOOLEAN DEFAULT false,
  porcentaje_beca DECIMAL(5,2),
  comentario TEXT,
  observaciones TEXT,
  reingresado BOOLEAN DEFAULT false,  -- Marca si el alumno reingresó
  fecha_reingreso DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reingresos (Histórico de reingresos)
CREATE TABLE IF NOT EXISTS alumnos_reingresos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  baja_id UUID REFERENCES alumnos_bajas(id),  -- Referencia a la baja original
  alumno_nuevo_id UUID REFERENCES alumnos(id),  -- Referencia al nuevo registro activo
  credencial1 VARCHAR(10) NOT NULL,
  credencial2 VARCHAR(10),
  nombre VARCHAR(200) NOT NULL,
  grupo_anterior VARCHAR(20),
  grupo_nuevo VARCHAR(20),
  beca BOOLEAN DEFAULT false,
  porcentaje_beca DECIMAL(5,2),
  fecha_reingreso DATE NOT NULL DEFAULT CURRENT_DATE,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_bajas_credencial ON alumnos_bajas(credencial1);
CREATE INDEX IF NOT EXISTS idx_bajas_nombre ON alumnos_bajas(nombre);
CREATE INDEX IF NOT EXISTS idx_bajas_fecha ON alumnos_bajas(fecha_baja);
CREATE INDEX IF NOT EXISTS idx_bajas_reingresado ON alumnos_bajas(reingresado);
CREATE INDEX IF NOT EXISTS idx_reingresos_fecha ON alumnos_reingresos(fecha_reingreso);

-- Función para dar de baja a un alumno
CREATE OR REPLACE FUNCTION dar_baja_alumno(
    p_alumno_id UUID,
    p_motivo_baja_id UUID,
    p_fecha_baja DATE,
    p_observaciones TEXT
)
RETURNS UUID AS $$
DECLARE
    v_baja_id UUID;
    v_alumno RECORD;
BEGIN
    -- Obtener datos del alumno
    SELECT * INTO v_alumno FROM alumnos WHERE id = p_alumno_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Alumno no encontrado';
    END IF;
    
    -- Insertar en tabla de bajas
    INSERT INTO alumnos_bajas (
        alumno_id, credencial1, credencial2, nombre, apellidos,
        edad, fecha_nacimiento, direccion1, direccion2, ciudad, codigo_postal,
        telefono, celular, email, nombre_padre, celular_padre,
        nombre_madre, celular_madre, rfc_tutor, grupo, curso, grado,
        instrumento_id, medio_entero_id, motivo_baja_id,
        fecha_ingreso, fecha_baja, beca, porcentaje_beca,
        comentario, observaciones
    ) VALUES (
        v_alumno.id, v_alumno.credencial1, v_alumno.credencial2,
        v_alumno.nombre, v_alumno.apellidos, v_alumno.edad,
        v_alumno.fecha_nacimiento, v_alumno.direccion1, v_alumno.direccion2,
        v_alumno.ciudad, v_alumno.codigo_postal, v_alumno.telefono,
        v_alumno.celular, v_alumno.email, v_alumno.nombre_padre,
        v_alumno.celular_padre, v_alumno.nombre_madre, v_alumno.celular_madre,
        v_alumno.rfc_tutor, v_alumno.grupo, v_alumno.curso, v_alumno.grado,
        NULL, NULL, p_motivo_baja_id,  -- instrumento y medio se pueden agregar después
        v_alumno.fecha_ingreso, p_fecha_baja, v_alumno.beca,
        v_alumno.porcentaje_beca, v_alumno.comentario, p_observaciones
    ) RETURNING id INTO v_baja_id;
    
    -- Actualizar status del alumno a 'baja'
    UPDATE alumnos 
    SET status = 'baja',
        fecha_baja = p_fecha_baja,
        motivo_baja = (SELECT clave FROM motivos_baja WHERE id = p_motivo_baja_id),
        updated_at = NOW()
    WHERE id = p_alumno_id;
    
    RETURN v_baja_id;
END;
$$ LANGUAGE plpgsql;

-- Función para reingresar a un alumno
CREATE OR REPLACE FUNCTION reingresar_alumno(
    p_baja_id UUID,
    p_grupo_nuevo VARCHAR(20),
    p_beca BOOLEAN,
    p_porcentaje_beca DECIMAL(5,2),
    p_observaciones TEXT
)
RETURNS UUID AS $$
DECLARE
    v_alumno_id UUID;
    v_reingreso_id UUID;
    v_baja RECORD;
BEGIN
    -- Obtener datos de la baja
    SELECT * INTO v_baja FROM alumnos_bajas WHERE id = p_baja_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registro de baja no encontrado';
    END IF;
    
    IF v_baja.reingresado THEN
        RAISE EXCEPTION 'Este alumno ya fue reingresado anteriormente';
    END IF;
    
    -- Insertar nuevo registro en alumnos (reactivar)
    INSERT INTO alumnos (
        credencial1, credencial2, nombre, apellidos,
        edad, fecha_nacimiento, direccion1, direccion2, ciudad, codigo_postal,
        telefono, celular, email, nombre_padre, celular_padre,
        nombre_madre, celular_madre, rfc_tutor, grupo, curso, grado,
        fecha_ingreso, status, beca, porcentaje_beca, comentario
    ) VALUES (
        v_baja.credencial1, v_baja.credencial2, v_baja.nombre, v_baja.apellidos,
        v_baja.edad, v_baja.fecha_nacimiento, v_baja.direccion1, v_baja.direccion2,
        v_baja.ciudad, v_baja.codigo_postal, v_baja.telefono, v_baja.celular,
        v_baja.email, v_baja.nombre_padre, v_baja.celular_padre,
        v_baja.nombre_madre, v_baja.celular_madre, v_baja.rfc_tutor,
        p_grupo_nuevo, v_baja.curso, v_baja.grado,
        CURRENT_DATE, 'activo', p_beca, p_porcentaje_beca, v_baja.comentario
    ) RETURNING id INTO v_alumno_id;
    
    -- Registrar el reingreso
    INSERT INTO alumnos_reingresos (
        baja_id, alumno_nuevo_id, credencial1, credencial2, nombre,
        grupo_anterior, grupo_nuevo, beca, porcentaje_beca,
        fecha_reingreso, observaciones
    ) VALUES (
        p_baja_id, v_alumno_id, v_baja.credencial1, v_baja.credencial2,
        v_baja.nombre, v_baja.grupo, p_grupo_nuevo, p_beca, p_porcentaje_beca,
        CURRENT_DATE, p_observaciones
    ) RETURNING id INTO v_reingreso_id;
    
    -- Marcar la baja como reingresada
    UPDATE alumnos_bajas
    SET reingresado = true,
        fecha_reingreso = CURRENT_DATE
    WHERE id = p_baja_id;
    
    RETURN v_alumno_id;
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE alumnos_bajas IS 'Histórico de alumnos dados de baja';
COMMENT ON TABLE alumnos_reingresos IS 'Histórico de reingresos de alumnos';
COMMENT ON COLUMN alumnos_bajas.reingresado IS 'Indica si el alumno reingresó posteriormente';
COMMENT ON FUNCTION dar_baja_alumno IS 'Mueve un alumno activo a la tabla de bajas';
COMMENT ON FUNCTION reingresar_alumno IS 'Reactiva un alumno dado de baja';
