
const {
  Ala,
  Habitacion,
  Cama
} = require("../model");

async function verCamas(req, res) {
  try {
    const alas = await Ala.findAll({
      include: [
        {
          model: Habitacion,
          as: 'habitaciones',
          include: [
            {
              model: Cama,
              as: 'camas'
            }
          ]
        }
      ],
      order: [
        ['nombre', 'ASC'],                        // ordena las alas por nombre
        [{ model: Habitacion, as: 'habitaciones' }, 'numero', 'ASC'],  // ordena habitaciones
        [{ model: Habitacion, as: 'habitaciones' }, { model: Cama, as: 'camas' }, 'numero', 'ASC'] // ordena camas
      ]
    });

    res.render('recepcion/camas', { alas });
  } catch (error) {
    console.error("Error al cargar listado de camas:", error);
    res.status(500).send("Error interno al cargar las camas.");
  }
}

module.exports = {
  verCamas
};