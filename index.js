const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function openPage(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments for running as root
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(10000); // 10 saniye beklet
    await browser.close(); // Tarayıcıyı kapat
}

async function generateTraffic(url, visitors) {
    const promises = [];
    for (let i = 0; i < visitors; i++) {
        promises.push(openPage(url));
    }
    await Promise.all(promises);
}

function calculateDaysLeft(expiryDate) {
    const currentDate = new Date();
    const timeDiff = expiryDate - currentDate;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Gün cinsinden farkı hesapla
}

(async function main() {
    const expiryDate = new Date(2023, 11, 5, 23, 59, 59); // Lisans bitiş tarihi gün sonu olarak ayarlandı.
    const daysLeft = calculateDaysLeft(expiryDate);

    if (daysLeft <= 0) {
        console.log("Programın lisans süresi doldu. Yeni lisans alınız.");
        process.exit();
    } else {
        console.log(`Programın kullanım süresi sona ermesine ${daysLeft} gün kaldı.`);
    }

    const url = await askQuestion('Lütfen ziyaret edilecek URL giriniz: ');
    const visitorsString = await askQuestion('Kaç adet izleyici göndermek istersiniz: ');
    const visitors = parseInt(visitorsString);

    if (isNaN(visitors)) {
        console.log("Geçersiz izleyici sayısı. Program sonlandırılıyor.");
        process.exit();
    }

    await generateTraffic(url, visitors);
    rl.close();
})();
