const pool = require('../config/database');

exports.listar = async (filtros = {}) => {
  try {
    let query = `
      SELECT p.*, c.nome as categoria
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filtro por nome
    if (filtros.nome) {
      query += ` AND p.nome ILIKE $${paramCount}`;
      params.push(`%${filtros.nome}%`);
      paramCount++;
    }

    // Filtro por preço mínimo
    if (filtros.precoMin) {
      query += ` AND p.preco >= $${paramCount}`;
      params.push(filtros.precoMin);
      paramCount++;
    }

    // Filtro por preço máximo
    if (filtros.precoMax) {
      query += ` AND p.preco <= $${paramCount}`;
      params.push(filtros.precoMax);
      paramCount++;
    }

    // Ordenação (removido referência a created_at)
    query += ' ORDER BY p.id DESC';

    // Paginação
    const page = filtros.page || 1;
    const pageSize = filtros.pageSize || 10;
    const offset = (page - 1) * pageSize;

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(pageSize, offset);

    // Executar query
    const result = await pool.query(query, params);

    // Contar total de registros
    let countQuery = `
      SELECT COUNT(*) as total
      FROM produtos p
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCount = 1;

    if (filtros.nome) {
      countQuery += ` AND p.nome ILIKE $${countParamCount}`;
      countParams.push(`%${filtros.nome}%`);
      countParamCount++;
    }

    if (filtros.precoMin) {
      countQuery += ` AND p.preco >= $${countParamCount}`;
      countParams.push(filtros.precoMin);
      countParamCount++;
    }

    if (filtros.precoMax) {
      countQuery += ` AND p.preco <= $${countParamCount}`;
      countParams.push(filtros.precoMax);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      produtos: result.rows,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error('Erro no produtoRepository.listar:', error);
    throw error;
  }
};

exports.buscarPorId = async (id) => {
  try {
    const query = `
      SELECT p.*, c.nome as categoria
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no produtoRepository.buscarPorId:', error);
    throw error;
  }
};

exports.criar = async (dados) => {
  try {
    const { nome, descricao, preco, estoque, categoriaId, imagem } = dados;
    const query = `
      INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, imagem)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [nome, descricao, preco, estoque, categoriaId, imagem]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no produtoRepository.criar:', error);
    throw error;
  }
};

exports.atualizar = async (id, dados) => {
  try {
    const { nome, descricao, preco, estoque, categoriaId, imagem } = dados;
    const query = `
      UPDATE produtos
      SET nome = COALESCE($1, nome),
          descricao = COALESCE($2, descricao),
          preco = COALESCE($3, preco),
          estoque = COALESCE($4, estoque),
          categoria_id = COALESCE($5, categoria_id),
          imagem = COALESCE($6, imagem)
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [nome, descricao, preco, estoque, categoriaId, imagem, id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no produtoRepository.atualizar:', error);
    throw error;
  }
};

exports.excluir = async (id) => {
  try {
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no produtoRepository.excluir:', error);
    throw error;
  }
};
