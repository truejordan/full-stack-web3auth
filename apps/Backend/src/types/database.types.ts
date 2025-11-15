export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          channel_name: string
          created_at: string
          description: string | null
          end_time: string | null
          game_id: string | null
          host_id: string
          id: string
          is_live: Database["public"]["Enums"]["channel_status"] | null
          metadata: Json | null
          reason_ended: Database["public"]["Enums"]["end_reason"] | null
          recording_s3_urls: string | null
          start_time: string | null
          viewer_count: number | null
        }
        Insert: {
          channel_name: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          game_id?: string | null
          host_id: string
          id?: string
          is_live?: Database["public"]["Enums"]["channel_status"] | null
          metadata?: Json | null
          reason_ended?: Database["public"]["Enums"]["end_reason"] | null
          recording_s3_urls?: string | null
          start_time?: string | null
          viewer_count?: number | null
        }
        Update: {
          channel_name?: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          game_id?: string | null
          host_id?: string
          id?: string
          is_live?: Database["public"]["Enums"]["channel_status"] | null
          metadata?: Json | null
          reason_ended?: Database["public"]["Enums"]["end_reason"] | null
          recording_s3_urls?: string | null
          start_time?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          courts: number
          created_at: string | null
          date_time: string
          description: string | null
          ended_at: string | null
          host_id: string
          id: string
          image: string | null
          isprivate: boolean
          location_address: string | null
          location_lat: number | null
          location_long: number | null
          max_teams: number
          name: string
          started_at: string | null
          updated_at: string | null
        }
        Insert: {
          courts?: number
          created_at?: string | null
          date_time?: string
          description?: string | null
          ended_at?: string | null
          host_id: string
          id?: string
          image?: string | null
          isprivate?: boolean
          location_address?: string | null
          location_lat?: number | null
          location_long?: number | null
          max_teams?: number
          name: string
          started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          courts?: number
          created_at?: string | null
          date_time?: string
          description?: string | null
          ended_at?: string | null
          host_id?: string
          id?: string
          image?: string | null
          isprivate?: boolean
          location_address?: string | null
          location_lat?: number | null
          location_long?: number | null
          max_teams?: number
          name?: string
          started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      function_backups: {
        Row: {
          created_at: string | null
          definition: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          definition?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          definition?: string | null
          name?: string | null
        }
        Relationships: []
      }
      game_events: {
        Row: {
          event: Database["public"]["Enums"]["game_event_type"]
          game_id: string
          id: string
          time_stamp: string
        }
        Insert: {
          event: Database["public"]["Enums"]["game_event_type"]
          game_id: string
          id?: string
          time_stamp?: string
        }
        Update: {
          event?: Database["public"]["Enums"]["game_event_type"]
          game_id?: string
          id?: string
          time_stamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_events_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_officials: {
        Row: {
          game_id: string
          id: string
          role: Database["public"]["Enums"]["official_type"]
          user_id: string
        }
        Insert: {
          game_id: string
          id?: string
          role: Database["public"]["Enums"]["official_type"]
          user_id: string
        }
        Update: {
          game_id?: string
          id?: string
          role?: Database["public"]["Enums"]["official_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_officials_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_officials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_participants: {
        Row: {
          game_id: string
          id: string
          is_starter: boolean
          starting_position: number | null
          user_id: string
        }
        Insert: {
          game_id: string
          id?: string
          is_starter?: boolean
          starting_position?: number | null
          user_id: string
        }
        Update: {
          game_id?: string
          id?: string
          is_starter?: boolean
          starting_position?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_stat_events: {
        Row: {
          game_id: string
          id: string
          stat: Database["public"]["Enums"]["stat_event_type"]
          time_stamp: string
          user_id: string
        }
        Insert: {
          game_id: string
          id?: string
          stat: Database["public"]["Enums"]["stat_event_type"]
          time_stamp?: string
          user_id: string
        }
        Update: {
          game_id?: string
          id?: string
          stat?: Database["public"]["Enums"]["stat_event_type"]
          time_stamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_stat_events_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_stat_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          a_team: string
          b_team: string
          ended_at: string | null
          even_id: string
          id: string
          mode: Database["public"]["Enums"]["game_type"] | null
          started_at: string | null
          status: Database["public"]["Enums"]["game_status"] | null
          winner: string | null
        }
        Insert: {
          a_team: string
          b_team: string
          ended_at?: string | null
          even_id: string
          id?: string
          mode?: Database["public"]["Enums"]["game_type"] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          winner?: string | null
        }
        Update: {
          a_team?: string
          b_team?: string
          ended_at?: string | null
          even_id?: string
          id?: string
          mode?: Database["public"]["Enums"]["game_type"] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_a_team_fkey"
            columns: ["a_team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_b_team_fkey"
            columns: ["b_team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_even_id_fkey"
            columns: ["even_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_winner_fkey"
            columns: ["winner"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          event_id: string
          id: string
          status: Database["public"]["Enums"]["participant_status"]
          status_changed_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          status?: Database["public"]["Enums"]["participant_status"]
          status_changed_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          status?: Database["public"]["Enums"]["participant_status"]
          status_changed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_events: {
        Row: {
          event: Database["public"]["Enums"]["team_event_type"]
          game_id: string
          id: string
          team_id: string
          time_stamp: string
        }
        Insert: {
          event: Database["public"]["Enums"]["team_event_type"]
          game_id: string
          id?: string
          team_id: string
          time_stamp?: string
        }
        Update: {
          event?: Database["public"]["Enums"]["team_event_type"]
          game_id?: string
          id?: string
          team_id?: string
          time_stamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_events_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_membership: {
        Row: {
          id: string
          joined_at: string
          left_at: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          left_at?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          left_at?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_membership_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_membership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          team_name: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          team_name?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      userlinks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          email: string
          gender: Database["public"]["Enums"]["user_gender"] | null
          id: string
          name: string | null
          username: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id?: string
          name?: string | null
          username: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id?: string
          name?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      channel_status: "LIVE" | "ENDED" | "OFFLINE" | "ERROR"
      end_reason: "ENDED" | "CANCELLED"
      game_event_type:
        | "GAME_START"
        | "GAME_END"
        | "OVER_TIME_START"
        | "OVER_TIME_END"
        | "CLOCK_RESUME"
        | "CLOCK_STOP"
      game_status: "STARTED" | "ENDED" | "PENDING"
      game_type: "ONES" | "TWOS" | "3X3"
      official_type: "SCORE_KEEPER" | "BROADCASTER" | "REFEREE"
      participant_status: "WAITLISTED" | "JOINED" | "LEFT" | "CANCELLED"
      stat_event_type:
        | "1_PT"
        | "1_MISS"
        | "2_PT"
        | "2_MISS"
        | "AST"
        | "REB"
        | "TOV"
        | "FOUL"
        | "OF_FL"
        | "BLOCK"
        | "STEALSUB_IN"
        | "SUB_OUT"
      team_event_type: "TIME_OUT" | "SHOT_CLOCK_VIOLATION"
      user_gender: "MALE" | "FEMALE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      channel_status: ["LIVE", "ENDED", "OFFLINE", "ERROR"],
      end_reason: ["ENDED", "CANCELLED"],
      game_event_type: [
        "GAME_START",
        "GAME_END",
        "OVER_TIME_START",
        "OVER_TIME_END",
        "CLOCK_RESUME",
        "CLOCK_STOP",
      ],
      game_status: ["STARTED", "ENDED", "PENDING"],
      game_type: ["ONES", "TWOS", "3X3"],
      official_type: ["SCORE_KEEPER", "BROADCASTER", "REFEREE"],
      participant_status: ["WAITLISTED", "JOINED", "LEFT", "CANCELLED"],
      stat_event_type: [
        "1_PT",
        "1_MISS",
        "2_PT",
        "2_MISS",
        "AST",
        "REB",
        "TOV",
        "FOUL",
        "OF_FL",
        "BLOCK",
        "STEALSUB_IN",
        "SUB_OUT",
      ],
      team_event_type: ["TIME_OUT", "SHOT_CLOCK_VIOLATION"],
      user_gender: ["MALE", "FEMALE"],
    },
  },
} as const
