import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, QuerySnapshot, DocumentData, FirestoreError } from "firebase/firestore";
import { campaignApi, Campaign } from "../api";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for campaigns
    const q = query(campaignApi.collection, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        const campaignData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Campaign[];

        setCampaigns(campaignData);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error fetching campaigns:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCampaign = async (data: Omit<Campaign, "id" | "created_at" | "updated_at">) => {
    try {
      const newCampaign = await campaignApi.create(data);
      return newCampaign;
    } catch (err) {
      console.error("Failed to add campaign", err);
      throw err;
    }
  };

  const updateCampaign = async (data: Campaign) => {
    try {
      const updated = await campaignApi.update(data);
      return updated;
    } catch (err) {
      console.error("Failed to update campaign", err);
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await campaignApi.delete(id);
    } catch (err) {
      console.error("Failed to delete campaign", err);
      throw err;
    }
  };

  return { campaigns, loading, error, addCampaign, updateCampaign, deleteCampaign };
}

