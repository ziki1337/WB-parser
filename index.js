import fetch from 'node-fetch';

async function loadApi() {
    const url = 'https://search.wb.ru/exactmatch/ru/common/v7/search?ab_testing=false&appType=1&curr=rub&dest=123586214&query=%D0%BF%D0%BB%D0%B0%D1%82%D1%8C%D0%B5%20%D0%B6%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B5&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false&uclusters=2&uiv=7&uv=IReuTiknKEqfRC8DMCyZtC-NLy4ydjA6rAsgYLEbLIIbtqyHpQemz6_sKkilrqkmLTQxUZv0L6kstawdI4odUidlMEiokCd1LFmr0RqGswOpyS-0L7gFnSDTLJmrtK9sL8Uq6ytZKbyoG6gKHeOvXKwvsJCsz7AZsIet-qtcMKSm_ywQqgCm0LGTrLutWCdMLuit4CdaJDsu5isqqQstSxpzrJgzYzLAHDeY2an-r9KiPKrlp3yw6hzwrMawAyaKK1ahWC3TKg8noZp_pwSmiS3bpIYtuTFbnPyki6yNpOgqOaxRspOs6qqFqCCxaSz-rR-qOK5arcctJitnJx2w8Q';

    const headers = {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzEwOTQwMjAsInZlcnNpb24iOjIsInVzZXIiOiI4NzMzNTI1MSIsInNoYXJkX2tleSI6IjE1IiwiY2xpZW50X2lkIjoid2IiLCJzZXNzaW9uX2lkIjoiMGIyOWQ2YWZhZThhNDAzNjg1NTBkNjQzNDY2MGUzMDciLCJ1c2VyX3JlZ2lzdHJhdGlvbl9kdCI6MTY3OTI1ODA1OSwidmFsaWRhdGlvbl9rZXkiOiJkYzdmZmU1NmM0NzkwNmNiMDk2YWYyZDk5MWIwMTgwMWU2ZDVmZGZjYjZhNjFiZjI1OTkyZDRmYmEzMjI5NzNiIiwicGhvbmUiOiJEYkpkOE9TbVg1NVM4WVJIanR0cmlnPT0ifQ.U-kkDYxljmywNYWEljyI6n7g5nDHk4zTgI_3uQCEGXpi9AiXIe81J4V6aRvx07NWoXBayMsYz1wCtbqf8fWUDFSKVnha6El_o0j8ZBJBMzoWAO3X7662TprDPk38KI5NTUQoXj6Nh4y2_bRgXM-fGjFLZwj3Cy9AZbXzOQTT4jtNPrNVk8GzKDYdj8BdEGAXemzhX8NXLf8l9vhvy827nCDoRzSKEoi95LQwq1_sVMBFbVgzLOaFfYbiTNeqbRbPgLhCAfsCF3oC5FZmQrE9bFYVINfPYE0gtTOb4klLwXyaeEu3l_pZ9YT26ijaxNCdji2Syi3_YcJtU_5JjwG4Pw",
        "origin": "https://www.wildberries.ru",
        "priority": "u=1, i",
        "referer": "https://www.wildberries.ru/catalog/0/search.aspx?search=%D0%BF%D0%BB%D0%B0%D1%82%D1%8C%D0%B5%20%D0%B6%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B5",
        "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Opera GX\";v=\"114\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        "x-queryid": "qid866323309173057035020241109202321",
        "x-userid": "87335251"
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}

function getList(response) {
    const targetIds = [240898252, 182342032, 194038444, 61110520, 175020428];
    const products_raw = response.data?.products || [];
    const products = [];
    const addedKeys = new Set();

    if (products_raw.length > 0) {
        products_raw.forEach(product => {
            if (targetIds.includes(product.id)) {
                product.sizes.forEach(size => {
                    const uniqueKey = `${product.id}-${size.id}`; 
                    if (!addedKeys.has(uniqueKey)) {
                        products.push({
                            id: product.id,
                            brand: product.brand || null,
                            name: product.name || null,
                            priceU: size.price?.basic !== undefined ? parseFloat(size.price.basic) / 100 : null,
                            ActualPrice: size.price?.total !== undefined ? parseFloat(size.price.total) / 100 : null,
                            feedback: product.feedbacks || null,
                            reviewRating: product.reviewRating || null
                        });
                        addedKeys.add(uniqueKey);
                    }
                });
            }
        });
    }

    return products;
}

async function main() {
    try {
        const data = await loadApi();
        //console.log('Продукты:', data.data?.products);
        const products = getList(data);
        console.log('Обработанные продукты:', products);
    } catch (error) {
        console.error(`Ошибка при вызове API: ${error.message}`);
    }
}

main();