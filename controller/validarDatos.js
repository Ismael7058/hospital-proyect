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

function username(username) {
  if (typeof username !== 'string') throw new Error('Nombre de usuario no es un string')
  if (username.length < 3) throw new Error('Nombre de usuario menor a 3 caracteres')
}

function password(password) {
  if (typeof password !== 'string') throw new Error('Contraseña no es un string')
  if (password.length < 6) throw new Error('Contraseña es menor a 6 caracteres')
}


module.exports = {
  validarCamposPaciente,
  controlDni,
  username,
  password
}