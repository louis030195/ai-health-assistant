export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          biometrics: Json | null
          data_source: string | null
          date: string | null
          durations: Json | null
          end_time: string | null
          energy_expenditure: Json | null
          error: string | null
          hour: string | null
          id: number
          location: Json | null
          movement: Json | null
          name: string | null
          source: string | null
          start_time: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          biometrics?: Json | null
          data_source?: string | null
          date?: string | null
          durations?: Json | null
          end_time?: string | null
          energy_expenditure?: Json | null
          error?: string | null
          hour?: string | null
          id?: number
          location?: Json | null
          movement?: Json | null
          name?: string | null
          source?: string | null
          start_time?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          biometrics?: Json | null
          data_source?: string | null
          date?: string | null
          durations?: Json | null
          end_time?: string | null
          energy_expenditure?: Json | null
          error?: string | null
          hour?: string | null
          id?: number
          location?: Json | null
          movement?: Json | null
          name?: string | null
          source?: string | null
          start_time?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      biometrics: {
        Row: {
          blood_glucose: Json | null
          blood_pressure: Json | null
          data_source: string | null
          date: string | null
          end_time: string | null
          error: string | null
          heart_rate: Json | null
          hour: string | null
          hrv: Json | null
          id: number
          respiration: Json | null
          source: string | null
          start_time: string | null
          temperature: Json | null
          user_id: string | null
        }
        Insert: {
          blood_glucose?: Json | null
          blood_pressure?: Json | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          heart_rate?: Json | null
          hour?: string | null
          hrv?: Json | null
          id?: number
          respiration?: Json | null
          source?: string | null
          start_time?: string | null
          temperature?: Json | null
          user_id?: string | null
        }
        Update: {
          blood_glucose?: Json | null
          blood_pressure?: Json | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          heart_rate?: Json | null
          hour?: string | null
          hrv?: Json | null
          id?: number
          respiration?: Json | null
          source?: string | null
          start_time?: string | null
          temperature?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biometrics_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      body: {
        Row: {
          body_fat_pct: number | null
          bone_mass_kg: number | null
          data_source: string | null
          date: string | null
          end_time: string | null
          error: string | null
          height_cm: number | null
          hour: string | null
          id: number
          lean_mass_kg: number | null
          max_heart_rate_bpm: number | null
          muscle_mass_kg: number | null
          source: string | null
          start_time: string | null
          user_id: string | null
          weight_kg: number | null
          weight_samples_kg: Json | null
        }
        Insert: {
          body_fat_pct?: number | null
          bone_mass_kg?: number | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          height_cm?: number | null
          hour?: string | null
          id?: number
          lean_mass_kg?: number | null
          max_heart_rate_bpm?: number | null
          muscle_mass_kg?: number | null
          source?: string | null
          start_time?: string | null
          user_id?: string | null
          weight_kg?: number | null
          weight_samples_kg?: Json | null
        }
        Update: {
          body_fat_pct?: number | null
          bone_mass_kg?: number | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          height_cm?: number | null
          hour?: string | null
          id?: number
          lean_mass_kg?: number | null
          max_heart_rate_bpm?: number | null
          muscle_mass_kg?: number | null
          source?: string | null
          start_time?: string | null
          user_id?: string | null
          weight_kg?: number | null
          weight_samples_kg?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "body_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chats: {
        Row: {
          category: string | null
          channel: string | null
          created_at: string
          id: number
          text: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          channel?: string | null
          created_at?: string
          id?: number
          text?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          channel?: string | null
          created_at?: string
          id?: number
          text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      foods: {
        Row: {
          amount: number | null
          brand: string | null
          data_source: string | null
          date: string | null
          end_time: string | null
          error: string | null
          hour: string | null
          id: number
          name: string | null
          nutrition_facts: Json | null
          source: string | null
          start_time: string | null
          unit: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          brand?: string | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          hour?: string | null
          id?: number
          name?: string | null
          nutrition_facts?: Json | null
          source?: string | null
          start_time?: string | null
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          brand?: string | null
          data_source?: string | null
          date?: string | null
          end_time?: string | null
          error?: string | null
          hour?: string | null
          id?: number
          name?: string | null
          nutrition_facts?: Json | null
          source?: string | null
          start_time?: string | null
          unit?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foods_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      insights: {
        Row: {
          created_at: string
          id: number
          text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      onboardings: {
        Row: {
          id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboardings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string
          id: number
          text: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sleep: {
        Row: {
          biometrics: Json | null
          data_source: string | null
          date: string | null
          durations: Json | null
          end_time: string | null
          error: string | null
          hour: string | null
          id: number
          source: string | null
          start_time: string | null
          user_id: string | null
          wakeup_frequency: number | null
        }
        Insert: {
          biometrics?: Json | null
          data_source?: string | null
          date?: string | null
          durations?: Json | null
          end_time?: string | null
          error?: string | null
          hour?: string | null
          id?: number
          source?: string | null
          start_time?: string | null
          user_id?: string | null
          wakeup_frequency?: number | null
        }
        Update: {
          biometrics?: Json | null
          data_source?: string | null
          date?: string | null
          durations?: Json | null
          end_time?: string | null
          error?: string | null
          hour?: string | null
          id?: number
          source?: string | null
          start_time?: string | null
          user_id?: string | null
          wakeup_frequency?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sleep_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      states: {
        Row: {
          apple_health_data: Json | null
          created_at: string
          id: number
          measurement_date: string | null
          metadata: Json | null
          oura: Json | null
          probability: number | null
          user_id: string
        }
        Insert: {
          apple_health_data?: Json | null
          created_at?: string
          id?: number
          measurement_date?: string | null
          metadata?: Json | null
          oura?: Json | null
          probability?: number | null
          user_id: string
        }
        Update: {
          apple_health_data?: Json | null
          created_at?: string
          id?: number
          measurement_date?: string | null
          metadata?: Json | null
          oura?: Json | null
          probability?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: number
          text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tokens: {
        Row: {
          created_at: string | null
          mediar_user_id: string | null
          metadata: Json | null
          provider: string | null
          refresh_token: string | null
          scopes: string[] | null
          status: Json | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          mediar_user_id?: string | null
          metadata?: Json | null
          provider?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
          status?: Json | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          mediar_user_id?: string | null
          metadata?: Json | null
          provider?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
          status?: Json | null
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_mediar_user_id_fkey"
            columns: ["mediar_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          goal: string | null
          id: string
          language: string | null
          metadata: Json | null
          metriport_user_id: string | null
          neurosity: Json | null
          oura: Json | null
          payment_method: Json | null
          phone: string | null
          phone_verified: boolean
          plan: string | null
          telegram_chat_id: string | null
          telegram_username: string | null
          timezone: string
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          goal?: string | null
          id: string
          language?: string | null
          metadata?: Json | null
          metriport_user_id?: string | null
          neurosity?: Json | null
          oura?: Json | null
          payment_method?: Json | null
          phone?: string | null
          phone_verified?: boolean
          plan?: string | null
          telegram_chat_id?: string | null
          telegram_username?: string | null
          timezone?: string
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          goal?: string | null
          id?: string
          language?: string | null
          metadata?: Json | null
          metriport_user_id?: string | null
          neurosity?: Json | null
          oura?: Json | null
          payment_method?: Json | null
          phone?: string | null
          phone_verified?: boolean
          plan?: string | null
          telegram_chat_id?: string | null
          telegram_username?: string | null
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      states_and_tags_view: {
        Row: {
          state_created_at: string | null
          state_id: number | null
          state_measurement_date: string | null
          state_metadata: Json | null
          state_oura: Json | null
          state_probability: number | null
          state_user_id: string | null
          tag_created_at: string | null
          tag_id: number | null
          tag_text: string | null
          tag_user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "states_user_id_fkey"
            columns: ["state_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["tag_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_states: {
        Args: {
          user_id: string
          bucket_size?: number
          timezone?: string
          start_date?: string
          end_date?: string
        }
        Returns: {
          start_ts: string
          end_ts: string
          bucket_size: unknown
          avg_score: number
        }[]
      }
      get_states_and_tags: {
        Args: {
          p_user_id: string
          p_timezone: string
        }
        Returns: {
          state_id: number
          state_created_at: string
          state_probability: number
          state_metadata: Json
          state_user_id: string
          state_oura: Json
          state_measurement_date: string
          tag_id: number
          tag_created_at: string
          tag_text: string
          tag_user_id: string
        }[]
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
