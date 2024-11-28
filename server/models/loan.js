import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  terms: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  status: { type: String, default: "pending" },
  remainingAmount: { type: Number },
  repayments: [
    {
      date: String,
      amount: Number,
      status: { type: String, default: "pending" },
    },
  ],
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
