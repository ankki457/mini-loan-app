import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const { user, token, setLoggedIn, setUser } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch loans from backend
  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoans(response.data.Loans);
    } catch (err) {
      console.error(err);
      alert(`Can't fetch the loans\nError: ${err.response?.data?.message || err.message}`);
    }
  };

  // Update the loan status (approved/rejected/pending)
  const updateStatus = async (loanId, status) => {
    const validStatuses = ["approved", "rejected", "pending"];

    // Validate status
    if (!validStatuses.includes(status)) {
      alert(`Invalid status: ${status}`);
      return;
    }

    try {
      await axios.patch(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/loans/update-status/",
        { loanId, status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId ? { ...loan, status } : loan
        )
      );

      alert("Loan status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle loan repayment
  const updatePayment = async (loanId, installmentId) => {
    try {
      await axios.patch(
        `https://mini-loan-app-gfv3.onrender.com/api/v1/loans/repay/`,
        { loanId, installmentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setLoans((prevLoans) =>
        prevLoans.map((loan) => {
          if (loan._id === loanId) {
            return {
              ...loan,
              repayments: loan.repayments.map((repay) =>
                repay._id === installmentId ? { ...repay, status: "paid" } : repay
              ),
            };
          }
          return loan;
        })
      );

      alert("Paid the installment");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Can't pay installment!\nError: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="container mt-5">
      {/* User Info */}
      <div className="d-flex justify-content-between">
        {user?.user_type === "admin" ? (
          <h3 className="font-weight-bold">Admin</h3>
        ) : (
          <div>
            <h3 className="font-weight-bold">Name: {user?.name}</h3>
            <h3 className="font-weight-bold">Email: {user?.email}</h3>
          </div>
        )}

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Loans Table */}
      {loans.length > 0 ? (
        <table className="table table-bordered table-striped mt-4">
          <thead>
            <tr>
              {user?.user_type === "admin" && <th>User Id</th>}
              {user?.user_type === "admin" && <th>Name</th>}
              {user?.user_type === "admin" && <th>Email</th>}
              <th>Amount</th>
              <th>Terms</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  {user?.user_type === "admin" && <td>{loan.user_id._id}</td>}
                  {user?.user_type === "admin" && <td>{loan.user_id.name}</td>}
                  {user?.user_type === "admin" && <td>{loan.user_id.email}</td>}
                  <td>{loan.amount}</td>
                  <td>{loan.terms}</td>
                  <td>{loan.status}</td>
                  <td>{loan.createdAt?.slice(0, 10) || "N/A"}</td>
                  <td>
                    {user?.user_type === "admin" && loan.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => updateStatus(loan._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(loan._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setShowDetails(loan._id)}
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>

                {showDetails === loan._id && (
                  <tr>
                    <td colSpan={8}>
                      <div className="bg-light p-3 rounded">
                        <h5>Total Amount: {loan.amount}</h5>
                        <h5>Remaining Amount: {loan.remainingAmount}</h5>
                        <table className="table table-bordered mt-3">
                          <thead>
                            <tr>
                              <th>Amount</th>
                              <th>Due</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loan.repayments?.map((repay) => (
                              <tr key={repay._id}>
                                <td>{repay.amount}</td>
                                <td>{repay.date?.slice(0, 10) || "N/A"}</td>
                                <td>{repay.status}</td>
                                <td>
                                  {repay.status === "pending" ? (
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => updatePayment(loan._id, repay._id)}
                                    >
                                      Repay
                                    </button>
                                  ) : (
                                    <button className="btn btn-secondary btn-sm" disabled>
                                      Paid
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans found!</p>
      )}

      {/* Create Loan Link */}
      <div className="mt-4">
        <Link to="/createLoan" className="btn btn-link text-primary">
          Create New Loan +
        </Link>
      </div>
    </div>
  );
};

export default Home;
