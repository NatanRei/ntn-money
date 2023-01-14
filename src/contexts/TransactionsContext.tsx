import { createContext, ReactNode, useEffect, useState } from "react";

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    category: string;
    price: number;
    createdAt: string;
}

interface TransactionContextType {
    transactions : Transaction[];
}

interface TransactionProviderProps {
    children: ReactNode
}

export const TransactionContext = createContext({} as TransactionContextType) 

export function TransactionsProvider ({ children }: TransactionProviderProps) {

    const [ transactions, setTransactions ] = useState<Transaction[]>([])

    async function loadTransactions() {
        const response = await fetch('http://localhost:3000/transactions')
        const transactions = await response.json();
        setTransactions(transactions);
    }

    useEffect(() => {
        loadTransactions();
        
    }, []);

    return (
        <TransactionContext.Provider value={{ transactions }}>
            {children }
        </TransactionContext.Provider>
    );
}