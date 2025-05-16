exports.renderHome = (req, res) => {
  res.render("recepcion/home");
};

// Buscar Paciente
exports.renderBuscarPaciente = (req, res) => {
  res.render("recepcion/buscar");
};
// Buscar Paciente con filtros
exports.buscarPacienteFiltrado = (req, res) => {
  const { dni, nombre, apellido } = req.body;
  // lógica de búsqueda
  res.render("recepcion/buscarPaciente", { pacientes: resultado });
};


// Registrar Paciente Vista
exports.renderRegistrarPaciente = (req, res) => {
  res.render("recepcion/registrar");
};
// Registrar Paciente
exports.crearPaciente = (req, res) => {
  const nuevoPaciente = req.body;
  // lógica para guardar
  res.redirect("/recepcion");
};


// Internar Paciente Vista
exports.renderInternarPaciente = (req, res) => {
  res.render("recepcion/internarPaciente");
};
// Internar Paciente
exports.internarPaciente = (req, res) => {
  const datos = req.body;
  // lógica para internar
  res.redirect("/recepcion");
};