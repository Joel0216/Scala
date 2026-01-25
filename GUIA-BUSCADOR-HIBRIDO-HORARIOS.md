# Guía del Buscador Híbrido de Horarios

## 🎯 Descripción General

El módulo de **Visualización de Horarios** ahora cuenta con un **Buscador Híbrido Inteligente** que permite buscar horarios por Curso o Maestro sin necesidad de seleccionar qué tipo de búsqueda realizar. El sistema detecta automáticamente qué estás buscando.

---

## 🔍 Cómo Funciona el Buscador Híbrido

### Concepto Principal
- **UNA SOLA barra de búsqueda** para todo
- El sistema busca **simultáneamente** en Cursos y Maestros
- Muestra sugerencias en tiempo real mientras escribes
- Formato visual claro que distingue entre Curso y Maestro

### Ejemplos de Uso

#### Escenario A: Buscar por Curso
Si escribes **"Ba"** (buscando "Bajo Eléctrico"):

```
📘 CURSO: Bajo Eléctrico | 👤 Maestro: Joel
📘 CURSO: Batería | 👤 Maestro: Carlos
```

Al hacer clic en cualquier sugerencia, la tabla muestra **todos los grupos** de ese curso.

#### Escenario B: Buscar por Maestro
Si escribes **"Joe"** (buscando al maestro "Joel"):

```
👤 MAESTRO: Joel | 📘 Curso: Bajo Eléctrico
👤 MAESTRO: Joel | 📘 Curso: Guitarra Acústica
```

Al hacer clic, la tabla muestra los grupos específicos de ese maestro para ese curso.

---

## 📊 Vista Tipo Excel (DataGrid)

La tabla muestra las siguientes columnas:

| Columna | Descripción | Origen en BD |
|---------|-------------|--------------|
| **Día** | Día de la semana | `dia` (LU, MA, MI, etc.) |
| **Hora** | Horario completo | `hora_entrada - hora_salida` |
| **Clave** | Clave del grupo | `clave` |
| **Curso** | Nombre del curso | `cursos.curso` (relación) |
| **Maestro** | Nombre del maestro | `maestros.nombre` (relación) |
| **Sc.** | Número de salón | `salones.numero` (relación) |
| **Cupo** | Capacidad máxima | `cupo` |
| **#** | Alumnos inscritos | `alumnos_inscritos` |
| **Inicio** | Fecha de inicio | `inicio` |
| **Lec** | Lección actual | `leccion` |
| **F.L.** | Fecha de lección | `fecha_leccion` |

---

## 🎨 Características Visuales

### Sugerencias Inteligentes
- **Iconos visuales**: 📘 para Cursos, 👤 para Maestros
- **Etiquetas en mayúsculas**: CURSO o MAESTRO
- **Hover effect**: Fondo azul al pasar el mouse
- **Límite de resultados**: Máximo 10 sugerencias
- **Scroll automático**: Si hay más de 10 resultados

### Formato de Datos
- **Fechas**: DD/MM/YYYY
- **Horas**: HH:MM - HH:MM
- **Días**: Nombres completos (Lunes, Martes, etc.)

---

## 🚀 Funcionalidades Adicionales

### Navegación de Registros
- **|<** : Ir al primer registro
- **<** : Registro anterior
- **>** : Registro siguiente
- **>|** : Ir al último registro
- **Contador**: Muestra "1-20 de 45" (ejemplo)

### Paginación
- Muestra 20 registros por página
- Navegación automática entre páginas
- Contador actualizado en tiempo real

### Botones de Acción
- **Buscar**: Enfoca el campo de búsqueda
- **Terminar**: Regresa al menú de Archivos

---

## 💡 Ventajas del Sistema

1. **Sin modales molestos**: Todo en una sola pantalla
2. **Búsqueda instantánea**: Resultados mientras escribes
3. **Búsqueda inteligente**: No necesitas especificar qué buscas
4. **Vista completa**: Toda la información en formato tabla
5. **Navegación fluida**: Paginación automática
6. **Experiencia moderna**: Similar a Spotify o Google

---

## 🔧 Detalles Técnicos

### Carga de Datos
- Al iniciar, carga **todos los grupos activos** en memoria
- Búsqueda local ultra-rápida (sin consultas repetidas a BD)
- Filtrado en tiempo real

### Algoritmo de Búsqueda
1. Usuario escribe en el campo
2. Sistema busca coincidencias en `cursos.curso` Y `maestros.nombre`
3. Elimina duplicados usando Map
4. Ordena: Cursos primero, luego Maestros
5. Muestra máximo 10 resultados
6. Al seleccionar, filtra y muestra en tabla

### Optimizaciones
- **Búsqueda case-insensitive**: "ba" = "Ba" = "BA"
- **Búsqueda parcial**: "Joe" encuentra "Joel"
- **Sin duplicados**: Usa Map para evitar repeticiones
- **Cierre automático**: Sugerencias se ocultan al hacer clic fuera

---

## 📝 Notas Importantes

- Solo muestra grupos con `status = 'activo'`
- Las relaciones con Maestros, Cursos y Salones se cargan automáticamente
- Si no hay resultados, muestra mensaje "No se encontraron resultados"
- La tabla se actualiza instantáneamente al seleccionar una sugerencia

---

## 🎓 Casos de Uso Comunes

### Ver todos los horarios de un curso
1. Escribe el nombre del curso (ej: "Piano")
2. Selecciona de las sugerencias
3. Ve todos los grupos de ese curso

### Ver horarios de un maestro específico
1. Escribe el nombre del maestro (ej: "María")
2. Selecciona el curso que imparte
3. Ve los grupos específicos de ese maestro

### Buscar por horario
1. Busca el curso o maestro
2. Revisa la columna "Hora" en la tabla
3. Identifica el horario que necesitas

---

## ✅ Resumen

El Buscador Híbrido de Horarios es una solución moderna y eficiente que:
- Elimina la necesidad de seleccionar tipo de búsqueda
- Proporciona resultados instantáneos
- Muestra información completa en formato tabla
- Ofrece una experiencia de usuario fluida y profesional

**¡Simplemente escribe y selecciona!** 🎉
