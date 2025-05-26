export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      memorial_audios: {
        Row: {
          audio_title: string | null
          audio_url: string
          created_at: string
          duration: number | null
          id: string
          memorial_id: string
        }
        Insert: {
          audio_title?: string | null
          audio_url: string
          created_at?: string
          duration?: number | null
          id?: string
          memorial_id: string
        }
        Update: {
          audio_title?: string | null
          audio_url?: string
          created_at?: string
          duration?: number | null
          id?: string
          memorial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_audios_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_photos: {
        Row: {
          created_at: string
          id: string
          memorial_id: string
          photo_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          memorial_id: string
          photo_url: string
        }
        Update: {
          created_at?: string
          id?: string
          memorial_id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_photos_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_requests: {
        Row: {
          audios: Json | null
          biography: string | null
          birth_date: string
          cover_photo_url: string | null
          created_at: string
          death_date: string
          id: string
          name: string
          notes: string | null
          photos: string[] | null
          profile_photo_url: string | null
          requester_email: string
          requester_name: string
          requester_phone: string | null
          status: string
          tribute: string | null
          updated_at: string
          videos: string[] | null
        }
        Insert: {
          audios?: Json | null
          biography?: string | null
          birth_date: string
          cover_photo_url?: string | null
          created_at?: string
          death_date: string
          id?: string
          name: string
          notes?: string | null
          photos?: string[] | null
          profile_photo_url?: string | null
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          status?: string
          tribute?: string | null
          updated_at?: string
          videos?: string[] | null
        }
        Update: {
          audios?: Json | null
          biography?: string | null
          birth_date?: string
          cover_photo_url?: string | null
          created_at?: string
          death_date?: string
          id?: string
          name?: string
          notes?: string | null
          photos?: string[] | null
          profile_photo_url?: string | null
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          status?: string
          tribute?: string | null
          updated_at?: string
          videos?: string[] | null
        }
        Relationships: []
      }
      memorial_videos: {
        Row: {
          created_at: string
          id: string
          memorial_id: string
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          memorial_id: string
          video_url: string
        }
        Update: {
          created_at?: string
          id?: string
          memorial_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_videos_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_visits: {
        Row: {
          id: string
          ip_address: unknown | null
          memorial_id: string
          visited_at: string
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          memorial_id: string
          visited_at?: string
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          memorial_id?: string
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_visits_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorials: {
        Row: {
          biography: string | null
          birth_date: string
          cover_photo_url: string | null
          created_at: string
          death_date: string
          id: string
          is_published: boolean
          name: string
          profile_photo_url: string | null
          qr_code_url: string | null
          slug: string
          tribute: string | null
          updated_at: string
        }
        Insert: {
          biography?: string | null
          birth_date: string
          cover_photo_url?: string | null
          created_at?: string
          death_date: string
          id?: string
          is_published?: boolean
          name: string
          profile_photo_url?: string | null
          qr_code_url?: string | null
          slug: string
          tribute?: string | null
          updated_at?: string
        }
        Update: {
          biography?: string | null
          birth_date?: string
          cover_photo_url?: string | null
          created_at?: string
          death_date?: string
          id?: string
          is_published?: boolean
          name?: string
          profile_photo_url?: string | null
          qr_code_url?: string | null
          slug?: string
          tribute?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: { name_text: string }
        Returns: string
      }
      get_memorial_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_memorials: number
          total_visits: number
          visits_this_month: number
          memorials_this_month: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
