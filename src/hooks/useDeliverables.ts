import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, QuerySnapshot, DocumentData, FirestoreError } from "firebase/firestore";
import { deliverableApi, Deliverable } from "../api";

export function useDeliverables() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for deliverables
    const q = query(deliverableApi.collection, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        const deliverableData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Deliverable[];

        setDeliverables(deliverableData);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error fetching deliverables:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addDeliverable = async (data: Omit<Deliverable, "id" | "created_at" | "updated_at">) => {
    try {
      const newDeliverable = await deliverableApi.create(data);
      return newDeliverable;
    } catch (err) {
      console.error("Failed to add deliverable", err);
      throw err;
    }
  };

  const updateDeliverable = async (data: Deliverable) => {
    try {
      const updated = await deliverableApi.update(data);
      return updated;
    } catch (err) {
      console.error("Failed to update deliverable", err);
      throw err;
    }
  };

  const deleteDeliverable = async (id: string) => {
    try {
      await deliverableApi.delete(id);
    } catch (err) {
      console.error("Failed to delete deliverable", err);
      throw err;
    }
  };

  return { deliverables, loading, error, addDeliverable, updateDeliverable, deleteDeliverable };
}

