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
        "https://loan-app-be-onjz.onrender.com/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      setLoans(loanData.data.Loans);
    } catch (err) {
      console.error(err);
      alert(`Can't fetch the loans\nError: ${err}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://loan-app-be-onjz.onrender.com/api/v1/loans/update-status/`,
        { id, status },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Updated the loan status");
      fetchLoans(); // Re-fetch loans after update
    } catch (error) {
      console.error(error);
      alert(`Can't update status!\nError:${error}`);
    }
  };

  const updatePayment = async (loanId, installmentId) => {
    try {
      await axios.patch(
        `https://loan-app-be-onjz.onrender.com/api/v1/loans/repay/`,
        { loanId, installmentId },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Paid the installment");
      fetchLoans(); // Re-fetch loans after payment
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
    <div className="container mx-auto p-4">
      {user && user.user_type === "admin" ? (
        <div>
          <h3 className="text-2xl font-bold">Admin</h3>
        </div>
      ) : (
        <div>
          {user && <h3 className="text-2xl font-bold">Name: {user.name}</h3>}
          {user && <h3 className="text-2xl font-bold">Email: {user.email}</h3>}
        </div>
      )}

      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      {loans.length ? (
        <table className="min-w-full bg-white border border-gray-300 mt-4">
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
              <tr key={idx}>
                {user.user_type === "admin" && <td>{loan.user_id._id}</td>}
                {user.user_type === "admin" && <td>{loan.user_id.name}</td>}
                {user.user_type === "admin" && <td>{loan.user_id.email}</td>}
                <td>{loan.amount}</td>
                <td>{loan.terms}</td>
                <td>{loan.status}</td>
                <td>{loan.createdAt.slice(0, 10)}</td>
                <td>
                  {user.user_type === "admin" && loan.status === "pending" ? (
                    <>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => updateStatus(loan._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => updateStatus(loan._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => updateShowDetails(loan._id)}
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans found!</p>
      )}

      <br />
      <a href="/createLoan" className="text-blue-500">
        Create New Loan +
      </a>
    </div>
  );
};

export default Home;
