import * as puppeteer from "puppeteer"
import * as fs from "node:fs/promises"

/**
 * @param {puppeteer.Browser} browser
 * @returns {Promise<puppeteer.Page>}
 */
export async function findLeetcodePage(browser) {
    const pages = await browser.pages()
    for (const page of pages) {
        if (page.url().includes("https://leetcode.com/problems")) {
            return page
        }
    }

    throw new Error("couldn't find page")
}

/**
 * @typedef {{
    state: "PENDING"
} | {
    status_code: number,
    run_success: boolean,
    finished: boolean,
    total_correct: 0,
    total_testcases: 104,
    status_msg: string,
    state: "SUCCESS"
    }} SubmitResponse
*/


/**
 * @param {puppeteer.Page} page
 * @param {string} id
 * @returns {Promise<SubmitResponse>}
 */
async function submission(page, id) {
    return new Promise((res, rej) => {

        async function innerSubmission(response) {
            if (response.url().includes(id)) {
                try {
                    const data = /** @type {SubmitResponse} */(await response.json())
                    if (data.state === "PENDING") {
                        return
                    }
                    res(data)
                    page.off("response", innerSubmission)
                } catch (e) {
                    console.log("unable to get json", e, await response.text());
                    rej(e)
                }
            }
        }

        page.on('response', innerSubmission);
    });
}

/**
 * @param {puppeteer.Page}
 * @returns {Promise<string>}
 */
async function listenForSubmit(page) {
    return new Promise((res, rej) => {
        /**
         * @param {puppeteer.HTTPResponse} response
         */
        async function innerListenForSubmit(response) {
            if (response.url().includes("submit")) {
                page.off('response', innerListenForSubmit)
                try {
                    const data = await response.json()
                    res(data.submission_id)
                } catch (e) {
                    console.log("unable to get json", e, await response.text());
                    rej(e)
                }
            }
        }

        page.on('response', innerListenForSubmit)
    });
}

/**
 * @param {puppeteer.Browser} browser
 */
export async function listen(browser) {
    const page = await findLeetcodePage(browser)
    while (true) {
        try {
            const id = await listenForSubmit(page)
            const response = await submission(page, id);

            console.log(response.status_msg)
            if (response.status_msg === "Wrong Answer") {
                process.exit(1)
            }
            process.exit(0)
        } catch (e) {
        }
    }
}

/**
 * @param {puppeteer.Browser} browser
 */
export async function submit(browser) {
    const page = await findLeetcodePage(browser)
    const submitButton = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('button'));
        return elements.find(el => el.textContent.trim().includes('Submit'));
    });

    const [
        _,
        id
    ] = await Promise.all([
        submitButton.click(),
        listenForSubmit(page),
    ]);

    const response = await submission(page, id);
    console.log(response.status_msg)
    if (response.status_msg === "Wrong Answer") {
        process.exit(1)
    }
    process.exit(0)
}
