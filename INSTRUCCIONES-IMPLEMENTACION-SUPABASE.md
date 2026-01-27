# Instrucciones para Implementar Tablas en Supabase

## Credenciales de Supabase

**URL del Proyecto:** https://vqsduyfkgdqnigzkxazk.supabase.co

**Publishable Key:**
```
sb_publishable_G3pShpufiLpsHC_dCoFe-g_NpLMu1XJ
```

**Anon Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIyOTMsImV4cCI6MjA4NDYwODI5M30.l5bZubjb3PIvcFG43JTfoeguldEwwIK7wlnOnl-Ec5o
```

**Service Role Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMjI5MywiZXhwIjoyMDg0NjA4MjkzfQ.pJYF22jk58y7n-pk1KLOItItPYiz5o3h4Tb7Q3FUDL0
```

## Pasos para Implementar

### 1. Acceder a Supabase SQL Editor

1. Ve a https://supabase.com
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto: `vqsduyfkgdqnigzkxazk`
4. Ve a la sección **SQL Editor** en el menú lateral

### 2. Ejecutar el Schema Completo

1. Abre el archivo `SCHEMA-COMPLETO-SUPABASE.sql`
2. Copia TODO el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **RUN** o presiona `Ctrl+Enter`

### 3. Verificar que las Tablas se Crearon

1. Ve a la sección **Table Editor** en Supabase
2. Verifica que aparezcan las siguientes tablas:
   - ✅ factores
   - ✅ movimientos_inventario_maestro
   - ✅ movimientos_inventario_detalle
   - ✅ tipos_movimiento
   - ✅ prospectos
   - ✅ alumnos_bajas
   - ✅ Y todas las demás tablas del sistema

### 4. Verificar Funciones y Triggers

1. Ve a la sección **Database** > **Functions**
2. Verifica que existan las funciones:
   - ✅ `actualizar_existencia_articulo()`
   - ✅ `revertir_existencia_articulo()`
   - ✅ `reingresar_alumno()`
   - ✅ `actualizar_contador_alumnos()`

### 5. Verificar Datos Iniciales

1. Ve a **Table Editor** > **motivos_baja**
2. Verifica que existan los motivos de baja básicos
3. Verifica **instrumentos** y **medios_contacto** tengan datos

### 6. Probar la Conexión

1. Abre la aplicación en el navegador
2. Abre la consola del navegador (F12)
3. Navega a cualquier sección (Factores, Movimientos, Prospectos)
4. Deberías ver en la consola: `✓ Supabase conectado`

## Tablas Principales Creadas

### Factores
- **factores** - Relación maestro/curso con factor de comisión

### Movimientos de Inventario
- **movimientos_inventario_maestro** - Cabecera de movimientos
- **movimientos_inventario_detalle** - Detalle de artículos
- **tipos_movimiento** - Catálogo de tipos (AD, S, E, AJ)

### Prospectos
- **prospectos** - Registro de posibles alumnos

### Bajas y Reingresos
- **alumnos_bajas** - Alumnos dados de baja

## Funcionalidades Automáticas

### Triggers Implementados:
1. **Actualización de existencia** - Al crear un movimiento, actualiza el stock del artículo
2. **Reversión de existencia** - Al eliminar un movimiento, revierte el stock
3. **Contador de alumnos** - Actualiza automáticamente el número de alumnos en grupos
4. **Registro de cambios** - Registra cambios de grupo/curso de alumnos

## Notas Importantes

⚠️ **IMPORTANTE:**
- El archivo `SCHEMA-COMPLETO-SUPABASE.sql` usa `CREATE TABLE IF NOT EXISTS` para evitar errores si las tablas ya existen
- Si necesitas recrear las tablas, primero elimínalas manualmente desde el Table Editor
- Los triggers se crean con `DROP TRIGGER IF EXISTS` para evitar errores

## Solución de Problemas

### Error: "relation already exists"
- Las tablas ya existen. Esto es normal si ya ejecutaste el script antes.
- El script usa `IF NOT EXISTS` para evitar este error.

### Error: "function already exists"
- Las funciones ya existen. Esto es normal.
- El script usa `CREATE OR REPLACE FUNCTION` para actualizarlas.

### No se conecta a Supabase
- Verifica que las credenciales en `supabase-config.js` sean correctas
- Verifica tu conexión a Internet
- Revisa la consola del navegador para ver errores específicos

## Próximos Pasos

Después de ejecutar el schema:
1. ✅ Probar la sección de Factores
2. ✅ Probar la sección de Movimientos de Inventario
3. ✅ Probar la sección de Prospectos
4. ✅ Verificar que los botones funcionen correctamente
5. ✅ Verificar que se puedan agregar, buscar y eliminar registros
