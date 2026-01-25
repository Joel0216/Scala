# 🚀 INICIO RÁPIDO - SISTEMA SCALA

## ⚡ EJECUTAR AHORA

```bash
cd C:\Users\PC05\Downloads\Scala
npm start
```

**¡Eso es todo!** La aplicación se abrirá automáticamente.

---

## ✅ VERIFICAR QUE FUNCIONA

### 1. Abrir DevTools
Presiona **F12** en la aplicación

### 2. Ver la Consola
Ve a la pestaña **Console**

### 3. Verificar Mensajes
Debes ver:
```
✓ Supabase inicializado correctamente (Electron/npm)
DOM cargado, inicializando...
✓ X registros cargados
Inicialización completa
```

---

## 🎯 MÓDULOS LISTOS PARA USAR

### 1. CURSOS ✅
**Ruta:** ARCHIVOS → Cursos

**Funciones:**
- ✅ Crear nuevo curso (botón "Nuevo" → página azul)
- ✅ Buscar cursos por nombre o clave
- ✅ Ver cadenas de secuencias (Curso 1 → Curso 2 → Curso 3)
- ✅ Navegar entre registros
- ✅ Editar y eliminar

**Prueba:**
1. Click en "Nuevo"
2. Escribe: "Piano Infantil 1"
3. Clave se genera automáticamente: "P1"
4. Completa Costo: 770
5. Completa IVA: 0.16
6. Click en "Guardar"

---

### 2. ARTÍCULOS ✅
**Ruta:** ARCHIVOS → Artículos

**Funciones:**
- ✅ Crear nuevo artículo (botón "Nuevo" → página azul/morado)
- ✅ Buscar con TypeAhead inteligente:
  - Letras → Busca por GRUPO
  - Alfanumérico → Busca por CLAVE
- ✅ Autocompletado al seleccionar
- ✅ Gestionar grupos de artículos

**Prueba:**
1. Primero crear un grupo:
   - OTROS CATÁLOGOS → Grupos de Artículos
   - Crear grupo: "MÉTODOS"
2. Luego crear artículo:
   - ARCHIVOS → Artículos → Nuevo
   - Clave: EN1
   - Descripción: ENGLISH MUSIC
   - Grupo: MÉTODOS
   - Precio: 770
   - Click en "Guardar"

---

### 3. MOVIMIENTOS DE INVENTARIO ✅
**Ruta:** ARCHIVOS → Movimientos de Inventario

**Funciones:**
- ✅ Crear movimiento (botón "Nuevo")
- ✅ Número automático
- ✅ Tipos: COMPRA (↑), VENTA (↓), ADQUISICIÓN (↑), SALIDA (↓)
- ✅ Agregar múltiples artículos
- ✅ Cálculo automático de totales
- ✅ Stock se actualiza automáticamente

**Prueba:**
1. Click en "Nuevo"
2. Seleccionar tipo: "C - COMPRA"
3. Verás: 📈 Este tipo AUMENTA el inventario
4. Click en "➕ Agregar Artículo"
5. Buscar artículo (ej: EN1)
6. Ingresar cantidad: 10
7. Total se calcula automáticamente
8. Click en "💾 Guardar Movimiento"
9. Verificar que el stock aumentó

---

### 4. BAJAS Y REINGRESOS ✅
**Ruta:** ARCHIVOS → Alumnos → Bajas

**Funciones:**
- ✅ Ver alumnos dados de baja
- ✅ Buscar por credencial o nombre
- ✅ Ver listado de bajas
- ✅ Reingresar alumnos (página cyan)

**Prueba:**
1. ARCHIVOS → Alumnos → Bajas
2. Buscar un alumno dado de baja
3. Click en "Reingreso"
4. Se abre página CYAN
5. Datos pre-llenados
6. Seleccionar nuevo grupo
7. Ver información del grupo
8. Ajustar beca si es necesario
9. Click en "Guardar" (solo activo cuando TODO está completo)

---

### 5. MAESTROS ✅
**Ruta:** ARCHIVOS → Maestros

**Funciones:**
- ✅ Alta de maestros
- ✅ Búsqueda
- ✅ Edición
- ✅ Gestión de grados

---

### 6. GRUPOS ✅
**Ruta:** ARCHIVOS → Grupos

**Funciones:**
- ✅ Crear grupos
- ✅ Asignar curso, maestro, salón
- ✅ Definir horarios
- ✅ Control de cupo

---

### 7. FACTORES ✅
**Ruta:** ARCHIVOS → Factores

**Funciones:**
- ✅ Asignar comisiones a maestros por curso
- ✅ Cálculo de honorarios

---

### 8. CATÁLOGOS ✅
**Ruta:** OTROS CATÁLOGOS

**Disponibles:**
- ✅ Grupos de Artículos
- ✅ Instrumentos
- ✅ Medios de Contacto
- ✅ Motivos de Baja
- ✅ Salones
- ✅ RFC Clientes

---

## 🎨 COLORES POR MÓDULO

### Páginas de Alta:
- **Cursos:** Azul (#4169E1)
- **Artículos:** Azul/Morado (gradiente)
- **Movimientos:** Azul/Morado (gradiente)
- **Reingreso:** Cyan (#00d2ff)

### Interfaz Principal:
- **Estilo:** Windows 95 clásico
- **Fondo:** Gris (#c0c0c0)

---

## 🔍 CARACTERÍSTICAS ESPECIALES

### Búsqueda Inteligente (TypeAhead)
- Escribe y ve sugerencias en tiempo real
- Lógica dual: números vs letras
- Autocompletado al hacer clic

### Validación Estricta
- Botones deshabilitados hasta completar campos
- Mensajes claros de error
- Prevención de duplicados

### Cálculos Automáticos
- Totales en movimientos de inventario
- Stock actualizado por triggers
- Cupo de grupos actualizado automáticamente

### Navegación Completa
- Primero, Anterior, Siguiente, Último
- Ir a registro específico
- Contador de posición

---

## 🐛 SI ALGO NO FUNCIONA

### Problema: Dropdowns vacíos
**Solución:** Verifica que hay datos en Supabase
1. Abre: https://supabase.com/dashboard
2. Ve a tu proyecto
3. Ejecuta: `SUPABASE-SCHEMA.sql`

### Problema: Error de conexión
**Solución:** Verifica la consola (F12)
- Debe decir: "✓ Supabase inicializado correctamente"
- Si no, verifica `supabase-config.js`

### Problema: Botones no responden
**Solución:** Abre consola (F12)
- Busca errores en rojo
- Verifica que diga "Inicialización completa"

---

## 📊 FLUJO DE TRABAJO RECOMENDADO

### Primera Vez:
1. **Crear Catálogos Base:**
   - Instrumentos
   - Medios de Contacto
   - Motivos de Baja
   - Salones

2. **Crear Cursos:**
   - Piano Infantil 1, 2, 3...
   - Guitarra Básico, Intermedio...
   - Crear cadenas de secuencias

3. **Crear Maestros:**
   - Datos personales
   - Grados académicos

4. **Crear Grupos:**
   - Asignar curso, maestro, salón
   - Definir horarios

5. **Crear Grupos de Artículos:**
   - MÉTODOS
   - MATERIALES
   - COLEGIATURAS

6. **Crear Artículos:**
   - Asignar a grupos
   - Definir precios

7. **Registrar Movimientos:**
   - Compras iniciales
   - Actualizar stock

### Uso Diario:
1. **Altas de Alumnos**
2. **Pagos (Caja)**
3. **Movimientos de Inventario**
4. **Bajas y Reingresos**
5. **Reportes**

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, consulta:
- `ESTADO-ACTUAL-SISTEMA.md` - Estado completo del sistema
- `MEJORAS-CURSOS.md` - Módulo de cursos
- `MEJORAS-ARTICULOS.md` - Módulo de artículos
- `MEJORAS-MOVIMIENTOS-INVENTARIO.md` - Movimientos de inventario
- `GUIA-RAPIDA-ELECTRON.md` - Guía rápida

---

## 🎉 ¡LISTO PARA USAR!

El sistema está **completamente funcional** y listo para producción.

**Comando para iniciar:**
```bash
npm start
```

**Atajos útiles:**
- **F5** - Recargar página
- **F11** - Pantalla completa
- **F12** - DevTools (consola)
- **Alt+F4** - Salir

---

**¡Disfruta usando SCALA!** 🎵🎹🎸

---

**Última actualización:** 25 de enero de 2026
