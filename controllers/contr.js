const patients = require('../database/patients.json');
const pool = require('../database/connect');

const handleRoot = async (req, res) => {
  try {
    res.status(200).json({ ok: true, patients });
  } catch (error) {
    console.log(error);
  }
};

const getSinglePatient = async (req, res) => {
  const { patient_id } = req.params;

  try {
    const patient = patients.find(
      (patient) => patient.id === Number(patient_id),
    );

    if (!patient) {
      res.status(404).json({
        ok: false,
        err: `Patient with id ${patient_id} does not exist`,
      });

      return;
    }

    res.status(200).json({ ok: true, patient });
  } catch (error) {
    console.log(error);
  }
};

const handleQueries = async (req, res) => {
  const { sex, first_name } = req.query;
  try {
    let filtered = patients;

    if (sex) {
      filtered = filtered.filter(
        (patient) => patient.sex.toLowerCase() === sex,
      );
    }

    if (first_name) {
      filtered = filtered.filter(
        (patient) => patient.first_name.toLowerCase() === first_name,
      );
    }

    if (filtered.length < 1) {
      res.status(404).json({ ok: false, msg: 'No results matched your query' });
      return;
    }

    res.status(200).json({ ok: true, found: filtered.length, filtered });
  } catch (error) {
    console.log(error);
  }
};
//adding new patients
const addNewPatients  = async (req, res) => {
  const {first_name, last_name, age, sex, geo, phone, email} = req.body;
  const client = pool.connect();
  try {
    const newPatient = (await client).query(
      `INSERT INTO patients(_id, first_name, last_name, sex, age, geo, phone, email)
VALUES(100, 'Stacy', 'Catherine', 'F', '30', 'Nairobi', '+254899999', 'stacycatex@gmail.com')
    );`
    console.log(newPatient);
    res.status(200).json({OK: true});
  } catch (error) {
    console.log(error);
  
  }finally{
    (await client).release();
  }

};

module.exports = { handleRoot, getSinglePatient, handleQueries, addNewPatients };