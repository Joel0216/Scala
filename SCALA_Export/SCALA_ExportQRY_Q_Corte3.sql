SELECT DISTINCTROW Recibos.Numero, Recibos.Fecha, Operaciones.Operacion, Operaciones.Monto, Operaciones.Recibo, Operaciones.Grupo, Operaciones.IVA, Operaciones.Cantidad, Operaciones.Descuento, Operaciones.General, Operaciones.Neto, Recibos.DatosCheque
FROM Operaciones INNER JOIN Recibos ON Operaciones.Recibo=Recibos.Numero
WHERE (((Recibos.Fecha) Between [Fecha de inicio] And [Fecha final]))
WITH OWNERACCESS OPTION;
