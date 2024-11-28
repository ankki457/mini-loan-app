import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const { user, token, setLoggedIn, setUser } = useContext(AuthContext);
  const [showDetails, updateShowDetails] = useState("-1");
  const navigate = useNavigate();

  const fetchLoans = async () => {
    try {
      const loanData = await axios.get(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      setLoans(loanData.data.Loans);
      console.log(loanData.data.Loans);
    } catch (err) {
      console.error(err);
      alert(`Can't fetch the loans\nError: ${err}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://mini-loan-app-gfv3.onrender.com/api/v1/loans/update-status/`,
        { id, status },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Updated the loan status");
      window.location.reload(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't update status!\nError:${error}`);
    }
  };

  const updatePayment = async (loanId, installmentId) => {
    try {
      await axios.patch(
        `https://mini-loan-app-gfv3.onrender.com/api/v1/loans/repay/`,
        { loanId, installmentId },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Paid the installment");
      window.location.reload(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't pay installment!\nError:${error}`);
    }
  };

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
        {user && user.user_type === "admin" ? (
          <h3 className="font-weight-bold">Admin</h3>
        ) : (
          <div>
            {user && <h3 className="font-weight-bold">Name: {user.name}</h3>}
            {user && <h3 className="font-weight-bold">Email: {user.email}</h3>}
          </div>
        )}

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Loans Table */}
      {loans.length ? (
        <table className="table table-bordered table-striped mt-4">
          <thead>
            <tr>
              {user.user_type === "admin" && <th>User Id</th>}
              {user.user_type === "admin" && <th>Name</th>}
              {user.user_type === "admin" && <th>Email</th>}
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
                  {user.user_type === "admin" && <td>{loan.user_id._id}</td>}
                  {user.user_type === "admin" && <td>{loan.user_id.name}</td>}
                  {user.user_type === "admin" && <td>{loan.user_id.email}</td>}
                  <td>{loan.amount}</td>
                  <td>{loan.terms}</td>
                  <td>{loan.status}</td>
                  <td>{loan.createdAt.slice(0, 10)}</td>
                  <td>
                    {user && user.user_type === "admin" && loan.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => updateStatus(loan._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(loan._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : loan.status !== "rejected" ? (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => updateShowDetails(loan._id)}
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled
                      >
                        Rejected :(
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
                          {loan.repayments && (
                            <>
                              <thead>
                                <tr>
                                  <th>Amount</th>
                                  <th>Due</th>
                                  <th>Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {loan.repayments.map((repay) => (
                                  <tr key={repay._id}>
                                    <td>{repay.amount}</td>
                                    <td>{repay.date.slice(0, 15)}</td>
                                    <td>{repay.status}</td>
                                    <td>
                                      {repay.status === "pending" ? (
                                        <button
                                          className="btn btn-success btn-sm"
                                          disabled={loan.status !== "accepted"}
                                          onClick={() => updatePayment(loan._id, repay._id)}
                                        >
                                          Repay
                                        </button>
                                      ) : (
                                        <button className="btn btn-success btn-sm" disabled>
                                          Paid :)
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          )}
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
        <a href="/createLoan" className="btn btn-link text-primary">
          Create New Loan +
        </a>
      </div>
    </div>
  );
};

export default Home;
