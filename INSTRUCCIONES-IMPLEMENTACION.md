# 🎯 INSTRUCCIONES DE IMPLEMENTACIÓN - SISTEMA SCALA

## 📦 ARCHIVOS GENERADOS

1. **ANALISIS-ARQUITECTURA-SCALA.md** - Análisis completo del sistema
2. **SUPABASE-SCHEMA.sql** - Script SQL completo para la base de datos
3. **Este archivo** - Instrucciones paso a paso

---

## 🚀 PASO 1: CONFIGURAR BASE DE DATOS EN SUPABASE

### 1.1 Crear Proyecto en Supabase
1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Guarda las credenciales:
   - Project URL
   - API Key (anon/public)
   - Service Role Key

### 1.2 Ejecutar Script SQL
1. En Supabase, ve a **SQL Editor**
2. Crea un nuevo query
3. Copia y pega el contenido completo de `SUPABASE-SCHEMA.sql`
4. Ejecuta el script (Run)
5. Verifica que todas las tablas se crearon correctamente

### 1.3 Verificar Estructura
```sql
-- Ejecuta esto para ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver 21 tablas:
- alumnos
- articulos
- cambios_alumnos
- colegiaturas
- cursos
- factores
- grupos
- grupos_articulos
- instrumentos
- login_history
- maestros
- medios_contacto
- motivos_baja
- movimientos_inventario
- operaciones
- operaciones_canceladas
- programacion_examenes
- prospectos
- recibos
- rfc_clientes
- salones
- usuarios

---

## 🔧 PASO 2: ACTUALIZAR CONFIGURACIÓN DEL PROYECTO

### 2.1 Actualizar supabase-config.js

```javascript
// supabase-config.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'TU_PROJECT_URL'  // ← Cambiar
const supabaseKey = 'TU_ANON_KEY'     // ← Cambiar

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2.2 Instalar Dependencias

```bash
npm install @supabase/supabase-js
npm install bcryptjs
npm install jspdf
npm install sweetalert2
```

---

## 📝 PASO 3: MIGRAR DATOS DESDE ACCESS (OPCIONAL)

Si tienes datos en el sistema Access original:

### Opción A: Exportar a CSV
1. Abre Access
2. Exporta cada tabla a CSV
3. En Supabase, usa **Table Editor** → **Import data from CSV**

### Opción B: Script de Migración
```javascript
// migration-script.js
// Script para migrar datos desde CSV a Supabase
// (Crear script personalizado según necesidades)
```

---

## 🎨 PASO 4: IMPLEMENTAR MÓDULOS FALTANTES

### Prioridad 1: MÓDULO DE CAJA (CRÍTICO)

#### Archivos a crear:
1. `pagos.html` - Interfaz de pagos
2. `pagos.js` - Lógica de pagos
3. `pagos.css` - Estilos

#### Funcionalidades clave:
```javascript
// pagos.js - Estructura básica

// 1. Buscar alumno
async function buscarAlumno(credencial) {
  const { data, error } = await supabase
    .from('alumnos')
    .select('*, grupos(*), cursos(*)')
    .eq('credencial1', credencial)
    .single();
  return data;
}

// 2. Calcular totales
function calcularTotales(operaciones) {
  let subtotal = 0;
  let descuentos = 0;
  let iva = 0;
  
  operaciones.forEach(op => {
    subtotal += op.monto * op.cantidad;
    descuentos += op.descuento;
    iva += op.iva;
  });
  
  const total = subtotal - descuentos + iva;
  return { subtotal, descuentos, iva, total };
}

// 3. Generar recibo
async function generarRecibo(datos) {
  // Insertar recibo
  const { data: recibo, error } = await supabase
    .from('recibos')
    .insert([{
      fecha: new Date().toISOString().split('T')[0],
      subtotal: datos.subtotal,
      descuento_general: datos.descuentos,
      iva: datos.iva,
      total: datos.total,
      efectivo: datos.efectivo,
      cheque: datos.cheque
    }])
    .select()
    .single();
    
  // Insertar operaciones
  for (const op of datos.operaciones) {
    await supabase
      .from('operaciones')
      .insert([{
        recibo_id: recibo.id,
        ...op
      }]);
  }
  
  return recibo;
}

// 4. Imprimir recibo
function imprimirRecibo(recibo) {
  // Usar jsPDF para generar PDF
  const doc = new jsPDF();
  doc.text('SCALA - Academia de Música', 20, 20);
  doc.text(`Recibo No: ${recibo.numero}`, 20, 30);
  // ... más contenido
  doc.save(`recibo-${recibo.numero}.pdf`);
}
```


### Prioridad 2: CORTES DE CAJA

#### cortes.html + cortes.js

```javascript
// Corte 1 - Resumen Diario
async function generarCorte1(fecha) {
  const { data, error } = await supabase
    .from('operaciones')
    .select('*, recibos!inner(*)')
    .eq('recibos.fecha', fecha);
    
  // Agrupar y sumar
  const resumen = {};
  data.forEach(op => {
    if (!resumen[op.tipo]) {
      resumen[op.tipo] = { cantidad: 0, total: 0 };
    }
    resumen[op.tipo].cantidad++;
    resumen[op.tipo].total += parseFloat(op.neto);
  });
  
  return resumen;
}

// Corte 2 - Por Grupo
async function generarCorte2(fecha) {
  const { data, error } = await supabase
    .from('operaciones')
    .select('grupo, iva, neto, recibos!inner(fecha)')
    .eq('recibos.fecha', fecha);
    
  // Agrupar por grupo
  const porGrupo = {};
  data.forEach(op => {
    if (!porGrupo[op.grupo]) {
      porGrupo[op.grupo] = { 
        recibos: 0, 
        iva: 0, 
        neto: 0 
      };
    }
    porGrupo[op.grupo].recibos++;
    porGrupo[op.grupo].iva += parseFloat(op.iva);
    porGrupo[op.grupo].neto += parseFloat(op.neto);
  });
  
  return porGrupo;
}

// Corte 3 - Detalle Completo
async function generarCorte3(fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from('recibos')
    .select('*, operaciones(*)')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin)
    .order('numero', { ascending: true });
    
  return data;
}
```

### Prioridad 3: REPORTES

#### reportes.js - Sistema de Reportes

```javascript
// Estructura base para reportes
class ReporteGenerator {
  constructor() {
    this.doc = new jsPDF();
  }
  
  // Reporte de Alumnos Activos
  async reporteAlumnosActivos() {
    const { data } = await supabase
      .from('alumnos')
      .select('*')
      .eq('status', 'activo')
      .order('credencial1');
      
    this.generarPDF('Alumnos Activos', data);
  }
  
  // Reporte de Colegiaturas
  async reporteColegiaturas(mes, anio) {
    const { data } = await supabase
      .from('colegiaturas')
      .select('*, alumnos(*)')
      .eq('mes', mes)
      .eq('anio', anio);
      
    this.generarPDF('Colegiaturas', data);
  }
  
  // Reporte de Deudores
  async reporteDeudores() {
    const { data } = await supabase
      .rpc('obtener_deudores'); // Función personalizada en Supabase
      
    this.generarPDF('Deudores', data);
  }
  
  generarPDF(titulo, datos) {
    this.doc.text(titulo, 20, 20);
    // Agregar tabla con datos
    // ...
    this.doc.save(`${titulo}.pdf`);
  }
}
```

---

## 🔐 PASO 5: IMPLEMENTAR SEGURIDAD

### 5.1 Sistema de Login

```javascript
// login.js
async function login(userId, password) {
  // Buscar usuario
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('user_id', userId)
    .eq('activo', true)
    .single();
    
  if (error || !usuario) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  // Verificar password (usar bcrypt en producción)
  const passwordValido = await bcrypt.compare(password, usuario.password);
  
  if (!passwordValido) {
    return { success: false, message: 'Contraseña incorrecta' };
  }
  
  // Registrar login
  await supabase
    .from('login_history')
    .insert([{
      user_id: userId,
      login_at: new Date().toISOString()
    }]);
    
  // Guardar sesión
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
  
  return { success: true, usuario };
}

// Verificar permisos
function tienePermiso(modulo) {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  if (!usuario) return false;
  
  const permisos = {
    'alumnos': usuario.acceso_alumnos,
    'caja': usuario.acceso_caja,
    'reportes': usuario.acceso_reportes,
    'examenes': usuario.acceso_examenes,
    'mantenimiento': usuario.acceso_mantenimiento,
    'seguridad': usuario.acceso_seguridad
  };
  
  return permisos[modulo] || usuario.rol === 'admin';
}
```

### 5.2 Proteger Rutas

```javascript
// common.js - Agregar al inicio de cada módulo
function verificarAcceso(modulo) {
  const usuario = sessionStorage.getItem('usuario');
  
  if (!usuario) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (!tienePermiso(modulo)) {
    alert('No tienes permisos para acceder a este módulo');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Usar en cada módulo
if (!verificarAcceso('caja')) {
  // Redirigir
}
```

---

## 📊 PASO 6: FUNCIONES AUXILIARES

### 6.1 Dígito Verificador

```javascript
// validators.js
export function generarDigitoVerificador(credencial) {
  const num = parseInt(credencial);
  
  const diezm = Math.floor(num / 10000);
  const miles = Math.floor((num % 10000) / 1000);
  const cientos = Math.floor((num % 1000) / 100);
  const dieces = Math.floor((num % 100) / 10);
  const unidades = num % 10;
  
  const suma = (diezm * 6) + (miles * 5) + (cientos * 4) + 
                (dieces * 3) + (unidades * 2);
  
  const digito = suma % 7;
  return 7 - digito;
}

export function validarCredencial(credencial) {
  if (credencial.length !== 6) return false;
  
  const numero = credencial.substring(0, 5);
  const digito = parseInt(credencial.substring(5, 6));
  
  return digito === generarDigitoVerificador(numero);
}
```

### 6.2 Número a Letra

```javascript
// formatters.js
export function numeroALetra(cantidad) {
  // Implementación completa del algoritmo
  // Ver SCALA_ExportMOD_Utilerias.txt para referencia
  
  const entero = Math.floor(cantidad);
  const centavos = Math.round((cantidad - entero) * 100);
  
  // ... lógica de conversión ...
  
  return `${textoEntero} Pesos ${centavos.toString().padStart(2, '0')}/100 m.n.`;
}
```


---

## 🧪 PASO 7: PRUEBAS

### 7.1 Datos de Prueba

```sql
-- Insertar datos de prueba
INSERT INTO cursos (curso, precio_mensual, precio_inscripcion) VALUES
('PIANO BASICO', 800.00, 200.00),
('GUITARRA INTERMEDIO', 750.00, 200.00),
('BATERIA AVANZADO', 900.00, 250.00);

INSERT INTO maestros (nombre, telefono) VALUES
('Juan Pérez', '999-123-4567'),
('María García', '999-234-5678');

INSERT INTO salones (numero, ubicacion, cupo) VALUES
('S-101', 'Planta Baja', 10),
('S-201', 'Primer Piso', 8);

-- Crear un grupo de prueba
INSERT INTO grupos (clave, curso_id, maestro_id, salon_id, dia, hora_entrada, cupo)
SELECT 'G-001', c.id, m.id, s.id, 'LU', '16:00', 10
FROM cursos c, maestros m, salones s
WHERE c.curso = 'PIANO BASICO'
  AND m.nombre = 'Juan Pérez'
  AND s.numero = 'S-101'
LIMIT 1;

-- Crear un alumno de prueba
INSERT INTO alumnos (credencial1, nombre, grupo, curso, status)
VALUES ('100001', 'Alumno de Prueba', 'G-001', 'PIANO BASICO', 'activo');
```

### 7.2 Checklist de Pruebas

#### Módulo de Alumnos
- [ ] Alta de alumno
- [ ] Búsqueda por credencial
- [ ] Búsqueda por nombre
- [ ] Edición de datos
- [ ] Baja de alumno
- [ ] Reingreso de alumno

#### Módulo de Caja
- [ ] Buscar alumno
- [ ] Agregar colegiatura
- [ ] Agregar inscripción
- [ ] Agregar artículo
- [ ] Calcular descuentos
- [ ] Calcular IVA
- [ ] Generar recibo
- [ ] Imprimir recibo
- [ ] Cancelar recibo

#### Módulo de Grupos
- [ ] Crear grupo
- [ ] Asignar maestro
- [ ] Asignar salón
- [ ] Verificar cupo
- [ ] Listar alumnos del grupo

#### Módulo de Reportes
- [ ] Generar reporte de alumnos
- [ ] Generar corte de caja
- [ ] Exportar a PDF
- [ ] Filtrar por fechas

---

## 📚 PASO 8: DOCUMENTACIÓN

### 8.1 Manual de Usuario

Crear documentación para:
1. Proceso de alta de alumnos
2. Proceso de pagos
3. Generación de reportes
4. Cortes de caja
5. Gestión de grupos

### 8.2 Manual Técnico

Documentar:
1. Estructura de base de datos
2. Flujos de negocio
3. APIs y funciones
4. Procedimientos de respaldo
5. Troubleshooting

---

## 🚨 CONSIDERACIONES IMPORTANTES

### Seguridad
1. **Cambiar password del admin** en producción
2. **Configurar RLS** en Supabase según roles
3. **Usar HTTPS** en producción
4. **Encriptar passwords** con bcrypt
5. **Validar inputs** en cliente y servidor

### Performance
1. **Índices** ya están creados en el schema
2. **Paginación** en listados grandes
3. **Cache** para catálogos
4. **Lazy loading** de imágenes

### Respaldos
1. **Backup automático** de Supabase (configurar)
2. **Exportar datos** periódicamente
3. **Versionamiento** de código en Git

### Migración
1. **Probar primero** en ambiente de desarrollo
2. **Migrar datos** en horario de baja actividad
3. **Validar datos** después de migración
4. **Mantener Access** como respaldo temporal

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial
- Supabase: https://supabase.com/docs
- jsPDF: https://github.com/parallax/jsPDF
- SweetAlert2: https://sweetalert2.github.io/

### Comunidad
- Stack Overflow
- GitHub Issues
- Discord de Supabase

---

## ✅ CHECKLIST FINAL

### Base de Datos
- [ ] Proyecto Supabase creado
- [ ] Schema ejecutado correctamente
- [ ] Datos de prueba insertados
- [ ] RLS configurado
- [ ] Backups configurados

### Frontend
- [ ] Configuración de Supabase actualizada
- [ ] Dependencias instaladas
- [ ] Módulo de caja implementado
- [ ] Módulo de reportes implementado
- [ ] Sistema de login implementado
- [ ] Validaciones implementadas

### Pruebas
- [ ] Pruebas de alumnos completadas
- [ ] Pruebas de caja completadas
- [ ] Pruebas de reportes completadas
- [ ] Pruebas de seguridad completadas

### Documentación
- [ ] Manual de usuario creado
- [ ] Manual técnico creado
- [ ] Código comentado
- [ ] README actualizado

### Producción
- [ ] Datos migrados
- [ ] Passwords cambiados
- [ ] HTTPS configurado
- [ ] Monitoreo configurado
- [ ] Capacitación de usuarios realizada

---

## 🎉 ¡LISTO!

Una vez completados todos los pasos, tendrás un sistema completamente funcional y moderno para la gestión de la Academia de Música SCALA.

**Tiempo estimado total:** 8-10 semanas
**Prioridad:** Caja > Alumnos > Reportes > Exámenes > Otros

¡Éxito con la implementación!

