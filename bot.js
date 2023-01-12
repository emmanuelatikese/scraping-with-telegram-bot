const tele = require('node-telegram-bot-api')
const puppeteer = require('puppeteer')

const bot = new tele(process.env.token,{polling:true})

const chatId = process.env.chatId



bot.sendMessage(chatId, "Hello there !")
.then(async ()=>{
    await bot.sendMessage(chatId, "what do you want to search on imdb?")
    .then(()=>(console.log('message sent!')))
    .catch((err)=> console.log(err))

    await bot.sendMessage(chatId, "use (/echo <text>) to search for the movie")
    
.catch((err)=> console.log(err))
})


async function start(echo){
    const site = await puppeteer.launch({headless:false})

    const page = await site.newPage()


    await page.goto('https://imdb.com/search')

    await page.type('#suggestion-search', echo)

    await page.click('#suggestion-search-button')

    await page.waitForNavigation()



    const data = await page.evaluate(()=>{
    
        const container = Array.from(document.querySelectorAll('.ipc-metadata-list-summary-item__tc'))
        return container.map((x)=>( {
            title: x.querySelector('.ipc-metadata-list-summary-item__tc .ipc-metadata-list-summary-item__t').textContent,
            link: x.querySelector('.ipc-metadata-list-summary-item__tc .ipc-metadata-list-summary-item__t').href,
            date: x.querySelector('ul li label') ? x.querySelector('ul li label').innerText : ''

        }))})

  

    await page.close()
    await site.close()
    
    return data
    
}



bot.onText(/\echo (.+)/, async (msg, match)=>{
    const echo = match[1]
    const res = JSON.stringify(await start(echo));
    bot.sendMessage(chatId, res)
});