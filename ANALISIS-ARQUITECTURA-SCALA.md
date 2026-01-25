# 🎵 ANÁLISIS ARQUITECTÓNICO - SISTEMA SCALA (Academia de Música)

## 📋 RESUMEN EJECUTIVO

**Sistema Legacy:** Microsoft Access (VBA + Jet Database)  
**Sistema Objetivo:** Web Application (HTML/CSS/JS + Supabase PostgreSQL)  
**Estado Actual:** ~40% migrado, falta lógica de negocio crítica  
**Complejidad:** Media-Alta (Sistema de gestión escolar completo)

---

## 🏗️ ARQUITECTURA DEL SISTEMA LEGACY

### Componentes Principales

1. **Base de Datos (Access/Jet)**
   - Tablas principales de datos
   - Consultas SQL parametrizadas
   - Relaciones y constraints

2. **Capa de Presentación (Forms)**
   - 60+ formularios de Access
   - Interfaz de usuario rica
   - Validaciones en cliente

3. **Lógica de Negocio (VBA Modules)**
   - Módulos de utilidades
   - Rutinas de caja/pagos
   - Funciones de seguridad

4. **Reportes (Access Reports)**
   - 80+ reportes predefinidos
   - Generación de documentos
   - Análisis y estadísticas

---

## 📊 ANÁLISIS DE NORMALIZACIÓN DE DATOS

### ✅ Aspectos Bien Normalizados


**1. Separación de Entidades Principales**
- ✅ Alumnos, Maestros, Cursos, Grupos están separados
- ✅ Uso de claves primarias (Credencial, IDs)
- ✅ Relaciones definidas correctamente

**2. Tablas de Catálogos**
- ✅ Motivos de baja
- ✅ Instrumentos musicales
- ✅ Medios de contacto
- ✅ Salones

**3. Transacciones Separadas**
- ✅ Recibos (cabecera)
- ✅ Operaciones (detalle)
- ✅ Colegiaturas
- ✅ Pagos

### ⚠️ Áreas de Mejora en Normalización

**1. Campos Redundantes**
```
Alumnos.Grupo → Debería estar en tabla intermedia Inscripciones
Alumnos.Curso → Se puede derivar de Grupo
Grupos.Alumnos (contador) → Debería calcularse dinámicamente
```

**2. Datos Calculados Almacenados**
```
Operaciones.Neto → Debería calcularse (Monto - Descuento + IVA)
Grupos.Cupo vs Grupos.Alumnos → Redundancia
```

**3. Falta de Historial**
```
No hay tabla de Inscripciones con fechas
No hay historial de cambios de grupo
No hay auditoría de modificaciones
```


---

## 🔍 ESTRUCTURA DE TABLAS IDENTIFICADAS

### Tablas Core (Maestros)

#### 1. **Alumnos**
```sql
CREATE TABLE alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credencial1 VARCHAR(10) UNIQUE NOT NULL,
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
  
  -- Datos de padres/tutores
  nombre_padre VARCHAR(200),
  celular_padre VARCHAR(20),
  nombre_madre VARCHAR(200),
  celular_madre VARCHAR(20),
  rfc_tutor VARCHAR(13),
  
  -- Datos académicos
  grupo VARCHAR(20),
  curso VARCHAR(100),
  grado VARCHAR(50),
  instrumento VARCHAR(100),
  
  -- Datos administrativos
  fecha_ingreso DATE,
  fecha_baja DATE,
  motivo_baja VARCHAR(50),
  status VARCHAR(20) DEFAULT 'activo', -- activo, baja, reingreso
  beca BOOLEAN DEFAULT false,
  porcentaje_beca DECIMAL(5,2),
  medio_entero VARCHAR(50), -- Cómo se enteró de la escuela
  
  -- Observaciones
  comentario TEXT,
  observaciones TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```


#### 2. **Maestros**
```sql
CREATE TABLE maestros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  direccion VARCHAR(300),
  telefono VARCHAR(20),
  celular VARCHAR(20),
  email VARCHAR(150),
  grado VARCHAR(100), -- Nivel académico del maestro
  detalles_grado TEXT,
  fecha_ingreso DATE,
  fecha_baja DATE,
  status VARCHAR(20) DEFAULT 'activo',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **Cursos**
```sql
CREATE TABLE cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  duracion_meses INTEGER,
  precio_mensual DECIMAL(10,2),
  precio_inscripcion DECIMAL(10,2),
  nivel VARCHAR(50), -- Básico, Intermedio, Avanzado
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **Grupos**
```sql
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(20) UNIQUE NOT NULL,
  curso_id UUID REFERENCES cursos(id),
  maestro_id UUID REFERENCES maestros(id),
  salon_id UUID REFERENCES salones(id),
  
  -- Horario
  dia VARCHAR(2), -- LU, MA, MI, JU, VI, SA, DO
  hora_entrada TIME,
  hora_salida TIME,
  
  -- Capacidad
  cupo INTEGER DEFAULT 10,
  alumnos_inscritos INTEGER DEFAULT 0,
  
  -- Progreso académico
  inicio DATE,
  leccion VARCHAR(50),
  fecha_leccion DATE,
  
  status VARCHAR(20) DEFAULT 'activo',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```


#### 5. **Salones**
```sql
CREATE TABLE salones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero VARCHAR(20) UNIQUE NOT NULL,
  ubicacion VARCHAR(200),
  cupo INTEGER DEFAULT 10,
  instrumentos TEXT, -- Lista de instrumentos disponibles
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tablas de Catálogos

#### 6. **Motivos de Baja**
```sql
CREATE TABLE motivos_baja (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(10) UNIQUE NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. **Instrumentos**
```sql
CREATE TABLE instrumentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(10) UNIQUE NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. **Medios de Contacto**
```sql
CREATE TABLE medios_contacto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(10) UNIQUE NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  tipo VARCHAR(50), -- Publicidad, Recomendación, Beca, etc.
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```


### Tablas Transaccionales (Caja/Pagos)

#### 9. **Recibos** (Cabecera de transacción)
```sql
CREATE TABLE recibos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER UNIQUE NOT NULL, -- Número consecutivo de recibo
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  
  -- Totales
  subtotal DECIMAL(10,2),
  descuento_general DECIMAL(10,2),
  iva DECIMAL(10,2),
  total DECIMAL(10,2),
  
  -- Forma de pago
  efectivo DECIMAL(10,2),
  cheque DECIMAL(10,2),
  datos_cheque TEXT, -- Banco, número, fecha
  
  -- Facturación
  requiere_factura BOOLEAN DEFAULT false,
  rfc_factura VARCHAR(13),
  nombre_factura VARCHAR(200),
  direccion_factura TEXT,
  
  -- Control
  cancelado BOOLEAN DEFAULT false,
  fecha_cancelacion TIMESTAMP,
  motivo_cancelacion TEXT,
  usuario_id UUID,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. **Operaciones** (Detalle de transacción)
```sql
CREATE TABLE operaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recibo_id UUID REFERENCES recibos(id) ON DELETE CASCADE,
  
  -- Descripción
  operacion TEXT NOT NULL, -- Descripción del concepto
  tipo VARCHAR(50), -- Colegiatura, Inscripción, Examen, Artículo, Otro
  
  -- Alumno relacionado (si aplica)
  credencial VARCHAR(10),
  alumno_id UUID REFERENCES alumnos(id),
  grupo VARCHAR(20),
  
  -- Montos
  cantidad INTEGER DEFAULT 1,
  monto DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  iva DECIMAL(10,2) DEFAULT 0,
  neto DECIMAL(10,2) NOT NULL, -- Monto final
  
  created_at TIMESTAMP DEFAULT NOW()
);
```


#### 11. **Colegiaturas** (Pagos mensuales)
```sql
CREATE TABLE colegiaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID REFERENCES alumnos(id),
  recibo_id UUID REFERENCES recibos(id),
  
  -- Período
  anio INTEGER NOT NULL,
  mes INTEGER NOT NULL, -- 1-12
  
  -- Montos
  precio DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  monto_pagado DECIMAL(10,2) NOT NULL,
  
  -- Datos del grupo al momento del pago
  grupo VARCHAR(20),
  curso VARCHAR(100),
  
  fecha_pago DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(alumno_id, anio, mes)
);
```

#### 12. **Artículos** (Inventario)
```sql
CREATE TABLE articulos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(20) UNIQUE NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  grupo_articulo VARCHAR(50), -- Categoría
  precio DECIMAL(10,2) NOT NULL,
  existencia INTEGER DEFAULT 0,
  minimo INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 13. **Movimientos de Inventario**
```sql
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  articulo_id UUID REFERENCES articulos(id),
  tipo VARCHAR(20) NOT NULL, -- Entrada, Salida, Ajuste
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2),
  total DECIMAL(10,2),
  
  -- Referencia
  recibo_id UUID REFERENCES recibos(id),
  operacion_id UUID REFERENCES operaciones(id),
  
  observaciones TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  usuario_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```


### Tablas de Exámenes

#### 14. **Programación de Exámenes**
```sql
CREATE TABLE programacion_examenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID REFERENCES alumnos(id),
  credencial VARCHAR(10),
  
  -- Datos del examen
  clave_examen VARCHAR(50),
  tipo_examen VARCHAR(50), -- Parcial, Final, Extraordinario
  fecha DATE NOT NULL,
  hora TIME,
  
  -- Asignación
  maestro_id UUID REFERENCES maestros(id),
  salon_id UUID REFERENCES salones(id),
  
  -- Resultados
  calificacion DECIMAL(5,2),
  aprobado BOOLEAN,
  certificado VARCHAR(50),
  
  -- Pago
  pagado BOOLEAN DEFAULT false,
  monto DECIMAL(10,2),
  recibo_id UUID REFERENCES recibos(id),
  
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tablas de Prospectos

#### 15. **Prospectos**
```sql
CREATE TABLE prospectos (
  id SERIAL PRIMARY KEY,
  fecha_atencion DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Datos personales
  nombre VARCHAR(200) NOT NULL,
  apellidos VARCHAR(200),
  edad INTEGER,
  telefono VARCHAR(20),
  direccion VARCHAR(300),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  
  -- Interés
  curso_id UUID REFERENCES cursos(id),
  medio_entero VARCHAR(50), -- Cómo se enteró
  recomienda VARCHAR(200), -- Quién lo recomendó
  
  -- Preferencias de horario
  dia_preferente1 VARCHAR(2),
  hora_preferente1 TIME,
  dia_preferente2 VARCHAR(2),
  hora_preferente2 TIME,
  
  -- Seguimiento
  se_inscribio VARCHAR(10) DEFAULT 'No', -- Si, No, Pendiente
  sigue_interesado VARCHAR(10) DEFAULT 'Si',
  nota TEXT,
  atendio VARCHAR(100), -- Quién atendió
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```


### Tablas de Seguridad y Control

#### 16. **Usuarios**
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hash bcrypt
  nombre VARCHAR(200) NOT NULL,
  email VARCHAR(150),
  
  -- Permisos
  rol VARCHAR(50) DEFAULT 'usuario', -- admin, cajero, maestro, usuario
  manto_gral VARCHAR(1), -- M = Mantenimiento general
  
  -- Módulos permitidos
  acceso_alumnos BOOLEAN DEFAULT false,
  acceso_caja BOOLEAN DEFAULT false,
  acceso_reportes BOOLEAN DEFAULT false,
  acceso_examenes BOOLEAN DEFAULT false,
  acceso_mantenimiento BOOLEAN DEFAULT false,
  acceso_seguridad BOOLEAN DEFAULT false,
  
  activo BOOLEAN DEFAULT true,
  ultimo_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 17. **Login History**
```sql
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(50) NOT NULL,
  login_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT
);
```

#### 18. **RFC Clientes** (Para facturación)
```sql
CREATE TABLE rfc_clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfc VARCHAR(13) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  direccion1 VARCHAR(300),
  direccion2 VARCHAR(300),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 19. **Factores** (Comisiones de maestros)
```sql
CREATE TABLE factores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maestro_id UUID REFERENCES maestros(id),
  curso_id UUID REFERENCES cursos(id),
  factor INTEGER NOT NULL, -- Porcentaje * 100 (ej: 50 = 0.50%)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(maestro_id, curso_id)
);
```


### Tablas de Auditoría y Control

#### 20. **Cambios de Alumnos** (Historial)
```sql
CREATE TABLE cambios_alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID REFERENCES alumnos(id),
  credencial VARCHAR(10),
  
  tipo_cambio VARCHAR(50), -- Grupo, Curso, Datos, Baja, Reingreso
  grupo_anterior VARCHAR(20),
  grupo_nuevo VARCHAR(20),
  curso_anterior VARCHAR(100),
  curso_nuevo VARCHAR(100),
  
  motivo TEXT,
  fecha_cambio DATE NOT NULL DEFAULT CURRENT_DATE,
  usuario_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 21. **Operaciones Canceladas**
```sql
CREATE TABLE operaciones_canceladas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Copia de la operación original
  credencial VARCHAR(10),
  operacion TEXT,
  monto DECIMAL(10,2),
  recibo INTEGER,
  grupo VARCHAR(20),
  iva DECIMAL(10,2),
  cantidad INTEGER,
  descuento DECIMAL(10,2),
  general DECIMAL(10,2),
  neto DECIMAL(10,2),
  
  -- Control de cancelación
  fecha_cancelacion TIMESTAMP NOT NULL DEFAULT NOW(),
  motivo_cancelacion TEXT,
  usuario_id UUID,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 LÓGICA DE NEGOCIO PRINCIPAL

### 1. **Sistema de Credenciales (dig_ver)**

**Función:** Genera dígito verificador para credenciales de alumnos

**Algoritmo:**
```javascript
function generarDigitoVerificador(credencial) {
  // Credencial de 5 dígitos: ABCDE
  const num = parseInt(credencial);
  
  const diezm = Math.floor(num / 10000);
  const miles = Math.floor((num % 10000) / 1000);
  const cientos = Math.floor((num % 1000) / 100);
  const dieces = Math.floor((num % 100) / 10);
  const unidades = num % 10;
  
  // Suma ponderada
  const suma = (diezm * 6) + (miles * 5) + (cientos * 4) + 
                (dieces * 3) + (unidades * 2);
  
  const digito = suma % 7;
  return 7 - digito;
}
```

**Uso:** Validación de credenciales al capturar datos


### 2. **Conversión de Números a Letras (valor_cant)**

**Función:** Convierte cantidades numéricas a texto para recibos

**Uso:** Impresión de recibos con cantidad en letra

**Ejemplo:**
```
1250.50 → "Un Mil Doscientos Cincuenta Pesos 50/100 m.n."
```

### 3. **Sistema de Autenticación (login)**

**Flujo:**
1. Usuario ingresa UserID y Password
2. Sistema busca en tabla Usuarios
3. Valida password (máximo 3 intentos)
4. Registra login en tabla login_history
5. Abre menú principal con permisos correspondientes
6. **Fecha de expiración:** 1 de agosto de 2026

**Seguridad:**
- Máximo 3 intentos fallidos
- Cierre automático después de 3 intentos
- Registro de todos los accesos

### 4. **Proceso de Pagos (Caja)**

**Flujo Principal:**
```
1. Buscar alumno por credencial o nombre
2. Mostrar datos del alumno y adeudos
3. Seleccionar conceptos a pagar:
   - Colegiatura mensual
   - Inscripción
   - Exámenes
   - Artículos
   - Otros
4. Aplicar descuentos (becas, promociones)
5. Calcular IVA (16%)
6. Seleccionar forma de pago:
   - Efectivo
   - Cheque
   - Mixto
7. Generar recibo
8. Imprimir recibo
9. Actualizar saldos y existencias
```

**Reglas de Negocio:**
- Becas: Descuento porcentual sobre colegiatura
- IVA: 16% sobre conceptos gravados
- Recibos: Numeración consecutiva automática
- Cancelación: Requiere autorización especial


### 5. **Cortes de Caja**

**Corte 1 - Resumen Diario:**
- Total de operaciones del día
- Agrupado por tipo de operación
- Totales de efectivo y cheques

**Corte 2 - Detalle por Grupo:**
- Número de recibos por grupo
- Suma de IVA por grupo
- Suma de neto por grupo
- Fecha parametrizada

**Corte 3 - Detalle Completo:**
- Todos los recibos en rango de fechas
- Detalle de cada operación
- Datos de cheques
- Totales generales

### 6. **Gestión de Alumnos**

**Alta de Alumnos:**
1. Generar credencial automática (consecutivo)
2. Calcular dígito verificador
3. Capturar datos personales
4. Asignar a grupo
5. Registrar medio de contacto
6. Aplicar beca si corresponde

**Baja de Alumnos:**
1. Buscar alumno activo
2. Registrar fecha de baja
3. Seleccionar motivo de baja
4. Capturar observaciones
5. Cambiar status a "baja"
6. Mantener historial de pagos y exámenes

**Reingreso:**
1. Buscar alumno dado de baja
2. Verificar adeudos pendientes
3. Actualizar datos si es necesario
4. Asignar nuevo grupo
5. Cambiar status a "activo"
6. Registrar fecha de reingreso

### 7. **Gestión de Grupos**

**Creación de Grupos:**
- Asignar clave única
- Seleccionar curso
- Asignar maestro
- Definir horario (día y hora)
- Asignar salón
- Establecer cupo máximo

**Control de Cupo:**
- Verificar disponibilidad antes de inscribir
- Actualizar contador de alumnos
- Alertar cuando se alcance el cupo


### 8. **Programación de Exámenes**

**Flujo:**
1. Seleccionar alumno
2. Definir tipo de examen
3. Asignar fecha y hora
4. Asignar maestro evaluador
5. Asignar salón
6. Registrar pago del examen
7. Generar recibo

**Reasignación:**
- Cambiar fecha/hora
- Cambiar maestro
- Cambiar salón
- Mantener historial de cambios

### 9. **Cálculo de Honorarios de Maestros**

**Fórmula:**
```
Honorarios = Σ (Alumnos_por_Curso × Colegiatura × Factor)

Donde:
- Factor = Porcentaje de comisión (ej: 50 = 0.50%)
- Se calcula por curso
- Se agrupa por maestro
```

**Reportes:**
- Honorarios mensuales por maestro
- Detalle de alumnos por grupo
- Factores aplicados
- Totales y subtotales

---

## 📊 REPORTES PRINCIPALES

### Reportes de Alumnos
1. **Listado de alumnos activos** (por credencial, nombre, curso, grupo)
2. **Alumnos con email** (para comunicación)
3. **Alumnos por instrumento**
4. **Alumnos por medio de contacto**
5. **Alumnos sin pago de colegiatura**
6. **Alumnos con becas**

### Reportes de Bajas
1. **Listado de bajas** (con último pago)
2. **Bajas por motivo**
3. **Bajas por maestro y curso**
4. **Análisis de bajas mensual**

### Reportes Financieros
1. **Colegiaturas por curso**
2. **Análisis de ingresos**
3. **Artículos vendidos**
4. **Deudores** (alumnos con adeudos)
5. **Pagos adelantados**

### Reportes de Caja
1. **Corte diario**
2. **Recibos emitidos** (por rango de fechas)
3. **Recibos cancelados**
4. **Verificación de movimientos**

### Reportes de Maestros
1. **Maestros con factores**
2. **Pago de honorarios**
3. **Maestros por día**
4. **Resumen de alumnos por maestro**

### Reportes de Exámenes
1. **Programación de exámenes**
2. **Relación de exámenes**
3. **Concentrado por tipo de examen**


---

## 🎯 MÓDULOS FALTANTES POR IMPLEMENTAR

### ✅ Módulos Completados (40%)
1. ✅ Estructura HTML/CSS base
2. ✅ Navegación entre módulos
3. ✅ Catálogos simples (Motivos, Instrumentos, Medios)
4. ✅ Formularios de alumnos (parcial)
5. ✅ Conexión a Supabase configurada

### ⚠️ Módulos Parcialmente Implementados (30%)
1. ⚠️ **Alumnos:**
   - ✅ Alta básica
   - ❌ Búsqueda avanzada
   - ❌ Edición completa
   - ✅ Bajas
   - ✅ Reingreso
   - ❌ Historial de cambios

2. ⚠️ **Grupos:**
   - ✅ Listado
   - ❌ Alta completa
   - ❌ Edición
   - ❌ Asignación de alumnos
   - ❌ Control de cupo

3. ⚠️ **Catálogos:**
   - ✅ Maestros (básico)
   - ✅ Cursos (básico)
   - ✅ Salones (básico)
   - ❌ Factores
   - ❌ RFC Clientes (parcial)

### ❌ Módulos NO Implementados (30%)

#### 1. **CAJA (CRÍTICO)**
- ❌ Módulo de pagos completo
- ❌ Generación de recibos
- ❌ Registro de operaciones
- ❌ Cálculo de IVA y descuentos
- ❌ Formas de pago (efectivo/cheque)
- ❌ Impresión de recibos
- ❌ Cancelación de recibos
- ❌ Consulta de pagos

#### 2. **CORTES DE CAJA (CRÍTICO)**
- ❌ Corte 1 (Resumen diario)
- ❌ Corte 2 (Por grupo)
- ❌ Corte 3 (Detalle completo)

#### 3. **EXÁMENES**
- ❌ Programación de exámenes
- ❌ Reasignación de exámenes
- ❌ Relación de exámenes
- ❌ Registro de calificaciones
- ❌ Emisión de certificados

#### 4. **REPORTES (CRÍTICO)**
- ❌ Sistema de generación de reportes
- ❌ Exportación a PDF
- ❌ Filtros y parámetros
- ❌ 80+ reportes del sistema legacy

#### 5. **INVENTARIO**
- ❌ Catálogo de artículos
- ❌ Grupos de artículos
- ❌ Movimientos de inventario
- ❌ Control de existencias
- ❌ Alertas de mínimos

#### 6. **PROSPECTOS**
- ❌ Registro de prospectos
- ❌ Seguimiento
- ❌ Conversión a alumnos
- ❌ Estadísticas de conversión

#### 7. **SEGURIDAD**
- ❌ Gestión de usuarios
- ❌ Asignación de permisos
- ❌ Cambio de contraseñas
- ❌ Auditoría de accesos
- ❌ Roles y permisos por módulo


---

## 🚀 PLAN DE IMPLEMENTACIÓN RECOMENDADO

### FASE 1: Base de Datos (Prioridad ALTA) - 1 semana
1. Crear todas las tablas en Supabase
2. Configurar relaciones y constraints
3. Crear índices para optimización
4. Poblar catálogos iniciales
5. Configurar Row Level Security (RLS)

### FASE 2: Módulos Críticos (Prioridad ALTA) - 3 semanas

#### Semana 1: Sistema de Caja
- Módulo de pagos completo
- Generación de recibos
- Cálculo automático de totales
- Formas de pago
- Impresión de recibos

#### Semana 2: Gestión de Alumnos Completa
- Búsqueda avanzada
- Edición completa
- Historial de cambios
- Asignación a grupos
- Validaciones completas

#### Semana 3: Grupos y Horarios
- Alta y edición de grupos
- Control de cupo
- Asignación de alumnos
- Horarios por curso
- Conflictos de horario

### FASE 3: Reportes Básicos (Prioridad MEDIA) - 2 semanas
1. Sistema de generación de reportes
2. Exportación a PDF
3. 10 reportes más usados:
   - Listado de alumnos
   - Colegiaturas
   - Cortes de caja
   - Honorarios de maestros
   - Deudores

### FASE 4: Módulos Complementarios (Prioridad MEDIA) - 2 semanas
1. Exámenes (programación y registro)
2. Inventario de artículos
3. Prospectos
4. Factores de maestros

### FASE 5: Seguridad y Auditoría (Prioridad ALTA) - 1 semana
1. Sistema de usuarios completo
2. Roles y permisos
3. Auditoría de operaciones
4. Respaldos automáticos

### FASE 6: Reportes Avanzados (Prioridad BAJA) - 2 semanas
1. Reportes estadísticos
2. Gráficas y dashboards
3. Análisis de tendencias
4. Reportes personalizados

---

## 💡 RECOMENDACIONES ARQUITECTÓNICAS

### 1. **Migración de Datos**
```sql
-- Script de migración desde Access
-- Usar herramientas como:
-- - mdb-tools (Linux)
-- - Access Database Engine (Windows)
-- - Exportar a CSV y luego importar a PostgreSQL
```

### 2. **Mejoras en Normalización**

**Crear tabla de Inscripciones:**
```sql
CREATE TABLE inscripciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID REFERENCES alumnos(id),
  grupo_id UUID REFERENCES grupos(id),
  fecha_inscripcion DATE NOT NULL,
  fecha_baja DATE,
  status VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Eliminar redundancias:**
- Quitar `Alumnos.Grupo` y `Alumnos.Curso`
- Obtener grupo actual desde `inscripciones`
- Calcular `Grupos.alumnos_inscritos` dinámicamente


### 3. **Arquitectura de Frontend**

**Estructura Recomendada:**
```
/src
  /modules
    /alumnos
      - alumnos-lista.js
      - alumnos-alta.js
      - alumnos-edicion.js
      - alumnos-bajas.js
    /caja
      - pagos.js
      - recibos.js
      - cortes.js
    /reportes
      - reportes.js
      - pdf-generator.js
  /shared
    - supabase-config.js
    - common.js
    - validators.js
    - formatters.js
  /utils
    - numero-a-letra.js
    - digito-verificador.js
    - date-utils.js
```

### 4. **Librerías Recomendadas**

**Para Reportes:**
- `jsPDF` - Generación de PDFs
- `html2canvas` - Captura de pantalla a imagen
- `Chart.js` - Gráficas y estadísticas

**Para UI:**
- `SweetAlert2` - Alertas y confirmaciones
- `DataTables` - Tablas con búsqueda y paginación
- `Flatpickr` - Selector de fechas

**Para Validaciones:**
- `Validator.js` - Validaciones de formularios
- Custom validators para credenciales

### 5. **Seguridad**

**Row Level Security (RLS) en Supabase:**
```sql
-- Ejemplo: Solo ver alumnos activos
CREATE POLICY "Ver alumnos activos"
ON alumnos FOR SELECT
USING (status = 'activo' OR auth.role() = 'admin');

-- Ejemplo: Solo cajeros pueden crear recibos
CREATE POLICY "Crear recibos"
ON recibos FOR INSERT
WITH CHECK (
  auth.jwt() ->> 'rol' IN ('admin', 'cajero')
);
```

**Encriptación de Passwords:**
```javascript
// Usar bcrypt para passwords
import bcrypt from 'bcryptjs';

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

---

## 📝 SCRIPT SQL COMPLETO PARA SUPABASE

Voy a crear el script completo en un archivo separado...

