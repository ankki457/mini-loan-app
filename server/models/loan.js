import mongoose from "mongoose";

const repaymentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
});

const loanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  terms: { type: Number, required: true },
  repayments: [repaymentSchema],
  remainingAmount: { type: Number, required: true },
  status: { type: String, default: "pending" },
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
