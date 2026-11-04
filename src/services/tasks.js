import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'tasks';

function mapTask(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title ?? '',
    description: data.description ?? '',
    category: data.category ?? 'Tarefa',
    status: data.status ?? 'pendente',
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
}

export function subscribeToUserTasks(userId, onData, onError) {
  const tasksQuery = query(collection(db, COLLECTION), where('userId', '==', userId));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map(mapTask);
      tasks.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
      onData(tasks);
    },
    onError
  );
}

export async function createTask(userId, payload) {
  await addDoc(collection(db, COLLECTION), {
    userId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: payload.category,
    status: payload.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId, payload) {
  await updateDoc(doc(db, COLLECTION, taskId), {
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: payload.category,
    status: payload.status,
    updatedAt: serverTimestamp(),
  });
}

export async function setTaskStatus(taskId, status) {
  await updateDoc(doc(db, COLLECTION, taskId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function removeTask(taskId) {
  await deleteDoc(doc(db, COLLECTION, taskId));
}
