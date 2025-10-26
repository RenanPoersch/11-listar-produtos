const pool = require('../config/database');

async function listar({ page = 1, pageSize = 10, nome, precoMin, precoMax }) {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT * FROM produtos WHERE 1=1';
  const params = [];

  if (nome) {
    params.push(`%${nome}%`);
    query += ` AND nome ILIKE $${params.length}`;
  }
  if (precoMin) {
    params.push(precoMin);
    query += ` AND preco >= $${params.length}`;
  }
  if (precoMax) {
    params.push(precoMax);
    query += ` AND preco <= $${params.length}`;
  }

  query += ` ORDER BY criado_em DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  const { rows } = await pool.query(query, params);
  const total = (await pool.query('SELECT COUNT(*) FROM produtos')).rows[0].count;

  return { total: Number(total), page, pageSize, data: rows };
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
  return rows[0];
}

async function criar(produto) {
  const query = `
    INSERT INTO produtos (id, nome, descricao, preco, estoque, categoria_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    produto.id,
    produto.nome,
    produto.descricao,
    produto.preco,
    produto.estoque,
    produto.categoriaId,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function atualizar(id, dados) {
  const campos = [];
  const valores = [];
  let i = 1;

  for (const [key, value] of Object.entries(dados)) {
    if (['nome', 'descricao', 'preco', 'estoque', 'categoriaId'].includes(key)) {
      campos.push(`${key === 'categoriaId' ? 'categoria_id' : key} = $${i++}`);
      valores.push(value);
    }
  }

  if (!campos.length) return null;

  valores.push(id);
  const query = `
    UPDATE produtos
    SET ${campos.join(', ')}, atualizado_em = NOW()
    WHERE id = $${i}
    RETURNING *;
  `;
  const { rows } = await pool.query(query, valores);
  return rows[0];
}

async function excluir(id) {
  const { rowCount } = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
