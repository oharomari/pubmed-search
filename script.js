// URL da API do PubMed
const url = 'https://cors-anywhere-for-everyone.herokuapp.com/https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(echocardiography[Title/Abstract])+AND+(preterm[Title/Abstract])&retmode=json&retmax=20&sort=relevance&field=pubdate';

// Função para buscar artigos na API do PubMed
async function buscarArtigos() {
  try {
    // Fazer a solicitação de busca
    const response = await axios.get(url);
    const data = response.data;

    // Obter lista de IDs de artigos
    const ids = data.esearchresult.idlist;

    // Para cada ID, obter informações do artigo
    const artigos = await Promise.all(ids.map(async (id) => {
      const res = await axios.get(`https://cors-anywhere-for-everyone.herokuapp.com/https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${id}&retmode=json`);
      const json = res.data;
      return json.result[id];
    }));

    // Ordenar artigos por data de publicação
    artigos.sort((a, b) => new Date(b.pubdate) - new Date(a.pubdate));

    // Exibir os artigos na página
    const listaArtigos = document.getElementById('lista-artigos');
    listaArtigos.innerHTML = '';
    artigos.forEach((artigo) => {
      const li = document.createElement('li');
      const doi = artigo.articleids.filter
