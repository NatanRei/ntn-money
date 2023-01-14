import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    category: string;
    price: number;
    createdAt: string;
}



interface TransactionProviderProps {
    children: ReactNode
}

interface CreateTransactionInput {
    description: string,
    price: number,
    category: string,
    type: 'income' | 'outcome',
}

interface TransactionContextType {
    transactions : Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>
}

export const TransactionContext = createContext({} as TransactionContextType) 

export function TransactionsProvider ({ children }: TransactionProviderProps) {

    const [ transactions, setTransactions ] = useState<Transaction[]>([])

    async function fetchTransactions(query?: string) {
        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query
            }
        })
        setTransactions(response.data);
    }

    const createTransaction = useCallback(
        async (data: CreateTransactionInput) => {
            const { category, description, price, type } = data;
            const response = await api.post('/transactions', {
                category, 
                description, 
                price, 
                type,
                createdAt: new Date()
            });
            
            setTransactions(state => [response.data, ...state]);
        }, []
    );

    

    useEffect(() => {
        fetchTransactions();
        
    }, []);

    return (
        <TransactionContext.Provider value={{ 
            transactions,
            fetchTransactions,
            createTransaction
            }}>
            {children }
        </TransactionContext.Provider>
    );
}
