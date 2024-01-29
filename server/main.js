import { Meteor } from "meteor/meteor";
import { Loans, Payments } from "../imports/api/Collections";

Meteor.startup(() => {
  Meteor.methods({
    "loans.request"(userId, amount, userName) {
      Loans.insert({
        userId,
        amount,
        status: "pending",
        userName,
        createdOn: new Date(),
      });
    },
    "users.setRole"(userId, role) {
      Meteor.users.update(userId, { $set: { "profile.role": role } });
    },
    "loans.pay"(loanId, loanGivenBy, loanGivenById) {
      Loans.update(loanId, {
        $set: { status: "paid", loanGivenBy: loanGivenBy, loanGivenById},
      });
    },
  });

  Meteor.publish("loans", function () {
    return Loans.find();
  });
});
