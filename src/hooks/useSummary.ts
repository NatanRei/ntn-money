import { useContextSelector } from 'use-context-selector';
import { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionsContext";

export function useSummary() {
    const transactions = useContextSelector(TransactionContext, (context) => {
        return context.transactions;
    });

    return transactions.reduce((acc, transaction) => {
        if (transaction.type == "income") {
            acc.income += transaction.price;
            acc.total += transaction.price;
        } else {
            acc.outcome += transaction.price;
            acc.total -= transaction.price;
        }
        return acc;
    }, {income: 0, outcome: 0, total:0 });
}