const winston = require('winston');

const puppeteer = require('puppeteer');
const express = require('express');
const handlebars = require('handlebars');

const logger = winston.createLogger({
    level: process.env.PP_LOG_LEVEL || 'info',
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console(),
    ],
});

const port = 3000;
const host = '0.0.0.0'

const app = express();

app.use(express.json({
    limit: '10mb',
    type: 'application/json',
}));

let browser;
puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox', // For testing purposes
    ],
})
    .then(b => {
        logger.info('Puppeteer browser launched');
        browser = b;
    })
    .catch(e => {
        logger.error('Puppeteer browser launch failed', e);
    });

app.post('/print', async (req, res) => {
    const start = new Date().getTime();

    const data = req.body;

    const page = await browser.newPage();
    await page.setContent(data.html);
    const pdf = await page.pdf({
        format: 'A4',
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '25mm',
            left: '20mm',
        },
        headerTemplate: data.headerTemplate,
        footerTemplate: data.footerTemplate,
    });
    await page.close();

    const end = new Date().getTime();
    logger.info(`PDF generated in ${end - start}ms`);

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=out.pdf',
        'Content-Length': pdf.length,
    });
    res.end(pdf);
});

app.post('/render', async (req, res) => {
    const start = new Date().getTime();

    const data = req.body;
    const template = handlebars.compile(data.template);
    const html = template(data.values);

    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({format: 'A4'});
    await page.close();

    const end = new Date().getTime();
    logger.info(`PDF generated in ${end - start}ms`);

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=out.pdf',
        'Content-Length': pdf.length,
    });
    res.end(pdf);
});

app.get('/health', (req, res) => {
    res.status(browser != null ? 200 : 500);
    res.json({
        status: browser != null ? 'ok' : 'error',
    });
});

app.listen(port, host, () => {
    logger.info(`Puppet PDF listening on port ${host}:${port}`);
});

if (browser != null) {
    logger.info('Closing browser');
    browser.close();
}