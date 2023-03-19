async function buscarArtigos() {
    try {
        const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
        const termoDeBusca = "(echocardiography[Title/Abstract])+AND+(preterm[Title/Abstract])";
        const retmax = 20;
        const url = `${proxyUrl}https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(echocardiography[Title/Abstract])+AND+(preterm[Title/Abstract])&retmode=json&retmax=20&sort=relevance&field=pubdate`;


        const response = await axios.get(url);
        const dados = response.data;
        console.log("Dados da busca:", dados);

        const ids = dados.esearchresult.idlist;
        const elementoResultados = document.getElementById("resultados");

        if (ids.length === 0) {
            console.log("Nenhum artigo encontrado.");
            const mensagem = document.createElement("p");
            mensagem.textContent = "Nenhum artigo encontrado.";
            elementoResultados.appendChild(mensagem);
        } else {
            for (const id of ids) {
                const urlSumario = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${id}&retmode=json`;

                const responseSumario = await axios.get(urlSumario);
                const dadosSumario = responseSumario.data;
                console.log("Dados do sumário:", dadosSumario);

                const titulo = dadosSumario.result[id].title;
                const pmid = dadosSumario.result[id].uid;
                const doi = dadosSumario.result[id].elocationid;

                const elementoTitulo = document.createElement("h2");
                elementoTitulo.textContent = titulo;
                elementoResultados.appendChild(elementoTitulo);

                const elementoPmid = document.createElement("p");
                elementoPmid.textContent = `PMID: ${pmid}`;
                elementoResultados.appendChild(elementoPmid);

                if (doi) {
                    const elementoDoi = document.createElement("p");
                    elementoDoi.textContent = `DOI: ${doi}`;
                    elementoResultados.appendChild(elementoDoi);
                }
            }
        }
    } catch (error) {
        console.error("Erro ao buscar artigos:", error);
    }
}

console.log("Chamando a função buscarArtigos");
buscarArtigos();

