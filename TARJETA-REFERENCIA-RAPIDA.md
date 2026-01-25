# 🎯 TARJETA DE REFERENCIA RÁPIDA - SCALA

## ⚡ INICIO RÁPIDO
```bash
npm start
```

---

## 📦 MÓDULOS LISTOS

| Módulo | Ruta | Color | Estado |
|--------|------|-------|--------|
| **Cursos** | ARCHIVOS → Cursos | Azul | ✅ |
| **Artículos** | ARCHIVOS → Artículos | Azul/Morado | ✅ |
| **Movimientos** | ARCHIVOS → Movimientos | Azul/Morado | ✅ |
| **Bajas** | ARCHIVOS → Alumnos → Bajas | Gris | ✅ |
| **Reingreso** | Desde Bajas → Reingreso | Cyan | ✅ |

---

## 🔍 BÚSQUEDA INTELIGENTE

### Cursos:
- **Letras:** Busca por nombre
- **Clave:** Busca por clave

### Artículos:
- **Letras:** Busca por GRUPO
- **Alfanumérico:** Busca por CLAVE

### Bajas:
- **Números:** Busca por CREDENCIAL
- **Letras:** Busca por NOMBRE

---

## 🎨 COLORES DE PÁGINAS

| Página | Color | Código |
|--------|-------|--------|
| Cursos Alta | Azul | #4169E1 |
| Artículos Alta | Azul/Morado | Gradiente |
| Movimientos Nuevo | Azul/Morado | Gradiente |
| Reingreso | Cyan | #00d2ff |
| Principal | Gris | #c0c0c0 |

---

## 🔑 ATAJOS DE TECLADO

| Tecla | Acción |
|-------|--------|
| **F5** | Recargar |
| **F11** | Pantalla completa |
| **F12** | DevTools |
| **Alt+F4** | Salir |

---

## 📊 PATRONES DE DISEÑO

| Módulo | Patrón |
|--------|--------|
| Cursos | Cadenas de Secuencias |
| Artículos | Madre-Hija |
| Movimientos | Maestro-Detalle |
| Bajas | Ciclo de Vida |

---

## 🗄️ TABLAS PRINCIPALES

### Alumnos:
- `alumnos` - Activos
- `alumnos_bajas` - Histórico bajas
- `alumnos_reingresos` - Histórico reingresos

### Cursos:
- `cursos` - Con secuencias

### Artículos:
- `grupos_articulos` - Madre
- `articulos` - Hija

### Movimientos:
- `tipos_movimiento` - Catálogo
- `movimientos_inventario_maestro` - Cabecera
- `movimientos_inventario_detalle` - Renglones

---

## ⚙️ TRIGGERS AUTOMÁTICOS

| Trigger | Función |
|---------|---------|
| `actualizar_stock_inventario()` | Stock automático |
| `actualizar_contador_alumnos()` | Cupo de grupos |
| `registrar_cambio_alumno()` | Auditoría |
| `update_updated_at_column()` | Timestamps |

---

## 🔧 FUNCIONES POSTGRESQL

| Función | Uso |
|---------|-----|
| `dar_baja_alumno()` | Dar de baja |
| `reingresar_alumno()` | Reingresar |

---

## 📝 VALIDACIONES

### Campos Obligatorios:
- Marcados con **\***
- Botones deshabilitados hasta completar

### Unicidad:
- Claves de cursos
- Claves de artículos
- Credenciales de alumnos

### Integridad:
- No eliminar grupo con artículos
- No reingresar dos veces
- Stock no negativo

---

## 🚀 FLUJO DE TRABAJO

### Primera Vez:
1. Crear catálogos
2. Crear cursos
3. Crear maestros
4. Crear grupos
5. Crear grupos de artículos
6. Crear artículos

### Uso Diario:
1. Altas de alumnos
2. Pagos
3. Movimientos de inventario
4. Bajas y reingresos

---

## 📚 DOCUMENTACIÓN

| Archivo | Contenido |
|---------|-----------|
| `INICIO-SISTEMA.md` | Inicio rápido |
| `ESTADO-ACTUAL-SISTEMA.md` | Estado completo |
| `RESUMEN-TRANSFERENCIA-CONTEXTO.md` | Resumen |
| `MEJORAS-CURSOS.md` | Cursos |
| `MEJORAS-ARTICULOS.md` | Artículos |
| `MEJORAS-MOVIMIENTOS-INVENTARIO.md` | Movimientos |

---

## 🐛 DEBUGGING

### Abrir Consola:
```
F12 → Console
```

### Verificar Conexión:
```
✓ Supabase inicializado correctamente
```

### Ver Errores:
```
Buscar líneas en rojo
```

---

## 💾 BASE DE DATOS

### URL:
```
https://vqsduyfkgdqnigzkxazk.supabase.co
```

### Config:
```
supabase-config.js
```

### Schemas:
```
SUPABASE-SCHEMA.sql
SCHEMA-BAJAS-REINGRESOS.sql
SCHEMA-MOVIMIENTOS-INVENTARIO.sql
```

---

## ✅ CHECKLIST RÁPIDO

- [x] Cursos con secuencias
- [x] Artículos con grupos
- [x] Movimientos con stock automático
- [x] Bajas con histórico
- [x] Reingresos con validación
- [x] Búsqueda TypeAhead
- [x] Validación estricta
- [x] Navegación completa
- [x] Triggers automáticos
- [x] Documentación completa

---

## 🎉 ESTADO

**Sistema:** ✅ OPERATIVO  
**Versión:** 1.0.0  
**Fecha:** 25/01/2026

---

## 🚀 COMANDO MÁGICO

```bash
npm start
```

**¡Eso es todo!** 🎵

---

**Imprime esta tarjeta para referencia rápida**
