#!/usr/bin/env node
import * as puppeteer from "puppeteer"
import * as leet from "./leet/index.js"

async function getBrowser() {
    return puppeteer.connect({
        browserURL: 'http://localhost:9222', // Ensure this matches the remote debugging port
        defaultViewport: null,
    });
}

async function run() {
    const browser = await getBrowser()
    const op = process.argv[2];

    setTimeout(() => {
        console.log("exiting due to time limit")
        process.exit(1)
    }, +process.argv[3] || 20 * 60 * 1000);

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
