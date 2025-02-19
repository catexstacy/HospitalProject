const { Router } = require('express');
const {
  handleRoot,
  getSinglePatient,
  handleQueries,
  addNewPatients,
  deletePatient,
  updatePatient,
} = require('../controllers/contr');

const router = Router();

router.get('/', handleRoot);
router.post('/create', addNewPatients);
router.get('/patients/:patient_id', getSinglePatient);
router.get('/search', handleQueries);
router.delete('/delete/:patient_id', deletePatient)
router.patch('/update/:patient_id', updatePatient)

module.exports = router;