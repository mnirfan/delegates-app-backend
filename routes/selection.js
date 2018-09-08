var express = require('express');
var selectionController = require('../controllers/selection')
var router = express.Router();

router.get('/', selectionController.allSelection)
router.post('/create', selectionController.createSelection)
router.post('/update', selectionController.updateSelection)
router.delete('/delete', selectionController.deleteSelection)
router.post('/vote', selectionController.vote)
router.get('/:id', selectionController.detailSelection)

module.exports = router;
