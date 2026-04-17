import { JobzynProvider } from '../src/lib/scrapers/jobzyn';
import { EmploiMaProvider } from '../src/lib/scrapers/emploi-ma';
import { KhdmaProvider } from '../src/lib/scrapers/khdma';
import { MarocAnnoncesProvider } from '../src/lib/scrapers/maroc-annonces';
import { PostuleProvider } from '../src/lib/scrapers/postule.ma';
import { StagiairesProvider } from '../src/lib/scrapers/stagiaires.ma';

async function test() {
  const p1 = await JobzynProvider.fetch(1, {});
  console.log('Jobzyn:', p1.length);
  const p2 = await EmploiMaProvider.fetch(1, {});
  console.log('EmploiMa:', p2.length);
  const p3 = await KhdmaProvider.fetch(1, {});
  console.log('Khdma:', p3.length);
  const p4 = await MarocAnnoncesProvider.fetch(1, {});
  console.log('MarocAnnonces:', p4.length);
  const p5 = await PostuleProvider.fetch(1, {});
  console.log('Postule:', p5.length);
  const p6 = await StagiairesProvider.fetch(1, {});
  console.log('Stagiaires:', p6.length);
}

test();
