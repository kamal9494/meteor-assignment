import React from "react";
import { Loans } from "../api/Collections";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";

const AdminDashboard = (userRole) => {
  const isLoading = useSubscribe("loans");
  const navigate = useNavigate();
  const transactions = useFind(() => Loans.find({ status: "paid" }));
  const requests = useFind(() => Loans.find({ status: "pending" }));
  if(!userRole) navigate("/login");
  if(userRole === "admin") navigate("/login");

  return (
    <div className="h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h2>
      <div className="pt-10 flex flex-col gap-5 justify-center items-center">
        <div>
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          {isLoading() ? (
            <div className="py-4 text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center">No Transactions made</div>
          ) : (
            <table className="min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Given By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((loan) => (
                  <tr key={loan._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loan.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.loanGivenBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Loan Requests</h2>
          {isLoading() ? (
            <div className="py-4 text-gray-500">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center">No records found</div>
          ) : (
            <table className="min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((loan) => (
                  <tr key={loan._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loan.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(loan.createdOn).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
