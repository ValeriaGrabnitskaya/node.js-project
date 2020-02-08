const indexUrlsWords = require('../db/controllers/index_urls_words_controller');
const indexUrls = require('../db/controllers/index_urls_controller.js');
const sharedConfig = require('../configures/shared_config');
const sharedIndexing = require('../shared/shared_indexing');

async function getSearchResult(searchPhrase, token) {
    let words = [];
    while (true) {
        let searchRes = sharedConfig.WORD_RE.exec(searchPhrase);
        if (!searchRes)
            break;;
        words.push(searchRes[0].toUpperCase());
    }
    let allHits = await indexUrlsWords.getSearchWords(words);

    // для каждого index_url найдём:
    // sp_hits - сколько раз поисковые слова вообще встретились в содержимом УРЛа (с повторами, т.е. может быть например 10 для поисковой фразы "неделя Минск")
    // sp_uniq_hits - сколько из поисковых слов встретились хотя бы один раз (т.е. для поисковой фразы "неделя Минск" может быть 0, 1, 2)
    let spHits = {}; // ключ - index_url, значение - { sp_hits:XXX, sp_uniq_hits:XXX, sp_words:{} }, в sp_words учитываем какие поисковые слова уже встречались
    allHits.forEach(hitRow => {
        if (!(hitRow.index_url in spHits))
            spHits[hitRow.index_url] = { sp_hits: 0, sp_uniq_hits: 0, sp_words: {} };
        let spHitsRow = spHits[hitRow.index_url];

        spHitsRow.sp_hits++;

        if (!(hitRow.word in spHitsRow.sp_words)) {
            spHitsRow.sp_words[hitRow.word] = hitRow.clean_txt_index;
            spHitsRow.sp_uniq_hits++;
        }
    });

    // скомпонуем из spHits массив и отсортируем по релевантности
    // каждому из критериев подходимости УРЛа под поисковую фразу нужно назначить свой удельный вес и сформировать общий признак "релевантность"
    let results = [];
    for (let index_url in spHits) {
        let spHitsRow = spHits[index_url];
        results.push({ index_url, relev: (spHitsRow.sp_uniq_hits * 10 + spHitsRow.sp_hits * 1) });
    }

    // сортируем результаты по релевантности
    results.sort((r1, r2) => r2.relev - r1.relev);

    const indexIds = results.map((result) => result.index_url);

    const indexData = await indexUrls.getIndexDataByIds(indexIds);

    return await getBlockPage(words, spHits, indexData, token);
}

async function getBlockPage(words, spHits, indexData, token) {
    const fetchOptions = {
        method: "get",
        headers: {
            'Accept': "text/html",
            'Cookie': `token=${token}`
        }
    }

    var resultBlock = '';
    for (var i = 0; i < indexData.length; i++) {
        const index = indexData[i];
        const wordsIndexingHash = spHits[index.id].sp_words;

        const indexing = [];

        for (var key in wordsIndexingHash) {
            indexing.push(wordsIndexingHash[key]);
        }

        const response = await fetch('http://localhost:7480' + index.url, fetchOptions);
        const html = await response.text();
        let text = sharedIndexing.removeTags(html, " ");

        var substring = text.substring(indexing[0]-200, indexing[indexing.length-1]+200)

        words.forEach((word) => {
            var searchPhraseRE = new RegExp(word, "ig");
            substring = substring.replace(searchPhraseRE, '<span style="background-color: yellow">'+word.toUpperCase()+'</span>')
        })
        
        resultBlock += `
        <div class="card mt-5">
            <div class="card-header"><a href="${index.url}">${index.title}</a></div>
            <div class="card-body">
                <p class="card-text">${substring}</p>
            </div>
        </div>
        `;
    }
    return resultBlock;
}

module.exports = {
    getSearchResult
}