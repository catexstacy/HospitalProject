const patients = require("../database/patients.json");
const pool = require("../database/connect");

const handleRoot = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await (await client).query(`SELECT * FROM patients`);
    res.status(200).json({ ok: true, rows });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: error.message || "Internal server error" });
  } finally {
    if (client) client.release();
  }
};

const getSinglePatient = async (req, res) => {
  let client;
  try {
    client = await pool.connect()
    const patient = await client.query(
      `SELECT * FROM patients WHERE _id = $1;`,[Number(req.params.patient_id)]
    )
    if(patient.rows.length < 1 ){
      res.status(404).json({ok: false, msg:`Patient with ${req.params.patient_id} is not found`})
      return
    }
    
    
    res.status(200).json({ ok: true, patient: patient.rows });
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
        (patient) => patient.sex.toLowerCase() === sex
      );
    }

    if (first_name) {
      filtered = filtered.filter(
        (patient) => patient.first_name.toLowerCase() === first_name
      );
    }

    if (filtered.length < 1) {
      res.status(404).json({ ok: false, msg: "No results matched your query" });
      return;
    }

    res.status(200).json({ ok: true, found: filtered.length, filtered });
  } catch (error) {
    console.log(error);
  }
};

//Adding Patients
const addNewPatients = async (req, res) => {
  const { _id, first_name, last_name, age, sex, geo, phone, email } = req.body;
  let client;

  try {
    client = await pool.connect();
    const newPatient = await (
      await client
    ).query(
      `INSERT INTO patients (_id, first_name, last_name, sex, age, geo, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [_id, first_name, last_name, sex, age, geo, phone, email]
    );

    console.log(newPatient);

    res
      .status(201)
      .json({ ok: true, msg: `${first_name} has been added as a patient` });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: error.message || "Internal server error" });
  } finally {
    if (client) client.release();
  }
};

//delete patient
const deletePatient = async (req, res) => {
  let client;
  try {
    client = await pool.connect()
    const patient = await client.query(
      `DELETE FROM patients WHERE _id = $1;`,[Number(req.params.patient_id)]
    )
    if(patient.rowCount === 0 ){
      res.status(404).json({ok: false, msg:`Patient with ${req.params.patient_id} is not found`})
      return
    }
  
    console.log(patient);
    
    res.status(200).json({ ok: true});
  } catch (error) {
    res.status(500)
      .json({ ok: false, error: error.message || "Internal server error" });
  }
};

//updating patient details
const updatePatient = async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    const { first_name, last_name, sex, age, geo, phone, email } = req.body;
    const patient_id = req.params.patient_id; // Get patient ID from URL

    const patient = await client.query(
      `UPDATE patients 
       SET first_name = $1, last_name = $2, sex = $3, age = $4, geo = $5, phone = $6, email = $7 
       WHERE _id = $8;`,
      [first_name, last_name, sex, age, geo, phone, email, patient_id]
    );

    if (patient.rowCount === 0) {
      res.status(404).json({ ok: false, msg: `Patient with ID ${patient_id} not found` });
      return;
    }

    res.status(200).json({ ok: true, msg: "Patient updated successfully" });

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Internal server error" });
  } finally {
    if (client) client.release();
  }
};





module.exports = {
  handleRoot,
  getSinglePatient,
  handleQueries,
  addNewPatients,
  deletePatient,
  updatePatient,
};
