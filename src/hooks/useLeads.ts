import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, QuerySnapshot, DocumentData, FirestoreError } from "firebase/firestore";
import { leadApi, Lead } from "../api";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for leads
    const q = query(leadApi.collection, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        const leadData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

        setLeads(leadData);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error fetching leads:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addLead = async (data: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    try {
      const newLead = await leadApi.create(data);
      return newLead;
    } catch (err) {
      console.error("Failed to add lead", err);
      throw err;
    }
  };

  const updateLead = async (data: Lead) => {
    try {
      const updated = await leadApi.update(data);
      return updated;
    } catch (err) {
      console.error("Failed to update lead", err);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadApi.delete(id);
    } catch (err) {
      console.error("Failed to delete lead", err);
      throw err;
    }
  };

  return { leads, loading, error, addLead, updateLead, deleteLead };
}
