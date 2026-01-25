# 💻 EJEMPLOS DE CÓDIGO - MÓDULOS PRINCIPALES

## 📝 ÍNDICE
1. [Utilidades Comunes](#utilidades-comunes)
2. [Módulo de Caja](#módulo-de-caja)
3. [Gestión de Alumnos](#gestión-de-alumnos)
4. [Reportes](#reportes)
5. [Seguridad](#seguridad)

---

## 🔧 UTILIDADES COMUNES

### validators.js
```javascript
// Generar dígito verificador para credenciales
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

// Validar credencial completa
export function validarCredencial(credencial) {
  if (credencial.length !== 6) return false;
  
  const numero = credencial.substring(0, 5);
  const digito = parseInt(credencial.substring(5, 6));
  
  return digito === generarDigitoVerificador(numero);
}

// Generar siguiente credencial
export async function generarSiguienteCredencial() {
  const { data, error } = await supabase
    .from('alumnos')
    .select('credencial1')
    .order('credencial1', { ascending: false })
    .limit(1);
    
  if (error || !data || data.length === 0) {
    return '100000'; // Primera credencial
  }
  
  const ultimaCredencial = data[0].credencial1;
  const numero = parseInt(ultimaCredencial.substring(0, 5)) + 1;
  const digito = generarDigitoVerificador(numero.toString());
  
  return numero.toString() + digito.toString();
}
```

### formatters.js
```javascript
// Formatear moneda
export function formatearMoneda(cantidad) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(cantidad);
}

// Formatear fecha
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Calcular IVA
export function calcularIVA(monto, tasa = 0.16) {
  return monto * tasa;
}

// Calcular descuento
export function calcularDescuento(monto, porcentaje) {
  return monto * (porcentaje / 100);
}
```

---

## 💰 MÓDULO DE CAJA

### pagos.js
```javascript
import { supabase } from './supabase-config.js';
import { formatearMoneda, calcularIVA, calcularDescuento } from './formatters.js';

class SistemaPagos {
  constructor() {
    this.alumnoActual = null;
    this.operaciones = [];
    this.totales = {
      subtotal: 0,
      descuentos: 0,
      iva: 0,
      total: 0
    };
  }
  
  // Buscar alumno por credencial
  async buscarAlumnoPorCredencial(credencial) {
    const { data, error } = await supabase
      .from('alumnos')
      .select(`
        *,
        grupos:grupo (
          *,
          cursos:curso_id (*),
          maestros:maestro_id (*)
        )
      `)
      .eq('credencial1', credencial)
      .eq('status', 'activo')
      .single();
      
    if (error) {
      console.error('Error buscando alumno:', error);
      return null;
    }
    
    this.alumnoActual = data;
    await this.cargarAdeudos();
    return data;
  }
  
  // Cargar adeudos del alumno
  async cargarAdeudos() {
    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();
    
    // Verificar si ya pagó este mes
    const { data: pagos } = await supabase
      .from('colegiaturas')
      .select('*')
      .eq('alumno_id', this.alumnoActual.id)
      .eq('mes', mesActual)
      .eq('anio', anioActual);
      
    if (!pagos || pagos.length === 0) {
      // Tiene adeudo de colegiatura
      const precio = this.alumnoActual.grupos?.cursos?.precio_mensual || 0;
      const descuento = this.alumnoActual.beca ? 
        calcularDescuento(precio, this.alumnoActual.porcentaje_beca) : 0;
        
      return {
        colegiatura: {
          monto: precio,
          descuento: descuento,
          neto: precio - descuento
        }
      };
    }
    
    return { colegiatura: null };
  }
  
  // Agregar operación
  agregarOperacion(operacion) {
    this.operaciones.push({
      operacion: operacion.descripcion,
      tipo: operacion.tipo,
      credencial: this.alumnoActual?.credencial1,
      alumno_id: this.alumnoActual?.id,
      grupo: this.alumnoActual?.grupo,
      cantidad: operacion.cantidad || 1,
      monto: operacion.monto,
      descuento: operacion.descuento || 0,
      iva: operacion.aplicaIVA ? calcularIVA(operacion.monto - operacion.descuento) : 0,
      neto: 0 // Se calcula después
    });
    
    this.calcularTotales();
  }
  
  // Calcular totales
  calcularTotales() {
    this.totales = {
      subtotal: 0,
      descuentos: 0,
      iva: 0,
      total: 0
    };
    
    this.operaciones.forEach(op => {
      const subtotal = op.monto * op.cantidad;
      const descuento = op.descuento;
      const base = subtotal - descuento;
      const iva = op.iva;
      const neto = base + iva;
      
      op.neto = neto;
      
      this.totales.subtotal += subtotal;
      this.totales.descuentos += descuento;
      this.totales.iva += iva;
      this.totales.total += neto;
    });
    
    return this.totales;
  }
  
  // Generar recibo
  async generarRecibo(formaPago) {
    try {
      // 1. Crear recibo
      const { data: recibo, error: errorRecibo } = await supabase
        .from('recibos')
        .insert([{
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toTimeString().split(' ')[0],
          subtotal: this.totales.subtotal,
          descuento_general: this.totales.descuentos,
          iva: this.totales.iva,
          total: this.totales.total,
          efectivo: formaPago.efectivo || 0,
          cheque: formaPago.cheque || 0,
          datos_cheque: formaPago.datosCheque || null,
          requiere_factura: formaPago.requiereFactura || false,
          rfc_factura: formaPago.rfcFactura || null
        }])
        .select()
        .single();
        
      if (errorRecibo) throw errorRecibo;
      
      // 2. Insertar operaciones
      const operacionesConRecibo = this.operaciones.map(op => ({
        ...op,
        recibo_id: recibo.id
      }));
      
      const { error: errorOps } = await supabase
        .from('operaciones')
        .insert(operacionesConRecibo);
        
      if (errorOps) throw errorOps;
      
      // 3. Registrar colegiaturas
      const colegiaturas = this.operaciones
        .filter(op => op.tipo === 'Colegiatura')
        .map(op => ({
          alumno_id: op.alumno_id,
          recibo_id: recibo.id,
          anio: new Date().getFullYear(),
          mes: new Date().getMonth() + 1,
          precio: op.monto,
          descuento: op.descuento,
          monto_pagado: op.neto,
          grupo: op.grupo,
          curso: this.alumnoActual.curso,
          fecha_pago: new Date().toISOString().split('T')[0]
        }));
        
      if (colegiaturas.length > 0) {
        const { error: errorCol } = await supabase
          .from('colegiaturas')
          .insert(colegiaturas);
          
        if (errorCol) throw errorCol;
      }
      
      // 4. Limpiar
      this.operaciones = [];
      this.calcularTotales();
      
      return recibo;
      
    } catch (error) {
      console.error('Error generando recibo:', error);
      throw error;
    }
  }
  
  // Cancelar recibo
  async cancelarRecibo(numeroRecibo, motivo) {
    try {
      // 1. Buscar recibo
      const { data: recibo, error: errorBuscar } = await supabase
        .from('recibos')
        .select('*, operaciones(*)')
        .eq('numero', numeroRecibo)
        .single();
        
      if (errorBuscar) throw errorBuscar;
      
      if (recibo.cancelado) {
        throw new Error('El recibo ya está cancelado');
      }
      
      // 2. Copiar operaciones a tabla de cancelados
      const operacionesCanceladas = recibo.operaciones.map(op => ({
        credencial: op.credencial,
        operacion: op.operacion,
        monto: op.monto,
        recibo: numeroRecibo,
        grupo: op.grupo,
        iva: op.iva,
        cantidad: op.cantidad,
        descuento: op.descuento,
        neto: op.neto,
        motivo_cancelacion: motivo
      }));
      
      await supabase
        .from('operaciones_canceladas')
        .insert(operacionesCanceladas);
      
      // 3. Marcar recibo como cancelado
      await supabase
        .from('recibos')
        .update({
          cancelado: true,
          fecha_cancelacion: new Date().toISOString(),
          motivo_cancelacion: motivo
        })
        .eq('id', recibo.id);
      
      // 4. Eliminar colegiaturas asociadas
      await supabase
        .from('colegiaturas')
        .delete()
        .eq('recibo_id', recibo.id);
      
      return true;
      
    } catch (error) {
      console.error('Error cancelando recibo:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const sistemaPagos = new SistemaPagos();
```

