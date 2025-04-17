import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI");

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    console.log("Connecting to MongoDB:", MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI, mongoOptions)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch(err => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
