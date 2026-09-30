import { syncInstagramFromRapidApi } from '../src/lib/instagram.js';

async function main() {
  console.log('Starting sync with new key...');
  const res = await syncInstagramFromRapidApi();
  console.log('Sync Result:', res);
}

main().catch(console.error);
