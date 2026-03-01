import fs from 'fs';

const urls = [
    "https://centrolaser.com.do/oftalmologos/dr-juan-batlle-pichardo/",
    "https://centrolaser.com.do/oftalmologos/dr-juan-batlle-logrono/",
    "https://centrolaser.com.do/oftalmologos/dra-maria-teresa-salazar/",
    "https://centrolaser.com.do/oftalmologos/dr-gernot-winkler/",
    "https://centrolaser.com.do/oftalmologos/dr-juan-l-ubiera/",
    "https://centrolaser.com.do/oftalmologos/dra-adalgisa-corona/",
    "https://centrolaser.com.do/oftalmologos/dra-rachel-alburquerque/",
    "https://centrolaser.com.do/oftalmologos/dr-carlos-gomez/",
    "https://centrolaser.com.do/oftalmologos/dra-antonina-paniagua/",
    "https://centrolaser.com.do/oftalmologos/dra-maritza-minguez/",
    "https://centrolaser.com.do/oftalmologos/dra-elupina-de-leon/"
];

async function run() {
    const results = [];
    for (const url of urls) {
        try {
            console.log("Fetching", url);
            const resp = await fetch("https://r.jina.ai/" + url);
            const text = await resp.text();

            // Parse markdown text
            // Title usually on first line # Dr. Name
            let name = 'Unknown';
            const nameMatch = text.match(/#\s+(.+?)\n/);
            if (nameMatch) {
                name = nameMatch[1].trim();
            }

            // Looking for image link: ![Dr...](image_url)
            let image = '';
            const imgMatch = text.match(/!\[.*?\]\((https?:\/\/[^\)]+\.(?:jpg|jpeg|png|webp).*?)\)/i);
            if (imgMatch) {
                image = imgMatch[1];
            }

            // Looking for specialties list, often after "Especialidad:" or similar
            let specialties = [];
            const specMatch = text.match(/Especialidades?[:\*]*\s*([^\n]+)/i);
            if (specMatch) {
                specialties = specMatch[1].split(',').map(s => s.trim().replace(/\*/g, ''));
            }

            // Bio text - probably paragraphs after the headers
            let bio = '';
            const bioLines = text.split('\n').filter(line =>
                line.trim().length > 100 &&
                !line.includes('Especialidades') &&
                !line.includes('Centro Láser participó') &&
                !line.includes('Reserva tu cita') &&
                !line.includes('https://')
            );
            if (bioLines.length > 0) {
                bio = bioLines[0].trim();
            }

            results.push({ name, image, specialties, bio, url });

            // Wait a bit to not get rate limited
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error("Error for", url, e);
        }
    }

    fs.writeFileSync('c:/Users/mario/OneDrive/Desktop/Apps/053 - Centro Laser/scraped_doctors.json', JSON.stringify(results, null, 2));
    console.log("Done scraping", results.length, "doctors.");
}

run();
