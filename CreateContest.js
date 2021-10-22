//node CreateContest.js --url=https://www.hackerrank.com/ --config=config.json
let minimist =require("minimist")
let pup=require("puppeteer")
let fs=require("fs")

let args=minimist(process.argv)

let configJSON =fs.readFileSync(args.config)
let JSO=JSON.parse(configJSON)

async function run(){
    let browser=await pup.launch({
        headless:false,
        args:[
            '--start-maximised'
        ],
        defaultViewport:null
    });

    let pages=await browser.pages();
    let page=pages[0]
    await page.goto(args.url)

    await page.waitForSelector("a[href='https://www.hackerrank.com/access-account/']")
    await page.click("a[href='https://www.hackerrank.com/access-account/']")

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']")
    await page.click("a[href='https://www.hackerrank.com/login']")

    await page.waitForSelector("input[name='username']",{delay:3000})
    await page.type("input[name='username']",JSO.username)

    await page.waitForSelector("input[type='password']",{delay:3000})
    await page.type("input[type='password']",JSO.passsword)

    await page.waitForSelector("button[type='submit']")
    await page.click("button[type='submit']")

    for(let i=0;i<3;i++){
        await page.waitForSelector("a[data-analytics='NavBarContests']")
        await page.click("a[data-analytics='NavBarContests']")

        await page.waitForSelector("a[href='/administration/contests/create']")
        await page.click("a[href='/administration/contests/create']")
        
        await page.waitForSelector("input#name")
        await page.type("input#name",`contest ${i}`)

        page.keyboard.press("Tab")
        await page.keyboard.type("10/21/2021")

        page.keyboard.press("Tab")
        await page.keyboard.type("09:00")

        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        page.keyboard.press("ArrowDown")
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")

        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        page.keyboard.press("ArrowDown")
        await page.keyboard.type("pres")
        await page.waitFor(1500)
        page.keyboard.press("Enter")

        //iCheck-helper
        await page.waitForSelector("ins.iCheck-helper")
        await page.click("ins.iCheck-helper")

        // data-analytics="CreateContestButton"
        await page.waitForSelector("button[data-analytics='CreateContestButton']")
        await page.click("button[data-analytics='CreateContestButton']")

        await page.waitFor(2000)

        await page.waitForSelector("a[data-analytics='NavBarContests']")
        await page.click("a[data-analytics='NavBarContests']")
    }

}
run()
