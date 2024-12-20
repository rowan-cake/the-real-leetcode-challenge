#!/usr/bin/env node
import * as puppeteer from "puppeteer"
import * as leet from "./leet/index.js"

async function getBrowser() {
    return puppeteer.connect({
        browserURL: 'http://localhost:9222', // Ensure this matches the remote debugging port
        defaultViewport: null,
    });
}

async function wait(time) {
    const start = Date.now();
    let lastReport = 0;
    while (true) {
        const now = Date.now();
        const delta = now - start;
        if (now - lastReport > 30 * 1000) {
            console.log(`you have ${(time - delta) / 1000}s remaining`)
            lastReport = now
        }

        if (delta > time) {
            process.exit(1)
        }

        await new Promise(res => setTimeout(res, 15));
    }
}

async function run() {
    const browser = await getBrowser()
    const op = process.argv[2];

    wait(+process.argv[3] || 20 * 60 * 1000)
    switch (op) {
        case "submit":
            await leet.submit(browser)
            break;
        case "listen":
            await leet.listen(browser)
            break;
    }

    process.exit(0)
}

run();
