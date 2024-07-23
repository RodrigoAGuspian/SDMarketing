import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Plataforma } from '@/lib/plataforma';

async function createPlataforma(nombre: string) {
    try {
      const docRef = await addDoc(collection(db, 'plataformas'), { nombre });
      console.log('Plataforma creada con ID: ', docRef.id);
    } catch (e) {
      console.error('Error al crear la plataforma: ', e);
    }
  }

async function fetchPlataformas(): Promise<Plataforma[]> {
    const querySnapshot = await getDocs(collection(db, 'plataformas'));
    const plataformas: Plataforma[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plataforma[];
    return plataformas;
  }

async function updatePlataforma(id: string, nombre: string) {
    const docRef = doc(db, 'plataformas', id);
    try {
      await updateDoc(docRef, { nombre });
      console.log('Plataforma actualizada');
    } catch (e) {
      console.error('Error al actualizar la plataforma: ', e);
    }
}

async function deletePlataforma(id: string) {
    const docRef = doc(db, 'plataformas', id);
    try {
      await deleteDoc(docRef);
      console.log('Plataforma eliminada');
    } catch (e) {
      console.error('Error al eliminar la plataforma: ', e);
    }
  }

export {createPlataforma, fetchPlataformas, updatePlataforma ,deletePlataforma};