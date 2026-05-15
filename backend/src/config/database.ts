import mongoose from 'mongoose'

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    console.log('[MONGODB] succesfully connected to the database\n')
  } catch (error) {
    console.log(`\n[MONGODB] failed to connect to the database:`, error.message)
  }
}

export default connectToDb
