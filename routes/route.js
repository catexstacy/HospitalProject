const { Router } = require('express');
const {
  handleRoot,
  getSinglePatient,
  handleQueries,
  addNewPatients,
} = require('../controllers/contr');

const router = Router();

router.get('/', handleRoot);
router.get('/patients/:patient_id', getSinglePatient);
router.get('/search', handleQueries);
router.get('/create', addNewPatients);

module.exports = router;