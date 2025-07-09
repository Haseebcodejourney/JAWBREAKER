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
      affiliate_programs: {
        Row: {
          clinic_id: string | null
          commission_type: string
          commission_value: number
          created_at: string | null
          id: string
          is_active: boolean | null
          minimum_payout: number | null
          payment_terms: string | null
          program_name: string
        }
        Insert: {
          clinic_id?: string | null
          commission_type: string
          commission_value: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_payout?: number | null
          payment_terms?: string | null
          program_name: string
        }
        Update: {
          clinic_id?: string | null
          commission_type?: string
          commission_value?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_payout?: number | null
          payment_terms?: string | null
          program_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_tracking: {
        Row: {
          affiliate_id: string | null
          booking_id: string | null
          commission_earned: number | null
          earned_at: string | null
          id: string
          paid_at: string | null
          program_id: string | null
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          booking_id?: string | null
          commission_earned?: number | null
          earned_at?: string | null
          id?: string
          paid_at?: string | null
          program_id?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          booking_id?: string | null
          commission_earned?: number | null
          earned_at?: string | null
          id?: string
          paid_at?: string | null
          program_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_tracking_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_tracking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_tracking_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_articles: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          language: string | null
          likes_count: number | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          currency: string | null
          exchange_rate: number | null
          id: string
          notes: string | null
          original_currency: string | null
          patient_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          preferred_date: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number | null
          travel_package_id: string | null
          treatment_id: string | null
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          currency?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          original_currency?: string | null
          patient_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          travel_package_id?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          currency?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          original_currency?: string | null
          patient_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          travel_package_id?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_facilities: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          description: string | null
          facility_type: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_type: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_type?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_facilities_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          accreditations: string[] | null
          address: string | null
          city: string
          coordinates: unknown | null
          country: string
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          established_year: number | null
          featured: boolean | null
          hotel_partnerships: boolean | null
          id: string
          insurance_accepted: string[] | null
          languages: string[] | null
          logo_url: string | null
          name: string
          owner_id: string | null
          phone: string | null
          rating: number | null
          response_time_hours: number | null
          review_count: number | null
          specialties: string[] | null
          staff_count: number | null
          status: Database["public"]["Enums"]["clinic_status"] | null
          total_patients: number | null
          transfer_services: boolean | null
          updated_at: string | null
          verified: boolean | null
          video_tour_url: string | null
          virtual_tour_url: string | null
          website: string | null
          working_hours: Json | null
        }
        Insert: {
          accreditations?: string[] | null
          address?: string | null
          city: string
          coordinates?: unknown | null
          country: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established_year?: number | null
          featured?: boolean | null
          hotel_partnerships?: boolean | null
          id?: string
          insurance_accepted?: string[] | null
          languages?: string[] | null
          logo_url?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          specialties?: string[] | null
          staff_count?: number | null
          status?: Database["public"]["Enums"]["clinic_status"] | null
          total_patients?: number | null
          transfer_services?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
          video_tour_url?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          working_hours?: Json | null
        }
        Update: {
          accreditations?: string[] | null
          address?: string | null
          city?: string
          coordinates?: unknown | null
          country?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established_year?: number | null
          featured?: boolean | null
          hotel_partnerships?: boolean | null
          id?: string
          insurance_accepted?: string[] | null
          languages?: string[] | null
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          specialties?: string[] | null
          staff_count?: number | null
          status?: Database["public"]["Enums"]["clinic_status"] | null
          total_patients?: number | null
          transfer_services?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
          video_tour_url?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clinics_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_article_tags: {
        Row: {
          article_id: string | null
          created_at: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "cms_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "cms_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_articles: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          language: string | null
          likes_count: number | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string
          filename: string
          folder_path: string | null
          id: string
          mime_type: string | null
          original_filename: string
          uploaded_by: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          filename: string
          folder_path?: string | null
          id?: string
          mime_type?: string | null
          original_filename: string
          uploaded_by: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          filename?: string
          folder_path?: string | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_media_library_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          assigned_to: string | null
          booking_id: string | null
          clinic_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          patient_id: string | null
          priority: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          booking_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          patient_id?: string | null
          priority?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          booking_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          patient_id?: string | null
          priority?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          available_online: boolean | null
          bio: string | null
          certifications: string[] | null
          clinic_id: string | null
          consultation_fee: number | null
          created_at: string | null
          education: string[] | null
          first_name: string
          id: string
          languages: string[] | null
          last_name: string
          profile_image_url: string | null
          social_links: Json | null
          specialization: string
          title: string | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          available_online?: boolean | null
          bio?: string | null
          certifications?: string[] | null
          clinic_id?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          education?: string[] | null
          first_name: string
          id?: string
          languages?: string[] | null
          last_name: string
          profile_image_url?: string | null
          social_links?: Json | null
          specialization: string
          title?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          available_online?: boolean | null
          bio?: string | null
          certifications?: string[] | null
          clinic_id?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          education?: string[] | null
          first_name?: string
          id?: string
          languages?: string[] | null
          last_name?: string
          profile_image_url?: string | null
          social_links?: Json | null
          specialization?: string
          title?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          owner_id: string | null
          verified: boolean | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          owner_id?: string | null
          verified?: boolean | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          owner_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_partners: {
        Row: {
          clinic_id: string | null
          contact_info: Json | null
          coverage_details: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          partner_name: string
          partner_type: string
          website_url: string | null
        }
        Insert: {
          clinic_id?: string | null
          contact_info?: Json | null
          coverage_details?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          partner_name: string
          partner_type: string
          website_url?: string | null
        }
        Update: {
          clinic_id?: string | null
          contact_info?: Json | null
          coverage_details?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          partner_name?: string
          partner_type?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_partners_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_forms: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          form_fields: Json
          form_name: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          treatment_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          form_fields: Json
          form_name: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          treatment_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          form_fields?: Json
          form_name?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_forms_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_forms_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          menu_type: string
          parent_id: string | null
          sort_order: number
          target: string
          translation_key: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          menu_type?: string
          parent_id?: string | null
          sort_order?: number
          target?: string
          translation_key?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          menu_type?: string
          parent_id?: string | null
          sort_order?: number
          target?: string
          translation_key?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          message_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string | null
          sender_type: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      patient_form_submissions: {
        Row: {
          booking_id: string | null
          form_data: Json
          form_id: string | null
          id: string
          patient_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          booking_id?: string | null
          form_data: Json
          form_id?: string | null
          id?: string
          patient_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          booking_id?: string | null
          form_data?: Json
          form_id?: string | null
          id?: string
          patient_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_form_submissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "medical_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_form_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_form_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string
          id: string
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      price_campaigns: {
        Row: {
          campaign_name: string
          clinic_id: string | null
          conditions: Json | null
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          start_date: string
          treatment_id: string | null
          used_count: number | null
        }
        Insert: {
          campaign_name: string
          clinic_id?: string | null
          conditions?: Json | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date: string
          treatment_id?: string | null
          used_count?: number | null
        }
        Update: {
          campaign_name?: string
          clinic_id?: string | null
          conditions?: Json | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date?: string
          treatment_id?: string | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_campaigns_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_campaigns_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          data_retention_period: number | null
          email: string
          first_name: string | null
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          language: string | null
          last_name: string | null
          marketing_consent: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          data_retention_period?: number | null
          email: string
          first_name?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          data_retention_period?: number | null
          email?: string
          first_name?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string | null
          user_id: string | null
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          clinic_id: string | null
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          images: string[] | null
          moderated: boolean | null
          patient_id: string | null
          rating: number | null
          response_date: string | null
          response_from_clinic: string | null
          title: string | null
          verified: boolean | null
        }
        Insert: {
          booking_id?: string | null
          clinic_id?: string | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          moderated?: boolean | null
          patient_id?: string | null
          rating?: number | null
          response_date?: string | null
          response_from_clinic?: string | null
          title?: string | null
          verified?: boolean | null
        }
        Update: {
          booking_id?: string | null
          clinic_id?: string | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          moderated?: boolean | null
          patient_id?: string | null
          rating?: number | null
          response_date?: string | null
          response_from_clinic?: string | null
          title?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_meta: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_type: string | null
          page_id: string | null
          page_type: string
          robots_meta: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id?: string | null
          page_type: string
          robots_meta?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id?: string | null
          page_type?: string
          robots_meta?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_slug: string
          robots_meta: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug: string
          robots_meta?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug?: string
          robots_meta?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      static_pages: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_system_page: boolean | null
          language: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          slug: string
          status: string | null
          template: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_system_page?: boolean | null
          language?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug: string
          status?: string | null
          template?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_system_page?: boolean | null
          language?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string
          status?: string | null
          template?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "static_pages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_services: {
        Row: {
          booking_url: string | null
          clinic_id: string | null
          contact_info: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          price_from: number | null
          price_to: number | null
          provider_name: string
          service_name: string
          service_type: string
        }
        Insert: {
          booking_url?: string | null
          clinic_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_from?: number | null
          price_to?: number | null
          provider_name: string
          service_name: string
          service_type: string
        }
        Update: {
          booking_url?: string | null
          clinic_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_from?: number | null
          price_to?: number | null
          provider_name?: string
          service_name?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_services_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_packages: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          duration_days: number | null
          excludes: string[] | null
          id: string
          includes: string[] | null
          is_active: boolean | null
          max_participants: number | null
          name: string
          package_type: string
          price: number
          treatment_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          excludes?: string[] | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          package_type: string
          price: number
          treatment_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          excludes?: string[] | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          package_type?: string
          price?: number
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_packages_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          active: boolean | null
          assigned_doctor_id: string | null
          before_after_gallery: string[] | null
          category: Database["public"]["Enums"]["treatment_category"]
          clinic_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_days: number | null
          features: string[] | null
          id: string
          images: string[] | null
          included_services: string[] | null
          name: string
          prerequisites: string[] | null
          price_from: number | null
          price_to: number | null
          procedure_steps: string[] | null
          recovery_days: number | null
          recovery_instructions: string | null
          success_rate: number | null
        }
        Insert: {
          active?: boolean | null
          assigned_doctor_id?: string | null
          before_after_gallery?: string[] | null
          category: Database["public"]["Enums"]["treatment_category"]
          clinic_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          included_services?: string[] | null
          name: string
          prerequisites?: string[] | null
          price_from?: number | null
          price_to?: number | null
          procedure_steps?: string[] | null
          recovery_days?: number | null
          recovery_instructions?: string | null
          success_rate?: number | null
        }
        Update: {
          active?: boolean | null
          assigned_doctor_id?: string | null
          before_after_gallery?: string[] | null
          category?: Database["public"]["Enums"]["treatment_category"]
          clinic_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          included_services?: string[] | null
          name?: string
          prerequisites?: string[] | null
          price_from?: number | null
          price_to?: number | null
          procedure_steps?: string[] | null
          recovery_days?: number | null
          recovery_instructions?: string | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_indicators: {
        Row: {
          conversation_id: string | null
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_indicators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          treatment_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          treatment_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          treatment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          message_notifications: Json | null
          notification_settings: Json | null
          preferred_currency: string | null
          preferred_language: string | null
          search_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_notifications?: Json | null
          notification_settings?: Json | null
          preferred_currency?: string | null
          preferred_language?: string | null
          search_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_notifications?: Json | null
          notification_settings?: Json | null
          preferred_currency?: string | null
          preferred_language?: string | null
          search_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_user_activity: {
        Args: {
          activity_type: string
          entity_type?: string
          entity_id?: string
          metadata?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "disputed"
      clinic_status: "pending" | "approved" | "rejected" | "suspended"
      payment_status: "pending" | "held" | "released" | "refunded"
      treatment_category:
        | "hair_transplant"
        | "dental"
        | "cosmetic_surgery"
        | "bariatric_surgery"
        | "orthopedic"
        | "cardiology"
        | "oncology"
        | "fertility"
        | "eye_surgery"
        | "other"
      user_role: "patient" | "clinic" | "admin"
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
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "disputed",
      ],
      clinic_status: ["pending", "approved", "rejected", "suspended"],
      payment_status: ["pending", "held", "released", "refunded"],
      treatment_category: [
        "hair_transplant",
        "dental",
        "cosmetic_surgery",
        "bariatric_surgery",
        "orthopedic",
        "cardiology",
        "oncology",
        "fertility",
        "eye_surgery",
        "other",
      ],
      user_role: ["patient", "clinic", "admin"],
    },
  },
} as const
