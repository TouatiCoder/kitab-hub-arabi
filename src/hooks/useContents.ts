import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentRow {
  id: string;
  writer_id: string;
  title: string;
  body: string | null;
  summary: string | null;
  cover_url: string | null;
  type: "مقال" | "قصة" | "رواية";
  category: string | null;
  tags: string[];
  status: "مسودة" | "قيد المراجعة" | "منشور" | "مرفوض";
  is_premium: boolean;
  is_complete: boolean | null;
  pdf_url: string | null;
  views: number;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // joined
  writer_name?: string;
  writer_email?: string;
}

// Fetch published content (public)
export function usePublishedContents(type?: "مقال" | "قصة" | "رواية") {
  return useQuery({
    queryKey: ["contents", "published", type],
    queryFn: async () => {
      let query = supabase
        .from("contents")
        .select("*, profiles!contents_writer_id_fkey(full_name, email)")
        .eq("status", "منشور" as any)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (type) {
        query = query.eq("type", type as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((item: any) => ({
        ...item,
        writer_name: item.profiles?.full_name || "كاتب",
        writer_email: item.profiles?.email || "",
      })) as ContentRow[];
    },
  });
}

// Fetch single content with chapters
export function useContentById(id: string | undefined) {
  return useQuery({
    queryKey: ["content", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*, profiles!contents_writer_id_fkey(full_name, email), chapters(*)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return {
        ...data,
        writer_name: (data as any).profiles?.full_name || "كاتب",
        writer_email: (data as any).profiles?.email || "",
        chapters: ((data as any).chapters || []).sort((a: any, b: any) => a.chapter_number - b.chapter_number),
      };
    },
  });
}

// Fetch all contents for admin
export function useAllContents() {
  return useQuery({
    queryKey: ["contents", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*, profiles!contents_writer_id_fkey(full_name, email)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((item: any) => ({
        ...item,
        writer_name: item.profiles?.full_name || "كاتب",
        writer_email: item.profiles?.email || "",
      })) as ContentRow[];
    },
  });
}

// Fetch writer's own contents
export function useWriterContents(writerId: string | undefined) {
  return useQuery({
    queryKey: ["contents", "writer", writerId],
    enabled: !!writerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*")
        .eq("writer_id", writerId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ContentRow[];
    },
  });
}
