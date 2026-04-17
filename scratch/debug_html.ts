import { fetchHtmlCode } from '../src/lib/scraper-utils';
import * as fs from 'fs';
import * as path from 'path';

async function debug() {
  const urls = [
    { name: 'jobzyn', url: 'https://www.jobzyn.com/fr/search?q=stage' },
    { name: 'emploima', url: 'https://www.emploi.ma/recherche-jobs-maroc/?f%5B0%5D=im_field_offre_metiers%3A31&f%5B1%5D=im_field_offre_contrat_type%3A45' },
    { name: 'marocannonces', url: 'https://www.marocannonces.com/maroc/offres-de-stage-domain-informatique-multimedia-internet-b313.html' },
    { name: 'postule', url: 'https://www.postule.ma/jobs?search=stage+developpeur' },
    { name: 'stagiaires', url: 'https://www.stagiaires.ma/stage-emploi-maroc?q=developpeur' }
  ];

  for (const item of urls) {
    console.log(`Fetching ${item.name}...`);
    const html = await fetchHtmlCode(item.url, false);
    if (html) {
      const filePath = path.join(__dirname, `debug_${item.name}.html`);
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${item.name} to ${filePath} (${html.length} bytes)`);
    } else {
      console.log(`Failed to fetch ${item.name}`);
    }
  }
}

debug();
