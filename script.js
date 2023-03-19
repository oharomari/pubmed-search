// URL do CORS Anywhere
const proxyUrl = 'https://cors-anywhere-for-everyone.herokuapp.com/';

// URL da API do PubMed
const pubmedUrl = `${proxyUrl}https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(echocardiography[Title/Abstract])+AND+(preterm[Title/Abstract])&retmode=json&retmax=20&sort=relevance&field=pubdate`;

// URL da API do Google Scholar
const googleUrl = `${proxyUrl}https://api.scraperapi.com/?api_key=<SUA_API_KEY>&url=https://scholar.google.com/scholar?q=echocardiography+preterm&hl=en&as_sdt=0,5&sciodt=0,5&cites=0&sort=relevance&num=20`;

// URL da API do Scielo
const scieloUrl = `${proxyUrl}https://api.scraperapi.com/?api_key=<SUA_API_KEY>&url=https://search.scielo.org/?q=echocardiography+preterm&lang=pt&count=20`;

// Função para buscar artigos na API do PubMed
async function buscarArtigosPubmed() {
  try {
    // Fazer a solicitação de busca
    const response = await fetch(pubmedUrl, {
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
    console.error('Erro ao buscar artigos no PubMed:', e);
  }
}

// Função para buscar artigos na API do Google Scholar
async function buscarArtigosGoogle() {
  try {
    const response = await fetch(googleUrl);
    const data = await response.text();
    const parser = new DOMParser();
    const doc =
