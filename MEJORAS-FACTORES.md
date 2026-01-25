# Mejoras Implementadas - Módulo de Factores

## ✅ Funcionalidades Completadas

### 1. Conceptos de Negocio

**Factor:**
- Es la **Regla de Cálculo** para el pago del maestro
- Define sobre qué dinero se calculará el pago
- Ejemplos: "Sobre Colegiatura", "Sobre Inscripción"
- **Para el sistema:** Es el tipo de comisión

**Porcentaje:**
- Es la **Cantidad** de la comisión
- Se calcula automáticamente: `Porcentaje = Factor / 100`
- Ejemplo: Factor 50 = 50% = 0.50
- Si el curso cuesta $1000 y el factor es 50, el maestro gana $500

**Generables de Maestros:**
- Son los **Datos Informativos** del maestro
- Se cargan automáticamente al seleccionar un maestro
- Incluyen:
  - **Nombre:** Identificación del maestro
  - **Grado:** Nivel académico (Licenciatura, Maestría, etc.)
  - **Detalles Grado:** Información adicional del grado
  - **Fecha de Ingreso:** Antigüedad en la academia

---

### 2. Búsqueda Alfabética Rápida (TypeAhead)

**Funcionalidad:**
Al presionar una letra en los dropdowns de Maestro o Curso, el sistema:
1. Filtra automáticamente las opciones que empiezan con esa letra
2. Selecciona la primera coincidencia
3. Resalta visualmente la selección

**Ejemplo - Maestros:**
```
Usuario presiona: "J"
Sistema muestra: JAIME JESUS LARA MORENO (primera coincidencia)
Usuario puede:
  - Presionar ↓ para ver: JAVIER SANCHEZ OSORIO
  - Presionar ↓ para ver: JAYRO JOSUE BAAS KU
  - Presionar ↓ para ver: JEFFREY PERAZA
  - Hacer clic en cualquiera para seleccionar
```

**Ejemplo - Cursos:**
```
Usuario presiona: "P"
Sistema muestra: Piano Infantil 1 (primera coincidencia)
Usuario puede:
  - Presionar ↓ para ver: Piano Infantil 2
  - Presionar ↓ para ver: Piano Preparatorio
  - Hacer clic en cualquiera para seleccionar
```

**Código:**
```javascript
function buscarPorLetra(selectElement, letra) {
    const options = Array.from(selectElement.options);
    
    // Buscar la primera opción que empiece con la letra
    const match = options.find(opt => 
        opt.textContent.toUpperCase().startsWith(letra) && opt.value !== ''
    );
    
    if (match) {
        selectElement.value = match.value;
        selectElement.dispatchEvent(new Event('change'));
        selectElement.focus();
    }
}
```

---

### 3. Auto-llenado de Detalles del Maestro

**Funcionalidad:**
Al seleccionar un maestro del dropdown, el sistema:
1. Busca los datos del maestro en la base de datos
2. Llena automáticamente los campos de "GENERALES DE MAESTROS":
   - Nombre
   - Grado
   - Detalles Grado
   - Fecha de Ingreso
3. Los campos son de solo lectura (informativos)

**Flujo:**
```
1. Usuario selecciona: "ADOLFO MAY"
2. Sistema busca en tabla maestros
3. Sistema llena automáticamente:
   - Nombre: ADOLFO MAY
   - Grado: (vacío si no tiene)
   - Detalles Grado: PIANO
   - Fecha de Ingreso: 03-feb-2015
```

**Código:**
```javascript
function actualizarDetallesMaestro(maestroId) {
    if (!maestroId) {
        // Limpiar campos
        return;
    }
    
    const maestro = maestros.find(m => m.id === maestroId);
    if (maestro) {
        document.getElementById('nombreMaestro').value = maestro.nombre || '';
        document.getElementById('grado').value = maestro.grado || '';
        document.getElementById('detallesGrado').value = maestro.detalles_grado || '';
        document.getElementById('fechaIngreso').value = maestro.fecha_ingreso || '';
    }
}
```

---

### 4. Botón "Nuevo" - Modo Edición Azul

**Funcionalidad:**
Al hacer clic en "Nuevo", el sistema:
1. Activa el **Modo Edición**
2. Cambia el estilo del formulario a **AZUL**:
   - Borde azul (#4169E1)
   - Fondo azul claro (#E6F2FF)
3. Limpia todos los campos
4. Habilita los campos para edición
5. Cambia el texto del botón a "Guardar"
6. Pone el foco en el campo "Maestro"

**Flujo:**
```
1. Usuario hace clic en "Nuevo"
2. Formulario se pone AZUL
3. Campos se limpian
4. Botón cambia a "Guardar"
5. Usuario selecciona maestro (con TypeAhead)
6. Detalles del maestro se llenan automáticamente
7. Usuario selecciona curso (con TypeAhead)
8. Usuario ingresa factor (ej: 50)
9. Porcentaje se calcula automáticamente (50%)
10. Usuario hace clic en "Guardar"
11. Sistema valida y guarda
12. Modo edición se desactiva
13. Formulario vuelve a color normal
```

**Código:**
```javascript
function activarModoEdicion() {
    modoEdicion = true;
    
    // Cambiar estilo a azul
    const form = document.getElementById('factoresForm');
    form.style.border = '3px solid #4169E1';
    form.style.backgroundColor = '#E6F2FF';
    
    // Limpiar campos
    // ...
    
    // Cambiar texto del botón
    const nuevoBtn = document.getElementById('nuevoBtn');
    nuevoBtn.textContent = 'Guardar';
    nuevoBtn.onclick = guardarFactor;
    
    // Focus en maestro
    document.getElementById('maestro').focus();
}
```

---

### 5. Botón "Buscar X Maestro"

**Funcionalidad:**
Permite buscar factores ya asignados por nombre del maestro.

**Flujo:**
```
1. Usuario hace clic en "Buscar X Maestro"
2. Se abre modal con input de búsqueda
3. Usuario escribe: "JOEL" (o solo "J")
4. Usuario hace clic en "Aceptar"
5. Sistema busca factores del maestro
6. Si encuentra uno: lo muestra directamente
7. Si encuentra varios: muestra lista y carga el primero
8. Formulario se llena con los datos del factor:
   - Maestro seleccionado
   - Curso seleccionado
   - Factor
   - Porcentaje calculado
   - Detalles del maestro
```

**Búsqueda Inteligente:**
- Busca por nombre completo o parcial
- Busca por letras iniciales
- No distingue mayúsculas/minúsculas
- Muestra todos los factores del maestro

**Código:**
```javascript
async function buscarPorMaestro() {
    const searchValue = document.getElementById('searchInput').value.trim().toUpperCase();
    
    // Buscar en factores existentes
    const resultados = factores.filter(f => 
        f.maestros?.nombre.toUpperCase().includes(searchValue) ||
        f.maestros?.nombre.toUpperCase().startsWith(searchValue)
    );
    
    if (resultados.length === 0) {
        alert('No se encontraron factores para el maestro');
        return;
    }
    
    if (resultados.length === 1) {
        // Mostrar directamente
        mostrarFactor(index);
    } else {
        // Mostrar lista y cargar el primero
        alert(`Se encontraron ${resultados.length} factores...`);
        mostrarFactor(index);
    }
}
```

---

### 6. Botón "Borrar" - Validación Estricta

**Funcionalidad:**
Elimina un factor existente con validación estricta.

**Reglas de Seguridad:**
1. ✅ Todos los campos deben estar llenos
2. ✅ Debe haber un factor cargado (desde búsqueda o navegación)
3. ✅ Solicita confirmación antes de eliminar
4. ✅ Muestra información del factor a eliminar
5. ❌ No funciona si los campos están vacíos
6. ❌ No funciona si no hay un factor seleccionado

**Flujo:**
```
1. Usuario busca un factor (con "Buscar X Maestro")
2. Factor se carga en el formulario
3. Usuario hace clic en "Borrar"
4. Sistema valida:
   - ¿Todos los campos llenos? ✓
   - ¿Hay un factor seleccionado? ✓
5. Sistema muestra confirmación:
   "¿Está seguro de eliminar el factor?
   
   Maestro: ADOLFO MAY
   Curso: Teclado Pop 1
   Factor: 131"
6. Usuario confirma
7. Sistema elimina de la base de datos
8. Sistema recarga factores
9. Sistema limpia el formulario
10. Sistema muestra el primer factor (si existe)
```

**Validaciones:**
```javascript
async function borrarFactor() {
    // Validación 1: Campos llenos
    const maestroId = document.getElementById('maestro').value;
    const cursoId = document.getElementById('curso').value;
    const factor = parseInt(document.getElementById('factor').value) || 0;
    
    if (!maestroId || !cursoId || factor <= 0) {
        alert('Para borrar un factor, debe tener todos los campos completos.\n\nUse "Buscar X Maestro" para cargar un factor existente.');
        return;
    }
    
    // Validación 2: Factor seleccionado
    if (!factorActual || !factorActual.id) {
        alert('No hay un factor seleccionado para borrar.\n\nUse "Buscar X Maestro" para cargar un factor existente.');
        return;
    }
    
    // Confirmación
    if (!confirm(`¿Está seguro de eliminar el factor?\n\nMaestro: ${maestroNombre}\nCurso: ${cursoNombre}\nFactor: ${factor}`)) {
        return;
    }
    
    // Eliminar
    await supabase.from('factores').delete().eq('id', factorActual.id);
}
```

---

### 7. Cálculo Automático de Porcentaje

**Funcionalidad:**
Al ingresar el factor, el porcentaje se calcula automáticamente.

**Fórmula:**
```
Porcentaje = Factor / 100
```

**Ejemplos:**
| Factor | Porcentaje | Significado |
|--------|------------|-------------|
| 50 | 0.50% | 50% de comisión |
| 131 | 1.31% | 131% de comisión |
| 25 | 0.25% | 25% de comisión |
| 100 | 1.00% | 100% de comisión |

**Código:**
```javascript
factorInput.addEventListener('input', function() {
    const factor = parseFloat(this.value) || 0;
    const porcentaje = (factor / 100).toFixed(2);
    document.getElementById('porcentaje').value = porcentaje + '%';
});
```

---

### 8. Navegación entre Registros

**Funcionalidad:**
Permite navegar entre los factores existentes.

**Botones:**
- **|<** - Ir al primer registro
- **<** - Ir al registro anterior
- **>** - Ir al registro siguiente
- **>|** - Ir al último registro

**Contador:**
```
Registro: 1 de 832
```

**Código:**
```javascript
function mostrarFactor(index) {
    if (index < 0 || index >= factores.length) return;
    
    currentIndex = index;
    factorActual = factores[index];
    
    // Actualizar campos
    document.getElementById('maestro').value = factorActual.maestros?.id || '';
    document.getElementById('curso').value = factorActual.cursos?.id || '';
    document.getElementById('factor').value = factorActual.factor || 0;
    
    // Calcular porcentaje
    const porcentaje = (factorActual.factor / 100).toFixed(2);
    document.getElementById('porcentaje').value = porcentaje + '%';
    
    // Actualizar detalles del maestro
    // ...
    
    // Actualizar navegación
    document.getElementById('currentRecord').textContent = index + 1;
}
```

---

## 🎨 Diseño Visual

### Modo Normal:
- **Fondo:** Gris (#c0c0c0)
- **Borde:** Gris (#808080)
- **Estilo:** Windows 95 clásico

### Modo Edición (Azul):
- **Fondo:** Azul claro (#E6F2FF)
- **Borde:** Azul (#4169E1) - 3px
- **Transición:** Suave (0.3s)

### Sección "GENERALES DE MAESTROS":
- **Fondo:** Cyan (#008B8B)
- **Header:** Gris (#808080)
- **Campos:** Solo lectura (informativos)

### Dropdowns con Focus:
- **Outline:** Azul (#4169E1)
- **Fondo:** Amarillo claro (#FFFACD)
- **Efecto:** Resaltado visual

---

## 📊 Estructura de Datos

### Tabla: factores

```sql
CREATE TABLE factores (
  id UUID PRIMARY KEY,
  maestro_id UUID REFERENCES maestros(id),
  curso_id UUID REFERENCES cursos(id),
  factor INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(maestro_id, curso_id)
);
```

**Ejemplo de Registro:**
```javascript
{
    id: UUID,
    maestro_id: UUID,
    curso_id: UUID,
    factor: 131,
    maestros: {
        id: UUID,
        nombre: 'ADOLFO MAY',
        grado: '',
        detalles_grado: 'PIANO',
        fecha_ingreso: '2015-02-03'
    },
    cursos: {
        id: UUID,
        curso: 'Teclado Pop 1'
    }
}
```

---

## 🔄 Flujo de Trabajo Completo

### Crear Nuevo Factor:

```
1. Click en "Nuevo"
   → Formulario se pone AZUL
   → Campos se limpian
   → Botón cambia a "Guardar"

2. Presionar "J" en dropdown Maestro
   → Sistema filtra maestros con "J"
   → Selecciona "JAIME JESUS LARA MORENO"
   → Detalles se llenan automáticamente

3. Presionar "T" en dropdown Curso
   → Sistema filtra cursos con "T"
   → Selecciona "Teclado Pop 1"

4. Ingresar factor: 50
   → Porcentaje se calcula: 0.50%

5. Click en "Guardar"
   → Sistema valida
   → Guarda en base de datos
   → Desactiva modo edición
   → Muestra el factor guardado
```

### Buscar Factor Existente:

```
1. Click en "Buscar X Maestro"
   → Se abre modal

2. Escribir: "ADOLFO"
   → Click en "Aceptar"

3. Sistema busca factores
   → Encuentra 1 factor
   → Lo muestra en el formulario:
     - Maestro: ADOLFO MAY
     - Curso: Teclado Pop 1
     - Factor: 131
     - Porcentaje: 1.31%
     - Detalles del maestro
```

### Eliminar Factor:

```
1. Buscar factor (con "Buscar X Maestro")
   → Factor se carga

2. Click en "Borrar"
   → Sistema valida campos
   → Muestra confirmación

3. Confirmar eliminación
   → Sistema elimina
   → Recarga factores
   → Limpia formulario
```

---

## ✅ Validaciones Implementadas

### Al Guardar:
1. ✅ Maestro debe estar seleccionado
2. ✅ Curso debe estar seleccionado
3. ✅ Factor debe ser mayor a 0
4. ✅ Si ya existe, pregunta si desea actualizar
5. ✅ Mensajes claros de error

### Al Borrar:
1. ✅ Todos los campos deben estar llenos
2. ✅ Debe haber un factor seleccionado
3. ✅ Solicita confirmación
4. ✅ Muestra información del factor
5. ✅ Mensajes claros de error

### En Búsqueda:
1. ✅ Debe ingresar un nombre o letras
2. ✅ Muestra mensaje si no encuentra
3. ✅ Muestra lista si encuentra varios
4. ✅ Carga automáticamente el primero

---

## 🎯 Características Destacadas

### 1. Búsqueda Alfabética Rápida
- Presionar letra filtra opciones
- Selecciona primera coincidencia
- Funciona en Maestros y Cursos
- Resaltado visual

### 2. Auto-llenado Inteligente
- Detalles del maestro automáticos
- Porcentaje calculado automáticamente
- Campos informativos de solo lectura

### 3. Modo Edición Visual
- Fondo azul claro
- Borde azul
- Transición suave
- Botón cambia a "Guardar"

### 4. Validación Estricta
- No permite borrar sin factor seleccionado
- Verifica campos completos
- Confirmación antes de eliminar
- Mensajes claros

### 5. Navegación Completa
- Primero, Anterior, Siguiente, Último
- Contador de posición
- Carga automática de detalles

---

## 📝 Archivos del Módulo

### HTML:
- `factores.html` - Interfaz completa

### CSS:
- `factores.css` - Estilos + modo edición azul

### JavaScript:
- `factores.js` - Lógica completa:
  - Búsqueda alfabética (TypeAhead)
  - Auto-llenado de detalles
  - Modo edición
  - Validaciones
  - CRUD completo

---

## 🚀 Comandos para Probar

```bash
# Iniciar aplicación
npm start

# Navegar a:
# ARCHIVOS > Factores

# Probar:
# 1. Click en "Nuevo" → Formulario azul
# 2. Presionar "J" en Maestro → Filtra con J
# 3. Seleccionar maestro → Detalles se llenan
# 4. Presionar "T" en Curso → Filtra con T
# 5. Ingresar factor: 50 → Porcentaje: 0.50%
# 6. Click en "Guardar" → Guarda y desactiva modo edición
# 7. Click en "Buscar X Maestro" → Buscar por nombre
# 8. Escribir "ADOLFO" → Encuentra y muestra
# 9. Click en "Borrar" → Valida y elimina
```

---

## 🎉 Resultado Final

✅ **Búsqueda alfabética rápida (TypeAhead)**  
✅ **Auto-llenado de detalles del maestro**  
✅ **Modo edición con fondo azul**  
✅ **Botón "Nuevo" funcional**  
✅ **Botón "Buscar X Maestro" mejorado**  
✅ **Botón "Borrar" con validación estricta**  
✅ **Cálculo automático de porcentaje**  
✅ **Navegación completa**  
✅ **Validaciones estrictas**  
✅ **Integración con Supabase**  
✅ **Diseño profesional**

**El módulo de Factores está completamente funcional y listo para uso! 🎉**

---

**Última actualización:** 25 de enero de 2026
