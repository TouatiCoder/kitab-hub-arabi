import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWriterRequests() {
  return useQuery({
    queryKey: ["writer-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writer_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useWriters() {
  return useQuery({
    queryKey: ["writers"],
    queryFn: async () => {
      // Get all users with writer role
      const { data: writerRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "writer");
      if (rolesError) throw rolesError;

      const writerIds = (writerRoles || []).map((r: any) => r.user_id);
      if (writerIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", writerIds);
      if (profilesError) throw profilesError;

      // Get content counts per writer
      const { data: contents, error: contentsError } = await supabase
        .from("contents")
        .select("writer_id, type")
        .in("writer_id", writerIds)
        .is("deleted_at", null);
      if (contentsError) throw contentsError;

      return (profiles || []).map((p: any) => {
        const writerContents = (contents || []).filter((c: any) => c.writer_id === p.id);
        return {
          ...p,
          articles: writerContents.filter((c: any) => c.type === "مقال").length,
          stories: writerContents.filter((c: any) => c.type === "قصة").length,
          novels: writerContents.filter((c: any) => c.type === "رواية").length,
          total: writerContents.length,
        };
      });
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, contents(title, writer_id, profiles:contents_writer_id_fkey(full_name))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        content_title: r.contents?.title || "",
        author_name: r.contents?.profiles?.full_name || "",
      }));
    },
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        user_name: s.profiles?.full_name || "",
        user_email: s.profiles?.email || "",
      }));
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: totalContents },
        { count: articles },
        { count: stories },
        { count: novels },
        { count: pendingReview },
        { count: writers },
        { count: pendingRequests },
        { count: reports },
      ] = await Promise.all([
        supabase.from("contents").select("*", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("contents").select("*", { count: "exact", head: true }).eq("type", "مقال").is("deleted_at", null),
        supabase.from("contents").select("*", { count: "exact", head: true }).eq("type", "قصة").is("deleted_at", null),
        supabase.from("contents").select("*", { count: "exact", head: true }).eq("type", "رواية").is("deleted_at", null),
        supabase.from("contents").select("*", { count: "exact", head: true }).eq("status", "قيد المراجعة"),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "writer"),
        supabase.from("writer_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reports").select("*", { count: "exact", head: true }).neq("status", "تمت معالجته"),
      ]);

      return {
        totalContents: totalContents || 0,
        articles: articles || 0,
        stories: stories || 0,
        novels: novels || 0,
        pendingReview: pendingReview || 0,
        writers: writers || 0,
        pendingRequests: pendingRequests || 0,
        reports: reports || 0,
      };
    },
  });
}
