const API_URL = 'http://localhost:3000/v1/produtos';
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

        const { data: produtos } = await response.json();

        if (produtos.length === 0) {
            produtosGrid.innerHTML = '<p class="message">Nenhum produto encontrado.</p>';
        } else {
            produtosGrid.innerHTML = produtos.map(criarCardProduto).join('');
        }

        produtosGrid.style.display = 'grid';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        errorElement.style.display = 'block';
    } finally {
        loadingElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', carregarProdutos);