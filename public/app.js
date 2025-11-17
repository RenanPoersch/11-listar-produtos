// URL base da API - altere aqui para trocar entre localhost e produção
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://dpg-d4d8k2mr433s73dv79ug-a.oregon-postgres.render.com';

const API_URL = `${API_BASE_URL}/v1/produtos`;

const produtosGrid = document.getElementById('produtos');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

function criarCardProduto(produto) {
    return `
        <div class="produto-card">
            <img src="${produto.imagem || 'https://picsum.photos/300/200'}" 
                 alt="${produto.nome}"
                 onerror="this.src='https://picsum.photos/300/200'">
            <div class="produto-info">
                <h2>${produto.nome}</h2>
                <p class="categoria">${produto.categoria || 'Sem categoria'}</p>
                <p class="preco">${formatarPreco(produto.preco)}</p>
            </div>
        </div>
    `;
}

async function carregarProdutos() {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        produtosGrid.style.display = 'none';

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('Resposta da API:', resultado);

        // A API retorna { success, data, pagination }
        const produtos = resultado.data || [];

        if (!Array.isArray(produtos) || produtos.length === 0) {
            produtosGrid.innerHTML = '<p class="message">Nenhum produto encontrado.</p>';
            produtosGrid.style.display = 'block';
        } else {
            produtosGrid.innerHTML = produtos.map(criarCardProduto).join('');
            produtosGrid.style.display = 'grid';
        }

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        errorElement.textContent = `Erro ao carregar produtos: ${error.message}`;
        errorElement.style.display = 'block';
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Carrega os produtos quando a página é aberta
document.addEventListener('DOMContentLoaded', carregarProdutos);