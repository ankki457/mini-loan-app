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
    console.log("Fetched Loans:", loans); 
    res.json({ Loans: loans });
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).send("Server Error");
  }
};

// Update loan status (Admin)
export const updateLoanStatus = async (req, res) => {
  const { loanId, status } = req.body;

  console.log("Updating loan status", { loanId, status });

  if (!["approved", "rejected", "pending"].includes(status)) {
    console.log("Invalid status:", status); 
    return res.status(400).send("Invalid status.");
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      console.log("Loan not found for ID:", loanId); 
      return res.status(404).send("Loan not found.");
    }
    loan.status = status;
    await loan.save();
    console.log("Loan status updated:", loan); 
    res.json({ message: "Loan status updated successfully" });
  } catch (err) {
    console.error("Error updating loan status:", err);
    res.status(500).send("Server Error");
  }
};

// Repay loan
export const repayLoan = async (req, res) => {
  const { loanId, installmentId } = req.body;

  // Log the repayment attempt
  console.log("Repaying loan:", { loanId, installmentId });

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      console.log("Loan not found for ID:", loanId); 
      return res.status(404).send("Loan not found.");
    }

    const installment = loan.repayments.find(
      (repay) => repay._id.toString() === installmentId
    );
    if (!installment || installment.status === "paid") {
      console.log("Installment already paid or not found:", installment);
      return res.status(400).send("Installment already paid or invalid.");
    }

    installment.status = "paid";
    loan.remainingAmount -= installment.amount;

    await loan.save();
    console.log("Installment paid successfully:", loan); // Log successful repayment
    res.json({ message: "Installment paid successfully" });
  } catch (err) {
    console.error("Error during repayment:", err);
    res.status(500).send("Server Error");
  }
};
v
