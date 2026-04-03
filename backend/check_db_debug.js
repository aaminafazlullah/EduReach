const mongoose = require('mongoose');

async function check() {
  try {
    const mongoUri = 'mongodb+srv://aamina:Aamina4@edureach.vfvsp29.mongodb.net/EduReach?appName=EduReach';
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    
    const usersCount = await db.collection('users').countDocuments();
    const authsCount = await db.collection('auths').countDocuments();
    const schoolsCount = await db.collection('schools').countDocuments();
    
    console.log(`Counts -> Users: ${usersCount}, Auths: ${authsCount}, Schools: ${schoolsCount}`);
    
    const lastUser = await db.collection('users').findOne({}, { sort: { _id: -1 } });
    if (lastUser) {
      console.log('Last User Email:', lastUser.email);
      const auth = await db.collection('auths').findOne({ user_id: lastUser._id });
      console.log('Auth record found for this user:', auth ? 'Yes' : 'No');
      if (auth) {
        console.log('Auth email field:', auth.email || 'MISSING');
      }
    }

    const lastAuth = await db.collection('auths').findOne({}, { sort: { _id: -1 } });
    if (lastAuth) {
      console.log('Last Auth linked User ID:', lastAuth.user_id);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
