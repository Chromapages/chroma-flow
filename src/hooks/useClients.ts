import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, QuerySnapshot, DocumentData, FirestoreError } from "firebase/firestore";
import { clientApi, Client } from "../api";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for clients
    const q = query(clientApi.collection, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        const clientData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        setClients(clientData);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error fetching clients:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addClient = async (data: Omit<Client, "id" | "created_at" | "updated_at">) => {
    try {
      const newClient = await clientApi.create(data);
      return newClient;
    } catch (err) {
      console.error("Failed to add client", err);
      throw err;
    }
  };

  const updateClient = async (data: Client) => {
    try {
      const updated = await clientApi.update(data);
      return updated;
    } catch (err) {
      console.error("Failed to update client", err);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientApi.delete(id);
    } catch (err) {
      console.error("Failed to delete client", err);
      throw err;
    }
  };

  return { clients, loading, error, addClient, updateClient, deleteClient };
}
