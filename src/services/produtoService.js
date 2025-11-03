const repo = require('../repositories/produtoRepository');
const { randomUUID } = require('crypto');

function listar(filtros) {
  return repo.listar(filtros);
}

function buscarPorId(id) {
  const produto = repo.buscarPorId(id);
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

function criar(dados) {
  const { nome, preco, categoriaId, descricao, estoque } = dados;

  if (!nome || !preco || !categoriaId) {
    throw new Error('Campos obrigatórios: nome, preco, categoriaId');
  }

  const produto = {
    id: randomUUID(),
    nome,
    descricao: descricao || null,
    preco: Number(preco),
    estoque: estoque ?? 0,
    categoriaId
  };

  return repo.criar(produto);
}

function atualizar(id, dados) {
  const produto = repo.atualizar(id, dados);
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

function excluir(id) {
  const ok = repo.excluir(id);
  if (!ok) throw new Error('Produto não encontrado');
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
