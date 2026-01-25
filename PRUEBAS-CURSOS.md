# 🧪 GUÍA DE PRUEBAS - MÓDULO DE CURSOS

## Instrucciones para Probar el Módulo Completo

---

## 🚀 Paso 1: Iniciar la Aplicación

```bash
npm start
```

Espera a que se abra la ventana de Electron.

---

## 📋 Paso 2: Navegar al Módulo de Cursos

1. En el menú principal, click en **"ARCHIVOS"**
2. En el menú de archivos, click en **"Cursos"**
3. Deberías ver la interfaz de cursos con fondo verde

---

## ✅ Prueba 1: Crear Nuevo Curso

### Objetivo: Verificar que se puede crear un curso y que la clave se genera automáticamente

1. Click en el botón **"Nuevo"**
2. Se abre una nueva página con fondo **AZUL**
3. En el campo "Curso", escribe: **"Piano Infantil 3"**
4. Observa que el campo "Clave" se llena automáticamente con: **"P3"**
5. En el campo "Costo", escribe: **770**
6. El campo "IVA" ya tiene: **0.16** (déjalo así)
7. En el campo "Recargo", escribe: **550**
8. En "Curso Siguiente", selecciona: **"-- Ninguno (Fin de cadena) --"**
9. Click en el botón **"Guardar"**
10. Deberías ver un mensaje: **"Curso dado de alta correctamente"**
11. Click en **"No"** cuando pregunte si deseas crear otro curso
12. Deberías regresar a la página principal de cursos

**✅ Resultado Esperado:**
- Clave generada automáticamente: "P3"
- Curso guardado en Supabase
- Regreso a cursos.html

---

## ✅ Prueba 2: Buscar Curso

### Objetivo: Verificar que se puede buscar un curso por nombre

1. En la página principal de cursos, click en **"Buscar"**
2. Se abre un modal con el título: **"Proporcione Nombre del curso O inicio del nombre"**
3. En el campo de búsqueda, escribe: **"PIANO"**
4. Click en **"Aceptar"**
5. Deberías ver una lista con todos los cursos que contienen "PIANO"
6. Click en **"Piano Infantil 3"** (el que acabas de crear)
7. El modal se cierra y se cargan los datos del curso

**✅ Resultado Esperado:**
- Modal de búsqueda funciona
- Lista de resultados se muestra correctamente
- Click en resultado carga los datos

---

## ✅ Prueba 3: Buscar por Clave

### Objetivo: Verificar que se puede buscar un curso por clave

1. Click en **"Buscar"**
2. En el campo de búsqueda, escribe: **"P"**
3. Click en **"Aceptar"**
4. Deberías ver una lista con todos los cursos cuya clave empieza con "P"
5. Observa que aparecen: P1, P2, P3, PP, etc.
6. Click en cualquier curso para cargarlo

**✅ Resultado Esperado:**
- Búsqueda por clave funciona
- Muestra todos los cursos con esa clave

---

## ✅ Prueba 4: Navegación entre Registros

### Objetivo: Verificar que los botones de navegación funcionan

1. Observa el contador: **"Registro: X"** (donde X es el número actual)
2. Click en el botón **"|◄"** (Primero)
   - Deberías ver el primer curso de la lista
   - Contador muestra: "Registro: 1"
3. Click en el botón **"►"** (Siguiente)
   - Deberías ver el siguiente curso
   - Contador aumenta: "Registro: 2"
4. Click en el botón **"◄"** (Anterior)
   - Deberías regresar al curso anterior
   - Contador disminuye: "Registro: 1"
5. Click en el botón **"►|"** (Último)
   - Deberías ver el último curso de la lista
   - Contador muestra el número total
6. En el campo numérico, escribe: **5**
7. Click en el botón **"►*"** (Ir a registro)
   - Deberías ver el curso en la posición 5
   - Contador muestra: "Registro: 5"

**✅ Resultado Esperado:**
- Todos los botones de navegación funcionan
- Contador se actualiza correctamente
- Datos del curso se cargan correctamente

---

## ✅ Prueba 5: Verificar Generación de Clave

### Objetivo: Probar diferentes patrones de generación de clave

1. Click en **"Nuevo"**
2. Prueba estos nombres y verifica las claves:

| Nombre del Curso | Clave Esperada | Patrón |
|------------------|----------------|--------|
| Piano Infantil 1 | P1 | Primera letra + número |
| Piano Infantil 2 | P2 | Primera letra + número |
| BALLET | BA | Primeras 2 letras |
| CANTO | CA | Primeras 2 letras |
| Bajo Electrico | BE | Iniciales |
| Guitarra Acustica | GA | Iniciales |
| Drum Kids | DK | Iniciales |

3. Para cada uno:
   - Escribe el nombre
   - Verifica que la clave sea correcta
   - Click en "Limpiar" para probar el siguiente

**✅ Resultado Esperado:**
- Clave se genera automáticamente al escribir
- Patrón de generación es correcto
- Clave se actualiza en tiempo real

---

## ✅ Prueba 6: Dropdown de Curso Siguiente

### Objetivo: Verificar que el dropdown carga todos los cursos

1. Click en **"Nuevo"**
2. Escribe un nombre de curso: **"Prueba Dropdown"**
3. Click en el dropdown **"Curso Siguiente"**
4. Deberías ver:
   - Primera opción: **"-- Ninguno (Fin de cadena) --"**
   - Luego: Lista de todos los cursos existentes en orden alfabético
5. Selecciona cualquier curso
6. Click en **"Cancelar"** (no guardar)

**✅ Resultado Esperado:**
- Dropdown carga todos los cursos
- Opción "Ninguno" está disponible
- Cursos están ordenados alfabéticamente

---

## ✅ Prueba 7: Validación de Campos Obligatorios

### Objetivo: Verificar que no se puede guardar sin campos obligatorios

1. Click en **"Nuevo"**
2. Deja el campo "Curso" **VACÍO**
3. Click en **"Guardar"**
4. Deberías ver un mensaje de error: **"Por favor complete los siguientes campos obligatorios: - Curso"**
5. Escribe un nombre: **"Prueba Validacion"**
6. Borra el campo "Costo" (déjalo vacío)
7. Click en **"Guardar"**
8. Deberías ver un mensaje de error: **"Por favor complete los siguientes campos obligatorios: - Costo (debe ser mayor a 0)"**
9. Escribe un costo: **0**
10. Click en **"Guardar"**
11. Deberías ver el mismo mensaje de error (costo debe ser mayor a 0)
12. Escribe un costo válido: **500**
13. Click en **"Guardar"**
14. Ahora sí debería guardarse correctamente

**✅ Resultado Esperado:**
- No permite guardar sin nombre
- No permite guardar sin costo
- No permite guardar con costo = 0
- Mensajes de error son claros

---

## ✅ Prueba 8: Eliminar Curso

### Objetivo: Verificar que se puede eliminar un curso

1. Busca el curso **"Prueba Validacion"** (el que acabas de crear)
2. Click en el botón **"Borrar"**
3. Deberías ver un mensaje de confirmación: **"¿Está seguro de eliminar este curso? Esta acción no se puede deshacer."**
4. Click en **"Aceptar"**
5. Deberías ver un mensaje: **"Curso eliminado correctamente"**
6. La lista de cursos se recarga automáticamente
7. Verifica que el curso ya no aparece en la lista

**✅ Resultado Esperado:**
- Confirmación antes de eliminar
- Curso se elimina de Supabase
- Lista se recarga automáticamente
- Curso eliminado ya no aparece

---

## ✅ Prueba 9: Botón Terminar

### Objetivo: Verificar que se puede salir del módulo

1. Click en el botón **"Terminar"**
2. Deberías ver un mensaje de confirmación: **"¿Desea salir del módulo de cursos?"**
3. Click en **"Aceptar"**
4. Deberías regresar a la página **"archivos.html"**

**✅ Resultado Esperado:**
- Confirmación antes de salir
- Regreso a archivos.html

---

## ✅ Prueba 10: Crear Cadena de Secuencias

### Objetivo: Verificar que se puede crear una cadena de cursos

1. Click en **"Nuevo"**
2. Crea el primer curso:
   - Nombre: **"Trompeta Basico"**
   - Clave: **TB** (automática)
   - Costo: **800**
   - Recargo: **600**
   - Curso Siguiente: **"-- Ninguno (Fin de cadena) --"**
   - Click en **"Guardar"**
   - Click en **"Sí"** para crear otro

3. Crea el segundo curso:
   - Nombre: **"Trompeta Intermedio"**
   - Clave: **TI** (automática)
   - Costo: **850**
   - Recargo: **600**
   - Curso Siguiente: **"-- Ninguno (Fin de cadena) --"**
   - Click en **"Guardar"**
   - Click en **"Sí"** para crear otro

4. Crea el tercer curso:
   - Nombre: **"Trompeta Avanzado"**
   - Clave: **TA** (automática)
   - Costo: **900**
   - Recargo: **600**
   - Curso Siguiente: **"-- Ninguno (Fin de cadena) --"**
   - Click en **"Guardar"**
   - Click en **"No"**

5. Ahora edita los cursos para crear la cadena:
   - Busca **"Trompeta Basico"**
   - En "Curso Siguiente", selecciona: **"Trompeta Intermedio"**
   - (Nota: En la versión actual, no hay botón "Guardar" en la página principal, esto se implementará en el futuro)

**✅ Resultado Esperado:**
- Se pueden crear múltiples cursos
- Dropdown muestra los cursos creados
- Se puede seleccionar el curso siguiente

---

## 🐛 Problemas Conocidos

### Limitaciones Actuales:

1. **No hay botón "Guardar" en cursos.html**
   - Solo se puede crear y eliminar
   - No se puede editar un curso existente
   - Solución futura: Agregar botón "Guardar" o "Actualizar"

2. **No se puede navegar por la cadena**
   - No hay botón para ir al "Curso Siguiente"
   - Solución futura: Click en dropdown para navegar

3. **No hay módulo de reportes**
   - No se pueden visualizar las cadenas completas
   - Solución futura: Crear reportes-cursos.html

---

## 📊 Checklist de Pruebas

Marca cada prueba al completarla:

- [ ] Prueba 1: Crear Nuevo Curso
- [ ] Prueba 2: Buscar Curso por Nombre
- [ ] Prueba 3: Buscar Curso por Clave
- [ ] Prueba 4: Navegación entre Registros
- [ ] Prueba 5: Generación de Clave
- [ ] Prueba 6: Dropdown de Curso Siguiente
- [ ] Prueba 7: Validación de Campos
- [ ] Prueba 8: Eliminar Curso
- [ ] Prueba 9: Botón Terminar
- [ ] Prueba 10: Crear Cadena de Secuencias

---

## 🎯 Resultado Esperado Final

Al completar todas las pruebas, deberías haber verificado:

✅ Creación de cursos funciona
✅ Búsqueda por nombre y clave funciona
✅ Navegación entre registros funciona
✅ Generación automática de clave funciona
✅ Validaciones funcionan correctamente
✅ Eliminación con confirmación funciona
✅ Dropdown carga todos los cursos
✅ Integración con Supabase funciona
✅ Botón Terminar funciona

---

## 📝 Notas Adicionales

### Datos de Prueba Sugeridos:

```
Curso 1:
- Nombre: Piano Infantil 1
- Clave: P1
- Costo: 770
- Recargo: 550

Curso 2:
- Nombre: Piano Infantil 2
- Clave: P2
- Costo: 770
- Recargo: 550

Curso 3:
- Nombre: BALLET
- Clave: BA
- Costo: 400
- Recargo: 0

Curso 4:
- Nombre: Bajo Electrico 1
- Clave: BE
- Costo: 770
- Recargo: 550
```

---

## 🔍 Verificación en Supabase

Para verificar que los datos se guardaron correctamente:

1. Abre Supabase Dashboard: https://vqsduyfkgdqnigzkxazk.supabase.co
2. Ve a "Table Editor"
3. Selecciona la tabla "cursos"
4. Verifica que los cursos creados aparecen en la tabla
5. Verifica que los campos están correctos:
   - curso
   - clave
   - precio_mensual
   - precio_inscripcion
   - curso_siguiente_id

---

**FIN DE LA GUÍA DE PRUEBAS**

¡Buena suerte con las pruebas! 🚀
