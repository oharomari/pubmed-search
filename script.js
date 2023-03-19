// URL do CORS Anywhere
const proxyUrl = 'https://cors-anywhere-for-everyone.herokuapp.com/';

// URL da API do PubMed
const url = `${proxyUrl}https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(echocardiography[Title/Abstract])+AND+(preterm[Title/Abstract])&retmode=json&retmax=20&sort=relevance&field=pubdate`;

// Função para buscar artigos na API do PubMed
async function buscarArtigos() {
  try {
    // Fazer a solicitação de busca
    const response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    const data = await response.json();

    // Obter lista de IDs de artigos
    const ids = data.esearchresult.idlist;

    // Para cada ID, obter informações do artigo
    const artigos = await Promise.all(ids.map(async (id) => {
      const res = await fetch(`${proxyUrl}https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${id}&retmode=json`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const json = await res.json();
      return json.result[id];
    }));

    // Ordenar artigos por data de publicação
    artigos.sort((a, b) => new Date(b.pubdate) - new Date(a.pubdate));

    // Exibir os artigos na página
    const listaArtigos = document.getElementById('lista-artigos');
    listaArtigos.innerHTML = '';
    artigos.forEach((artigo) => {
      const li = document.createElement('li');
      const doi = artigo.articleids.filter((id) => id.idtype === 'doi')[0];
      const pmid = artigo.articleids.filter((id) => id.idtype === 'pubmed')[0];
      const link = document.createElement('a');
      link.href = `https://www.ncbi.nlm.nih.gov/pubmed/${pmid.value}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = artigo.title;
      li.appendChild(link);
      const info = document.createElement('span');
      info.textContent = ` (${new Date(artigo.pubdate).toLocaleDateString()})`;
      li.appendChild(info);
      listaArtigos.appendChild(li);
    });
  } catch (e) {
    console.error('Erro ao buscar artigos:', e);
  }
}

// Chamar a função buscarArtigos ao carregar a página
window.onload = buscarArtigos;


