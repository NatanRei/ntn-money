import { MagnifyingGlass } from "phosphor-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SearchFormContainer } from "./styles";
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from "react";
import { TransactionContext } from "../../../../contexts/TransactionsContext";

const SearchFormSchema = z.object({
    query: z.string()
});

type SearchFormInputs = z.infer<typeof SearchFormSchema>

export function SearchForm() {

    const { fetchTransactions } = useContext(TransactionContext);

    const { 
        register,
        handleSubmit,
        formState: {
            isSubmitting
        } } = useForm<SearchFormInputs>({
        resolver: zodResolver(SearchFormSchema)
    });

    async function handleSearchTransactions(data: SearchFormInputs) {
        await fetchTransactions(data.query);
    }

    return (<SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
        <input 
            type="text" 
            placeholder="Busque por transações..."
            {...register('query')}
        />
        <button type="submit" disabled={isSubmitting}>
            <MagnifyingGlass size={20} />
            Buscar
            </button>
    </SearchFormContainer>)
}