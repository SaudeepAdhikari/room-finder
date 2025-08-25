require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder';
  console.log('Connecting to', MONGO_URI);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const db = mongoose.connection.db;
    const collectionName = process.env.SESSIONS_COLLECTION || 'adminSessions';

    const coll = db.collection(collectionName);
    const docs = await coll.find({}).sort({ _id: -1 }).limit(10).toArray();

    if (!docs || docs.length === 0) {
      console.log('No documents found in collection', collectionName);
    } else {
      console.log(`Found ${docs.length} documents in ${collectionName}:`);
      docs.forEach((d, i) => {
        // Attempt to surface likely session payload and adminId
        const sess = d.session || d.sess || d.sessionData || null;
        const adminId = sess && (sess.adminId || sess.passport || sess.userId || sess?.user?.id) ? (sess.adminId || sess.userId || sess.user?.id || JSON.stringify(sess.passport || '')) : null;
        console.log(`\n--- doc ${i + 1} (_id=${d._id}) ---`);
        console.log('expires:', d.expires);
        console.log('adminId (candidate):', adminId);
        console.log('raw session keys:', Object.keys(d).join(', '));
        console.log('session (truncated):', JSON.stringify(sess, null, 2).slice(0, 2000));
      });
    }
  } catch (err) {
    console.error('Error reading sessions:', err && err.stack ? err.stack : err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
