import Loan from "../models/loan.js";

// Get all loans (Admin or User)
export const getLoans = async (req, res) => {
  try {
    let loans;
    if (req.user.user_type === "admin") {
      loans = await Loan.find().populate("user_id");
    } else {
      loans = await Loan.find({ user_id: req.user.id }).populate("user_id");
    }
    res.json({ Loans: loans });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update loan status (Admin)
export const updateLoanStatus = async (req, res) => {
  const { loanId, status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).send("Invalid status.");
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).send("Loan not found.");
    }
    loan.status = status;
    await loan.save();
    res.json({ message: "Loan status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Repay loan
export const repayLoan = async (req, res) => {
  const { loanId, installmentId } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).send("Loan not found.");
    }

    const installment = loan.repayments.find(
      (repay) => repay._id.toString() === installmentId
    );
    if (!installment || installment.status === "paid") {
      return res.status(400).send("Installment already paid or invalid.");
    }

    installment.status = "paid";
    loan.remainingAmount -= installment.amount;

    await loan.save();
    res.json({ message: "Installment paid successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
