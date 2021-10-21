// node Project.js --config=config.json --url="https://www.hackerrank.com"

let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require('puppeteer');

let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.config, "utf-8");
let config = JSON.parse(configJSON);


async function run(){
    let browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized'
          ],
          defaultViewport:null
    });

    let pages = await browser.pages();
    let page = pages[0]
    await page.goto(args.url);

    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']", {delay:50});
    await page.type("input[name='username']", config.username)

    await page.waitForSelector("input[name='password']" , {delay:50});
    await page.type("input[name='password']", config.passsword)

    await page.waitForSelector("button[type='submit']")
    await page.click("button[type='submit']")


    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");
    

    await page.waitForSelector("a[data-analytics='Pagination']")
    let dataPages=await page.$$eval("a[data-analytics='Pagination']",function(dataPages1){
        let dp=[]
        for(let i=2;i<dataPages1.length-2;i++){
            let url=dataPages1[i].getAttribute("href");
            dp.push(url)
        }
        return dp;
    })

    for(let i=1;i<dataPages.length+1;i++){

        await page.waitForSelector("a.backbone.block-center")
        let curls=await page.$$eval("a.backbone.block-center",function(atags){
        let urls=[]

        console.log("chala")
            for(let i=0;i<atags.length;i++){
                let url=atags[i].getAttribute("href");
                urls.push(url)
            }
            return urls
        })

        await addModerator(browser, curls)

        await page.waitForSelector(`a[href='${dataPages[i]}']`);
        await page.click(`a[href='${dataPages[i]}']`);
    }
}
run(); 

async function addModerator(browser, curls){
    
    let page = await browser.newPage();
     
    for(let i=0;i<curls.length;i++){
        let url = curls[i];

        await page.goto(`https://www.hackerrank.com${url}`);

        await page.waitForSelector("li[data-tab='moderators']");
        await page.click("li[data-tab='moderators']");

        await page.waitFor(2000)

        if (await page.$("button#cancelBtn") !== null) {
            await page.click("button#cancelBtn");
        }

        await page.waitForSelector("input#moderator")
        await page.type("input#moderator", config.moderator , {delay:20})

        await page.keyboard.press('Enter');

        await page.waitForSelector("a[href='/administration/contests']");
        await page.click("a[href='/administration/contests']");

    }
    await page.close();
    return;
}