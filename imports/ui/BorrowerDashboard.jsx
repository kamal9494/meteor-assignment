import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Loans } from "../api/Collections";
import { useFind, useSubscribe, useTracker } from "meteor/react-meteor-data";
import { toast } from "sonner/dist";
import { useNavigate } from "react-router-dom";

const BorrowerDashboard = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useTracker(() => Meteor.user());
  const navigate = useNavigate();
  const isLoading = useSubscribe("loans");

  const fetchedLoans = useFind(() => Loans.find({ userId: Meteor.userId() }));

  const handleLoanRequest = () => {
    setLoading(true);
    Meteor.call(
      "loans.request",
      Meteor.userId(),
      parseFloat(loanAmount),
      user.profile.name,
      (error, result) => {
        setLoading(false);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Loan requested successfully!");
          setLoanAmount("");
        }
      }
    );
  };

  return (
    <div className="h-screen mx-auto p-8">
      <div className="flex flex-wrap gap-4 mb-7 items-center">
        <p className="text-3xl font-semibold text-center">Borrower Dashboard</p>
        {user.profile.role === "lender" && (
          <button
            className="p-3 bg-blue-600 rounded-lg text-white"
            onClick={() => navigate("/lender")}
          >
            Open Lenders Dashboard
          </button>
        )}
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Request a Loan</h3>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Enter loan amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <button
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleLoanRequest}
            disabled={!loanAmount || loading}
          >
            {loading ? "Requesting..." : "Request Loan"}
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Past Loans</h3>
        <ul>
          {!isLoading() ? (
            fetchedLoans.length === 0 ? (
              <label>No records found</label>
            ) : (
              <table className="min-w-[600px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fetchedLoans.map((loan) => (
                    <tr key={loan._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loan.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(loan.createdOn).toLocaleDateString()}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          loan.status === "paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        <div className="text-sm">
                          {loan.status === "paid"
                            ? `${loan.status.toUpperCase()} by ${
                                loan.loanGivenBy
                              }`
                            : loan.status.toUpperCase()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p>Loading...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BorrowerDashboard;
