import PocketBase from 'pocketbase';

const pb = new PocketBase('https://amustud.pockethost.io');
pb.autoCancellation(false); 
export default pb;