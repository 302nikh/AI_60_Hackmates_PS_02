require("dotenv").config();
const mongoose = require("mongoose");
const FAQ = require("./models/FAQ");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

const faqs = [
  { question: "What is IDMS ERP?", answer: "IDMS ERP is an enterprise resource planning system." },
  { question: "How do I reset my password?", answer: "Go to settings and select ‘Reset Password’." },
];

FAQ.insertMany(faqs)
  .then(() => {
    console.log("✅ FAQs added");
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
