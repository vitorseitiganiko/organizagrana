import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { IExpensesValuesDB } from '../utils/interfaces';

export const useFirebase = () => {
  const getDataFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const removeDataFirebase = async (idDoDocumento: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', idDoDocumento));
      alert('Despesa Excluída!');
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
    }
  };

  const createDataFirebase = async (newExpense: IExpensesValuesDB) => {
    console.log('newExpense  ==> ', newExpense);
    try {
      await addDoc(collection(db, 'expenses'), newExpense);
      alert('Despesa Adicionada!');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
    }
  };

  return {
    getDataFirebase,
    removeDataFirebase,
    createDataFirebase,
  };
};
