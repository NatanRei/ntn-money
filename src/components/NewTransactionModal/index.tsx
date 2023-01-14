
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import { useContextSelector } from "use-context-selector";
import { Controller, useForm } from 'react-hook-form';
import * as z from "zod";
import { TransactionContext } from '../../contexts/TransactionsContext';
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles';

const newTransactionModalSchema = z.object({
    description: z.string(),
    price: z.number(),
    category: z.string(),
    type: z.enum(['income', 'outcome']),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionModalSchema>

export function NewTransactionModal () {

    const createTransaction = useContextSelector(TransactionContext, (context) => {
        return context.createTransaction;
    });

   const { 
    control,
    register,
    handleSubmit, 
    reset,
    formState: {
        isSubmitting
    
   }} = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionModalSchema),
    defaultValues : {
        type: 'income'
    }
   })

   async function handleSubmitNewTransactionForm(data: NewTransactionFormInputs) {
    await createTransaction(data);
    reset();
   }

    return (
    <Dialog.Portal>
        <Overlay/>
        <Content>
            <Dialog.Title>Nova Transação</Dialog.Title>
            <CloseButton>
                <X size={24}/>
            </CloseButton>
            <form onSubmit={handleSubmit(handleSubmitNewTransactionForm)}>
                <input type="text" placeholder="Descrição"
                {...register('description')}
                required />
                <input type="number" placeholder="Preço" 
                {...register('price', { valueAsNumber: true})}
                required />
                <input type="text" placeholder="Categoria"
                {...register('category')}
                required />

                <Controller
                control={control}
                name='type'
                render={({ field }) => {
                    return (
                        <TransactionType onValueChange={field.onChange} value={field.value}>
                        <TransactionTypeButton variant='income' value='income'>
                            <ArrowCircleUp size={24} /> Entrada
                        </TransactionTypeButton>
                        <TransactionTypeButton variant='outcome' value='outcome'>
                            <ArrowCircleDown size={24} /> Saida
                        </TransactionTypeButton>
                    </TransactionType>
                    )
                }}
                />




                <button type="submit" disabled={isSubmitting}>Cadastrar</button>

            </form>
            
        </Content>
    </Dialog.Portal>
    );
}