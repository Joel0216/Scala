# ⚡ GUÍA RÁPIDA - MÓDULO DE FACTORES

## 🚀 INICIO RÁPIDO

```bash
npm start
ARCHIVOS > Factores
```

---

## 🎯 CONCEPTOS CLAVE

| Concepto | Significado | Ejemplo |
|----------|-------------|---------|
| **Factor** | Regla de cálculo | "Sobre Colegiatura" |
| **Porcentaje** | Cantidad de comisión | Factor 50 = 0.50% |
| **Generables** | Datos del maestro | Nombre, Grado, Fecha |

**Fórmula:**
```
Porcentaje = Factor / 100
```

---

## ⌨️ BÚSQUEDA ALFABÉTICA RÁPIDA

### En Dropdown de Maestros:
```
Presionar: "J"
Resultado: JAIME JESUS LARA MORENO
Acción: Usar ↓ para ver más opciones
```

### En Dropdown de Cursos:
```
Presionar: "P"
Resultado: Piano Infantil 1
Acción: Usar ↓ para ver más opciones
```

---

## 🆕 CREAR NUEVO FACTOR

### Paso a Paso:

```
1. Click "Nuevo"
   → Formulario se pone AZUL
   → Campos se limpian
   → Botón cambia a "Guardar"

2. Presionar "J" en Maestro
   → Filtra maestros con J
   → Seleccionar uno

3. Detalles se llenan automáticamente:
   → Nombre
   → Grado
   → Detalles Grado
   → Fecha de Ingreso

4. Presionar "T" en Curso
   → Filtra cursos con T
   → Seleccionar uno

5. Ingresar Factor: 50
   → Porcentaje se calcula: 0.50%

6. Click "Guardar"
   → Guarda en BD
   → Desactiva modo edición
   → Muestra factor guardado
```

---

## 🔍 BUSCAR FACTOR EXISTENTE

### Paso a Paso:

```
1. Click "Buscar X Maestro"
   → Se abre modal

2. Escribir: "ADOLFO" (o solo "A")
   → Click "Aceptar"

3. Sistema busca factores
   → Encuentra y muestra
   → Llena formulario completo

4. Ver información:
   → Maestro seleccionado
   → Curso seleccionado
   → Factor
   → Porcentaje
   → Detalles del maestro
```

---

## 🗑️ ELIMINAR FACTOR

### Paso a Paso:

```
1. Buscar factor primero
   → Usar "Buscar X Maestro"
   → Factor se carga

2. Click "Borrar"
   → Sistema valida campos
   → Muestra confirmación:
     "¿Está seguro de eliminar?
     Maestro: ADOLFO MAY
     Curso: Teclado Pop 1
     Factor: 131"

3. Confirmar
   → Sistema elimina
   → Recarga factores
   → Limpia formulario
```

---

## ✅ VALIDACIONES

### Para Guardar:
- ✅ Maestro seleccionado
- ✅ Curso seleccionado
- ✅ Factor > 0

### Para Borrar:
- ✅ Todos los campos llenos
- ✅ Factor seleccionado (desde búsqueda)
- ✅ Confirmación del usuario

---

## 🎨 COLORES

| Estado | Color | Código |
|--------|-------|--------|
| Normal | Gris | #c0c0c0 |
| Edición | Azul claro | #E6F2FF |
| Borde Edición | Azul | #4169E1 |
| Generales | Cyan | #008B8B |
| Focus | Amarillo | #FFFACD |

---

## 🔘 BOTONES

| Botón | Función |
|-------|---------|
| **Nuevo** | Activa modo edición azul |
| **Buscar X Maestro** | Busca factores por maestro |
| **Borrar** | Elimina factor (con validación) |
| **Terminar** | Regresa a Archivos |

---

## 🧭 NAVEGACIÓN

| Botón | Acción |
|-------|--------|
| **\|<** | Primer registro |
| **<** | Anterior |
| **>** | Siguiente |
| **>\|** | Último |

**Contador:**
```
Registro: 1 de 832
```

---

## 💡 TIPS

### Búsqueda Rápida:
- Presiona letra en dropdown
- Sistema filtra automáticamente
- Usa ↓ para navegar

### Auto-llenado:
- Selecciona maestro
- Detalles se llenan solos
- Campos de solo lectura

### Modo Edición:
- Formulario azul = modo edición
- Botón "Guardar" = listo para guardar
- Formulario gris = modo normal

### Validación:
- Borrar requiere factor cargado
- Usa "Buscar X Maestro" primero
- Confirmación antes de eliminar

---

## 📊 EJEMPLOS

### Factor 50:
```
Factor: 50
Porcentaje: 0.50%
Significado: 50% de comisión
```

### Factor 131:
```
Factor: 131
Porcentaje: 1.31%
Significado: 131% de comisión
```

### Factor 25:
```
Factor: 25
Porcentaje: 0.25%
Significado: 25% de comisión
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Dropdowns vacíos:
```
Problema: No hay maestros/cursos
Solución: Verificar datos en Supabase
```

### No puede borrar:
```
Problema: Botón no funciona
Solución: Buscar factor primero con "Buscar X Maestro"
```

### Detalles no se llenan:
```
Problema: Campos vacíos
Solución: Verificar que maestro tenga datos en BD
```

---

## 🔧 DEBUGGING

### Abrir Consola:
```
F12 → Console
```

### Verificar Conexión:
```
✓ Supabase conectado
✓ X maestros cargados
✓ X cursos cargados
✓ X factores cargados
```

### Ver Errores:
```
Buscar líneas en rojo
```

---

## 📚 DOCUMENTACIÓN

| Archivo | Contenido |
|---------|-----------|
| `MEJORAS-FACTORES.md` | Documentación completa |
| `RESUMEN-FACTORES-COMPLETADO.md` | Resumen |
| `GUIA-RAPIDA-FACTORES.md` | Esta guía |

---

## ✅ CHECKLIST

- [x] Búsqueda alfabética rápida
- [x] Auto-llenado de detalles
- [x] Modo edición azul
- [x] Botón "Nuevo" funcional
- [x] Botón "Buscar X Maestro"
- [x] Botón "Borrar" con validación
- [x] Cálculo automático
- [x] Navegación completa
- [x] Validaciones estrictas
- [x] Integración Supabase

---

## 🎉 ESTADO

**Módulo:** ✅ OPERATIVO  
**Versión:** 1.0.0  
**Fecha:** 25/01/2026

---

## 🚀 COMANDO MÁGICO

```bash
npm start
```

**¡Eso es todo!** 💰

---

**Imprime esta guía para referencia rápida**
