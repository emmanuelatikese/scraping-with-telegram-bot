const puppeteer = require('puppeteer')


async function start(){
    const site = await puppeteer.launch({headless:false})

    const page = await site.newPage()


    await page.goto('https://imdb.com/search')

    await page.type('#suggestion-search', 'pb paradise')

    await page.click('#suggestion-search-button')

    await page.waitForNavigation()



    const data = await page.evaluate(()=>{
    
        const container = Array.from(document.querySelectorAll('.ipc-metadata-list-summary-item__tc'))
        return container.map((x)=>( {
            title: x.querySelector('.ipc-metadata-list-summary-item__tc .ipc-metadata-list-summary-item__t').textContent,
            link: x.querySelector('.ipc-metadata-list-summary-item__tc .ipc-metadata-list-summary-item__t').href,
            date: x.querySelector('ul li label').textContent

        }))})
    console.log(data)
    

    await page.close()
    await site.close()
}

start()