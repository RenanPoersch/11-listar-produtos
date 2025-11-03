module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'API Catálogo de Produtos',
    version: '1.0.0',
    description: 'API para gerenciar catálogo de produtos'
  },
  paths: {
    '/v1/produtos': {
      get: {
        summary: 'Listar produtos',
        responses: { 200: { description: 'Lista de produtos' } }
      },
      post: {
        summary: 'Criar produto',
        responses: { 201: { description: 'Produto criado' } }
      }
    }
  }
};
