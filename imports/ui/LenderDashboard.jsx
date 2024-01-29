import React from "react";
import { Loans } from "../api/Collections";
import { toast } from "sonner/dist";
import { useFind, useSubscribe, useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

const LenderDashboard = () => {
  const user = useTracker(() => Meteor.user());
  const navigate = useNavigate();
  const isLoading = useSubscribe("loans");
  const fetchedLoans = useFind(() => Loans.find({ status: "pending" }));
  const paidLoans = useFind(() =>
    Loans.find({ loanGivenById: Meteor.userId() })
  );

  const handlePayLoan = (loanId, userName) => {
    Meteor.call(
      "loans.pay",
      loanId,
      user.profile.name,
      Meteor.userId(),
      (error, result) => {
        if (error) {
          toast.error(`Error occured`);
          console.log(error);
        } else {
          toast.success(`Payed to ${userName}`);
        }
      }
    );
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="flex flex-wrap gap-4 items-center">
        <p className="text-3xl font-semibold text-center">Lender Dashboard</p>
        <button
          className="p-3 bg-blue-600 rounded-lg text-white"
          onClick={() => navigate("/borrower")}
        >
          Open Borrower Dashboard
        </button>
      </div>
      <div className="pt-10 flex flex-col gap-5 justify-center items-center">
        <div>
          <h3 className="text-xl font-semibold mb-4">Requested Loans</h3>
          {isLoading() ? (
            <div className="py-4 text-gray-500">Loading...</div>
          ) : fetchedLoans.length === 0 ? (
            <div className="text-center">No Loans were requested</div>
          ) : (
            <table className="min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fetchedLoans.map((loan) => (
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
                      <button
                        onClick={() => handlePayLoan(loan._id, loan.userName)}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                      >
                        Pay Loan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Loans Given</h2>
          {isLoading() ? (
            <div className="py-4 text-gray-500">Loading...</div>
          ) : paidLoans.length === 0 ? (
            <div className="text-center">No records found</div>
          ) : (
            <table className="min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid to
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paidLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loan.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.amount}</div>
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

export default LenderDashboard;
