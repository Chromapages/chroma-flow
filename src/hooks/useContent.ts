import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, QuerySnapshot, DocumentData, FirestoreError } from "firebase/firestore";
import { contentApi, Content } from "../api";

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for content
    const q = query(contentApi.collection, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        const contentData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Content[];

        setContents(contentData);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error fetching content:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addContent = async (data: Omit<Content, "id" | "created_at" | "updated_at" | "published_at">) => {
    try {
      const newContent = await contentApi.create(data);
      return newContent;
    } catch (err) {
      console.error("Failed to add content", err);
      throw err;
    }
  };

  const updateContent = async (data: Content) => {
    try {
      const updated = await contentApi.update(data);
      return updated;
    } catch (err) {
      console.error("Failed to update content", err);
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await contentApi.delete(id);
    } catch (err) {
      console.error("Failed to delete content", err);
      throw err;
    }
  };

  return { contents, loading, error, addContent, updateContent, deleteContent };
}

