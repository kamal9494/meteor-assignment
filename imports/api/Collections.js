import { Mongo } from 'meteor/mongo';

export const Loans = new Mongo.Collection('loans');
export const Payments = new Mongo.Collection('payments');