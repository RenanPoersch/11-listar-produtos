const service = require('../services/produtoService');

// 🧾 LISTAR PRODUTOS (com filtros e paginação)
async function listar(req, res) {
  try {
    const filtros = {
      nome: req.query.nome,
      precoMin: req.query.precoMin,
      precoMax: req.query.precoMax,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const resultado = await service.listar(filtros);
    res.json(resultado);
  } catch (err) {
    console.error('❌ Erro em produtoController.listar:', err.message);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
}

// 🔎 BUSCAR PRODUTO POR ID
async function buscarPorId(req, res) {
  try {
    const produto = await service.buscarPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (err) {
    console.error('❌ Erro em produtoController.buscarPorId:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
}

// ➕ CRIAR NOVO PRODUTO
async function criar(req, res) {
  try {
    const produto = await service.criar(req.body);
    res.status(201).json(produto);
  } catch (err) {
    console.error('❌ Erro em produtoController.criar:', err.message);
    res.status(400).json({ erro: err.message });
  }
}

// ✏️ ATUALIZAR PRODUTO EXISTENTE
async function atualizar(req, res) {
  try {
    const produto = await service.atualizar(req.params.id, req.body);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (err) {
    console.error('❌ Erro em produtoController.atualizar:', err.message);
    res.status(400).json({ erro: err.message });
  }
}

// 🗑️ EXCLUIR PRODUTO
async function excluir(req, res) {
  try {
    const ok = await service.excluir(req.params.id);
    if (!ok) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('❌ Erro em produtoController.excluir:', err.message);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
