import readline from 'readline';
import { run } from '../src/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function start() {
    console.log('Welcome to The Menti Raider.\n');
    rl.question('Type the series id (number): ', (seriesId) => {
      rl.question('We need your vote!: ', (vote) => {
        rl.question('How many times should we run it? (number): ', (times) => {
          console.log('\nStarting...')
          for (let i = 0; i < Number(times); i++) {
            run(Number(seriesId), `${vote}.${i}`)
              .then((value) => console.log(value))
              .catch((reason) => console.log(reason))
          }
          rl.close();
        });
      });
    });
  }
  
  start();
  