import { useContext, useState } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLoan = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [purpose, setPurpose] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!amount || !term || !interestRate || !purpose)
        throw "Fill all details!";
      await axios.post(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/loans/create",
        {
          amount,
          terms: term,
          interestRate, 
          purpose, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Loan creation successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't create the loan!\nError: ${error}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm rounded">
            <h2 className="text-center mb-4">Loan Application Form</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="term" className="form-label">
                  Terms (in months)
                </label>
                <input
                  type="number"
                  id="term"
                  className="form-control"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                />
              </div>
              {/* Old fields */}
              <div className="mb-3">
                <label htmlFor="interestRate" className="form-label">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="interestRate"
                  className="form-control"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="purpose" className="form-label">
                  Loan Purpose
                </label>
                <textarea
                  id="purpose"
                  className="form-control"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLoan;
