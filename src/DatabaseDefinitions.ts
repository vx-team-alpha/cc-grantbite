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
      bookmarks: {
        Row: {
          created_at: string
          funding_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          funding_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          funding_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_funding_id_fkey"
            columns: ["funding_id"]
            isOneToOne: false
            referencedRelation: "funding_main"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history_messages: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      consult_requests: {
        Row: {
          created_at: string
          email: string | null
          funding_id: string | null
          id: string
          message: string | null
          name: string | null
          program_title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          funding_id?: string | null
          id?: string
          message?: string | null
          name?: string | null
          program_title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          funding_id?: string | null
          id?: string
          message?: string | null
          name?: string | null
          program_title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consult_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          company_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message_body: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deleted_users: {
        Row: {
          deleted_at: string
          deletion_reason: string | null
          email: string | null
          full_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          deleted_at?: string
          deletion_reason?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          deleted_at?: string
          deletion_reason?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      embeddings_cache: {
        Row: {
          created_date: string
          embedding: unknown
          id: number
          key: string
        }
        Insert: {
          created_date?: string
          embedding: unknown
          id?: number
          key: string
        }
        Update: {
          created_date?: string
          embedding?: unknown
          id?: number
          key?: string
        }
        Relationships: []
      }
      foerderdatenbank_daten: {
        Row: {
          content: Json
          created_at: string
          infos: Json
          title: string
          uid: string
          updated_at: string
          url: string
        }
        Insert: {
          content: Json
          created_at?: string
          infos: Json
          title: string
          uid: string
          updated_at?: string
          url: string
        }
        Update: {
          content?: Json
          created_at?: string
          infos?: Json
          title?: string
          uid?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      foerderdatenbank_processed: {
        Row: {
          featured_priority: number
          introduction_short: string
          md_content: string
          overview_allocated_budget: string
          overview_award_channel: string
          overview_beneficiary: string
          overview_company_size: string[]
          overview_countries: string[]
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_applicants_short: string[]
          overview_eligible_sectors_long: string
          overview_eligible_sectors_short: string[]
          overview_financial_instrument: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          overview_single_consortium: string
          overview_target_stages_short: string[]
          permalink: string
          program_status: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          provider_program_level: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_permalink: string
          seo_title: string
          success: boolean
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          featured_priority?: number
          introduction_short: string
          md_content: string
          overview_allocated_budget: string
          overview_award_channel: string
          overview_beneficiary: string
          overview_company_size: string[]
          overview_countries: string[]
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_applicants_short: string[]
          overview_eligible_sectors_long: string
          overview_eligible_sectors_short: string[]
          overview_financial_instrument: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          overview_single_consortium: string
          overview_target_stages_short: string[]
          permalink?: string
          program_status: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          provider_program_level: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_permalink: string
          seo_title: string
          success: boolean
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          featured_priority?: number
          introduction_short?: string
          md_content?: string
          overview_allocated_budget?: string
          overview_award_channel?: string
          overview_beneficiary?: string
          overview_company_size?: string[]
          overview_countries?: string[]
          overview_deadline?: string
          overview_eligible_applicants_long?: string
          overview_eligible_applicants_short?: string[]
          overview_eligible_sectors_long?: string
          overview_eligible_sectors_short?: string[]
          overview_financial_instrument?: string
          overview_maximum_funding_amount?: string
          overview_open_until?: string
          overview_program_acronym_id?: string
          overview_program_title_without_acronym?: string
          overview_region?: string
          overview_single_consortium?: string
          overview_target_stages_short?: string[]
          permalink?: string
          program_status?: string
          provider_additional_partners?: string
          provider_funding_body?: string
          provider_managed_by?: string
          provider_program_level?: string
          seo_keywords?: string[]
          seo_meta_description?: string
          seo_permalink?: string
          seo_title?: string
          success?: boolean
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      funding_main: {
        Row: {
          contact: Json
          featured_priority: number
          id: string
          overview_award_channel: string
          overview_company_size: string[]
          overview_countries: string[]
          overview_eligible_applicants_short: string[]
          overview_eligible_sectors_short: string[]
          overview_financial_instrument: string
          overview_single_consortium: string
          overview_target_stages_short: string[]
          program_status: string
          provider_program_level: string
          src_url: string
          success: boolean
          updated_at: string
        }
        Insert: {
          contact?: Json
          featured_priority?: number
          id: string
          overview_award_channel: string
          overview_company_size: string[]
          overview_countries: string[]
          overview_eligible_applicants_short: string[]
          overview_eligible_sectors_short: string[]
          overview_financial_instrument: string
          overview_single_consortium: string
          overview_target_stages_short: string[]
          program_status: string
          provider_program_level: string
          src_url: string
          success: boolean
          updated_at?: string
        }
        Update: {
          contact?: Json
          featured_priority?: number
          id?: string
          overview_award_channel?: string
          overview_company_size?: string[]
          overview_countries?: string[]
          overview_eligible_applicants_short?: string[]
          overview_eligible_sectors_short?: string[]
          overview_financial_instrument?: string
          overview_single_consortium?: string
          overview_target_stages_short?: string[]
          program_status?: string
          provider_program_level?: string
          src_url?: string
          success?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      funding_programs: {
        Row: {
          additional_partners: string | null
          application_procedure: string | null
          award_channels_long: string | null
          award_channels_short: string | null
          conditions: string | null
          consortium_requirements_long: string | null
          consortium_requirements_short: string | null
          contact_info: string | null
          country: string | null
          created_date: string
          de_minimis_check: string | null
          de_minimis_conditions: string | null
          eligible_applicants_long: string | null
          eligible_applicants_short: string | null
          eligible_costs: string | null
          eligible_sectors_long: string | null
          eligible_sectors_short: string | null
          eligible_sectors_short_detailed: string | null
          end_date: string | null
          excluded_costs: string | null
          financial_instrument_type_long: string | null
          financial_instrument_type_short: string | null
          funding_amount_per_project_description: string | null
          funding_amount_per_project_max: string | null
          funding_body: string | null
          funding_rate_description: string | null
          funding_rate_max: string | null
          geographic_coverage: string | null
          geographic_coverage_description: string | null
          hashtags: string | null
          id: string
          introduction_long: string | null
          introduction_short: string | null
          keywords: string | null
          last_updated: string
          legal_basis_reference: string | null
          managing_authority: string | null
          meta_description: string | null
          next_application_deadline: string | null
          objective_long: string | null
          objective_short: string | null
          other_provisions: string | null
          permalink: string | null
          program_acronym: string | null
          program_available_budget: string | null
          program_duration: string | null
          program_historical_budget: string | null
          program_id: string | null
          program_level: string | null
          program_status: string | null
          program_title: string | null
          program_total_budget: string | null
          program_website: string | null
          project_duration_long: string | null
          project_duration_short: string | null
          similar_programs: string | null
          source: string | null
          target_stage_long: string | null
          target_stage_short: string | null
          title: string | null
        }
        Insert: {
          additional_partners?: string | null
          application_procedure?: string | null
          award_channels_long?: string | null
          award_channels_short?: string | null
          conditions?: string | null
          consortium_requirements_long?: string | null
          consortium_requirements_short?: string | null
          contact_info?: string | null
          country?: string | null
          created_date?: string
          de_minimis_check?: string | null
          de_minimis_conditions?: string | null
          eligible_applicants_long?: string | null
          eligible_applicants_short?: string | null
          eligible_costs?: string | null
          eligible_sectors_long?: string | null
          eligible_sectors_short?: string | null
          eligible_sectors_short_detailed?: string | null
          end_date?: string | null
          excluded_costs?: string | null
          financial_instrument_type_long?: string | null
          financial_instrument_type_short?: string | null
          funding_amount_per_project_description?: string | null
          funding_amount_per_project_max?: string | null
          funding_body?: string | null
          funding_rate_description?: string | null
          funding_rate_max?: string | null
          geographic_coverage?: string | null
          geographic_coverage_description?: string | null
          hashtags?: string | null
          id?: string
          introduction_long?: string | null
          introduction_short?: string | null
          keywords?: string | null
          last_updated?: string
          legal_basis_reference?: string | null
          managing_authority?: string | null
          meta_description?: string | null
          next_application_deadline?: string | null
          objective_long?: string | null
          objective_short?: string | null
          other_provisions?: string | null
          permalink?: string | null
          program_acronym?: string | null
          program_available_budget?: string | null
          program_duration?: string | null
          program_historical_budget?: string | null
          program_id?: string | null
          program_level?: string | null
          program_status?: string | null
          program_title?: string | null
          program_total_budget?: string | null
          program_website?: string | null
          project_duration_long?: string | null
          project_duration_short?: string | null
          similar_programs?: string | null
          source?: string | null
          target_stage_long?: string | null
          target_stage_short?: string | null
          title?: string | null
        }
        Update: {
          additional_partners?: string | null
          application_procedure?: string | null
          award_channels_long?: string | null
          award_channels_short?: string | null
          conditions?: string | null
          consortium_requirements_long?: string | null
          consortium_requirements_short?: string | null
          contact_info?: string | null
          country?: string | null
          created_date?: string
          de_minimis_check?: string | null
          de_minimis_conditions?: string | null
          eligible_applicants_long?: string | null
          eligible_applicants_short?: string | null
          eligible_costs?: string | null
          eligible_sectors_long?: string | null
          eligible_sectors_short?: string | null
          eligible_sectors_short_detailed?: string | null
          end_date?: string | null
          excluded_costs?: string | null
          financial_instrument_type_long?: string | null
          financial_instrument_type_short?: string | null
          funding_amount_per_project_description?: string | null
          funding_amount_per_project_max?: string | null
          funding_body?: string | null
          funding_rate_description?: string | null
          funding_rate_max?: string | null
          geographic_coverage?: string | null
          geographic_coverage_description?: string | null
          hashtags?: string | null
          id?: string
          introduction_long?: string | null
          introduction_short?: string | null
          keywords?: string | null
          last_updated?: string
          legal_basis_reference?: string | null
          managing_authority?: string | null
          meta_description?: string | null
          next_application_deadline?: string | null
          objective_long?: string | null
          objective_short?: string | null
          other_provisions?: string | null
          permalink?: string | null
          program_acronym?: string | null
          program_available_budget?: string | null
          program_duration?: string | null
          program_historical_budget?: string | null
          program_id?: string | null
          program_level?: string | null
          program_status?: string | null
          program_title?: string | null
          program_total_budget?: string | null
          program_website?: string | null
          project_duration_long?: string | null
          project_duration_short?: string | null
          similar_programs?: string | null
          source?: string | null
          target_stage_long?: string | null
          target_stage_short?: string | null
          title?: string | null
        }
        Relationships: []
      }
      funding_translations: {
        Row: {
          embedding: unknown | null
          fts: unknown | null
          id: string
          introduction_short: string
          language: string
          md_content: string
          overview_allocated_budget: string
          overview_beneficiary: string
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_sectors_long: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          permalink: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_title: string
          success: boolean
          title: string
          updated_at: string
        }
        Insert: {
          embedding?: unknown | null
          fts?: unknown | null
          id: string
          introduction_short: string
          language: string
          md_content: string
          overview_allocated_budget: string
          overview_beneficiary: string
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_sectors_long: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          permalink: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_title: string
          success: boolean
          title: string
          updated_at?: string
        }
        Update: {
          embedding?: unknown | null
          fts?: unknown | null
          id?: string
          introduction_short?: string
          language?: string
          md_content?: string
          overview_allocated_budget?: string
          overview_beneficiary?: string
          overview_deadline?: string
          overview_eligible_applicants_long?: string
          overview_eligible_sectors_long?: string
          overview_maximum_funding_amount?: string
          overview_open_until?: string
          overview_program_acronym_id?: string
          overview_program_title_without_acronym?: string
          overview_region?: string
          permalink?: string
          provider_additional_partners?: string
          provider_funding_body?: string
          provider_managed_by?: string
          seo_keywords?: string[]
          seo_meta_description?: string
          seo_title?: string
          success?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_translations_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "funding_main"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter: {
        Row: {
          created_at: string
          email: string | null
          funding_guide: boolean | null
          id: string
          sub_newsletter: boolean | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          funding_guide?: boolean | null
          id?: string
          sub_newsletter?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string | null
          funding_guide?: boolean | null
          id?: string
          sub_newsletter?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          description: string
          end_date: string
          funding_purpose: string[]
          id: string
          industry: string[]
          project_name: string
          project_stage: string[]
          project_type: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          description: string
          end_date: string
          funding_purpose: string[]
          id?: string
          industry: string[]
          project_name: string
          project_stage: string[]
          project_type: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          description?: string
          end_date?: string
          funding_purpose?: string[]
          id?: string
          industry?: string[]
          project_name?: string
          project_stage?: string[]
          project_type?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_address: Json | null
          company_details: Json | null
          company_info: Json | null
          company_name: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          unsubscribed: boolean
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_address?: Json | null
          company_details?: Json | null
          company_info?: Json | null
          company_name?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          unsubscribed?: boolean
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_address?: Json | null
          company_details?: Json | null
          company_info?: Json | null
          company_name?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          unsubscribed?: boolean
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      embedding_input: {
        Args: {
          doc: Database["public"]["Tables"]["funding_translations"]["Row"]
        }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: unknown
          match_threshold: number
          match_count: number
          target_language?: string
        }
        Returns: {
          embedding: unknown | null
          fts: unknown | null
          id: string
          introduction_short: string
          language: string
          md_content: string
          overview_allocated_budget: string
          overview_beneficiary: string
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_sectors_long: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          permalink: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_title: string
          success: boolean
          title: string
          updated_at: string
        }[]
      }
      search_fts_funding: {
        Args: { query: string; target_language?: string }
        Returns: {
          embedding: unknown | null
          fts: unknown | null
          id: string
          introduction_short: string
          language: string
          md_content: string
          overview_allocated_budget: string
          overview_beneficiary: string
          overview_deadline: string
          overview_eligible_applicants_long: string
          overview_eligible_sectors_long: string
          overview_maximum_funding_amount: string
          overview_open_until: string
          overview_program_acronym_id: string
          overview_program_title_without_acronym: string
          overview_region: string
          permalink: string
          provider_additional_partners: string
          provider_funding_body: string
          provider_managed_by: string
          seo_keywords: string[]
          seo_meta_description: string
          seo_title: string
          success: boolean
          title: string
          updated_at: string
        }[]
      }
      toregconfig: {
        Args: { lang: string }
        Returns: unknown
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
    Enums: {},
  },
} as const
