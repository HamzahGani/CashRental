
// Log vars as object for a cleaner log
const firstName = 'firstName'
const age = 24
const job = 'Front end development engineer'
const hobbies = 'read, write article'

console.log(firstName, age, job, hobbies)
console.log({ testName: firstName, age, job, hobbies })

// use css in console.log
console.log('%cTest', 'color: orange; font-size: 30px;')
console.log('%c'+firstName, 'color: lime; font-size: 30px;')

// use console.warn to print a warning
console.warn('This is a warning')

// use console.error to print an error (prints stack trace)
errorA();
function errorA() {errorB();}
function errorB() {errorC();}
function errorC() {console.error('This is an error');}

// use a table to display data
const foods = [
    {
      name: '🍔',
      price: 30.89,
      group: 1,
    },
    {
      name: '🍨',
      price: 20.71,
      group: 1,
    },
    {
      name: '🍿',
      price: 10.31,
      group: 2,
    },
    {
      name: '🍵',
      price: 5.98,
      group: 2,
    },
  ];
  console.table(foods);

// counters
let count = 0;
console.time('time1')
for (let i = 0; i < 100000000; i++) {
  count++;
  if (count == 5) {
    console.time('time2');
  }

  if (count == 80) {
    console.timeEnd('time2');
  }
}
console.timeEnd('time1');


