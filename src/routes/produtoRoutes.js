const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const auth = require('../middlewares/authMiddleware');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', auth, controller.criar);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.excluir);

module.exports = router;
