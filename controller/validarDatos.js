function validarCamposPaciente(datos) {
  const errores = {};
  if (!datos.dni) errores.dni = 'El campo DNI es obligatorio';
  if (!datos.nombre) errores.nombre = 'El campo Nombre es obligatorio';
  if (!datos.apellido) errores.apellido = 'El campo Apellido es obligatorio';
  if (!datos.genero) errores.genero = 'El campo Género es obligatorio';
  if (!datos.fechaNacimiento) {
    errores.fechaNacimiento = 'La Fecha de Nacimiento es obligatoria';
  } else if (new Date(datos.fechaNacimiento) >= new Date()) {
    errores.fechaNacimiento = 'La Fecha de Nacimiento no puede ser futura';
  }
  if (!datos.idNacionalidad) errores.idNacionalidad = 'La Nacionalidad es obligatoria';
  if (!datos.domicilio) errores.domicilio = 'El Domicilio es obligatorio';
  if (!datos.email) errores.email = 'El Email es obligatorio';
  if (!datos.telefono) errores.telefono = 'El Teléfono es obligatorio';
  return errores;
};

function controlDni(dni) {
  const errores = {};
  if (!/^\d{8,}$/.test(dni)) {
    errores.dni = "DNI no valido";
  };
  return errores;
}

module.exports = {
  validarCamposPaciente,
  controlDni
}