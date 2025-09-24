const db = require('./models/db');
const path = require('path');

const accountDb = require(path.join(__dirname, 'models', 'accounts'));
const pawnTicketDb = require(path.join(__dirname, 'models', 'pawntickets'));

const names = [
  'Aravind Kumar', 'Priya Sharma', 'Rahul Dravid', 'Meera Iyer', 'Sanjay Reddy',
  'Deepa Rao', 'Vignesh Murugan', 'Anjali Menon', 'Karthik Ramachandran',
  'Lakshmi Devi', 'Ganesh Prasad', 'Sneha Nair', 'Arjun Krishna', 'Nandhini Prakash',
  'Harish Rao', 'Divya Sundar', 'Pradeep Menon', 'Swetha Suresh', 'Vijay Gopal',
  'Shalini Rajan', 'Mohan Reddy', 'Kavitha Sriram', 'Siddharth Varma',
  'Pooja Krishnan', 'Ajay Kumar'
];

const addresses = [
  'Anna Nagar, Chennai', 'T. Nagar, Chennai', 'Adyar, Chennai', 'Velachery, Chennai',
  'Mylapore, Chennai', 'Tambaram, Chennai', 'Nungambakkam, Chennai',
  'Chromepet, Chennai', 'Madipakkam, Chennai', 'Porur, Chennai'
];

const itemTypes = ['gold', 'silver', 'copper', 'diamond', 'platinum'];

const statusOptions = ['active', 'closed'];

const totalAccounts = 25;
const totalPawnTickets = 125;
const accountIds = [];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

db.serialize(() => {
  console.log('Seeding database with dummy data...');

  db.run('DELETE FROM pawntickets', (err) => {
    if (err) return console.error('Error clearing pawntickets:', err.message);
    console.log('Cleared pawntickets table.');
  });
  
  db.run('DELETE FROM accounts', (err) => {
    if (err) return console.error('Error clearing accounts:', err.message);
    console.log('Cleared accounts table.');
  });
  
  for (let i = 0; i < totalAccounts; i++) {
    const name = getRandomElement(names);
    const address = getRandomElement(addresses);
    const phoneNumber = `987654321${String(i).padStart(2, '0')}`;
    const aadhaarNumber = `12345678901${String(i).padStart(2, '0')}`;
    const panNumber = `ABCDE1234${String(i).padStart(2, '0')}`;
    const gender = getRandomElement(['Male', 'Female', 'Other']);
    const createdAt = getRandomDate();

    accountDb.run(
      `INSERT INTO accounts (customer_name, gender, address, phone_number, aadhaar_number, pan_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, gender, address, phoneNumber, aadhaarNumber, panNumber, createdAt],
      function(err) {
        if (err) {
          return console.error('Error inserting account:', err.message);
        }
        accountIds.push(this.lastID);
        if (accountIds.length === totalAccounts) {
          console.log(`Successfully added ${totalAccounts} accounts.`);
          seedPawnTickets();
        }
      }
    );
  }
});

const seedPawnTickets = () => {
  for (let i = 0; i < totalPawnTickets; i++) {
    const accountId = getRandomElement(accountIds);
    const itemType = getRandomElement(itemTypes);
    const loanAmount = Math.floor(Math.random() * (100000 - 5000 + 1) + 5000);
    const weight = (Math.random() * 50 + 1).toFixed(2);
    const purity = getRandomElement([24, 22, 18, 14]);
    const interestRate = (Math.random() * 5 + 1).toFixed(2);
    const advAmount = (loanAmount * (Math.random() * 0.2)).toFixed(2);
    const pawnedDate = getRandomDate();
    const status = getRandomElement(statusOptions);

    pawnTicketDb.run(
      `INSERT INTO pawntickets (account_id, pawned_item, item_type, weight, loan_amount, purity, adv_amount, interest_rate, pawned_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`${accountId}`, `Item ${i + 1}`, itemType, weight, loanAmount, purity, advAmount, interestRate, pawnedDate, status],
      function(err) {
        if (err) {
          return console.error('Error inserting pawn ticket:', err.message);
        }
        if (i === totalPawnTickets - 1) {
          console.log(`Successfully added ${totalPawnTickets} pawn tickets.`);
          db.close();
          console.log('Database connection closed.');
        }
      }
    );
  }
};