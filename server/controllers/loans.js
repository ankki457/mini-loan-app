import Loan from "../models/loan.js";

// Get all loans or specific loans for a user
export const getLoans = async (req, res) => {
  try {
    let loans;
    if (req.user.user_type === "admin") {
      loans = await Loan.find().populate("user_id");
    } else {
      loans = await Loan.find({ user_id: req.user._id });
    }
    return res.status(200).json({ Loans: loans });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Create a new loan
export const createLoan = async (req, res) => {
  try {
    const { amount, terms } = req.body;
    const loan = new Loan({
      user_id: req.user._id,
      amount,
      terms,
      repayments: [],
      remainingAmount: amount,
    });

    // Generate scheduled repayments
    const repaymentAmount = (amount / terms).toFixed(2);
    const today = new Date();
    for (let i = 0; i < terms; i++) {
      const repaymentDate = new Date(today);
      repaymentDate.setDate(today.getDate() + 7 * (i + 1));
      loan.repayments.push({
        date: repaymentDate,
        amount: repaymentAmount,
      });
    }

    await loan.save();
    return res.status(201).json({ loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Update loan status (admin only)
export const updateLoan = async (req, res) => {
  try {
    if (req.user.user_type !== "admin")
      throw new Error("You are not authorized to approve loans.");

    const { id, status } = req.body;

    if (status !== "approved" && status !== "pending") {
      throw new Error("Invalid status update!");
    }

    const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true });

    if (!loan) throw new Error("Loan not found!");
    return res.status(200).json({ msg: "Loan status updated successfully!", loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Repay loan (update installment status)
export const repayLoan = async (req, res) => {
  try {
    const { loanId, installmentId, amount } = req.body;

    if (!loanId || !installmentId || !amount) {
      throw new Error("Incomplete repayment details.");
    }

    const loan = await Loan.findById(loanId);

    if (!loan) throw new Error("Loan not found!");

    const repayment = loan.repayments.id(installmentId);

    if (!repayment || repayment.status === "paid") {
      throw new Error("Invalid repayment installment.");
    }

    if (amount < repayment.amount) {
      throw new Error("Repayment amount is less than scheduled amount.");
    }

    repayment.status = "paid";
    loan.remainingAmount -= repayment.amount;

    const allPaid = loan.repayments.every((rep) => rep.status === "paid");

    if (allPaid) {
      loan.status = "paid";
    }

    await loan.save();

    return res.status(200).json({ msg: "Repayment successful!", loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
