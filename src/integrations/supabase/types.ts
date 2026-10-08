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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          audience: string
          body: string | null
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_published: boolean
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          body?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          starts_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_features: {
        Row: {
          code: string
          created_at: string
          description: string | null
          group_name: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      booking_activity_log: {
        Row: {
          action: string
          booking_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          reason: string | null
          result: string
          salon_id: string | null
        }
        Insert: {
          action: string
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          reason?: string | null
          result: string
          salon_id?: string | null
        }
        Update: {
          action?: string
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          reason?: string | null
          result?: string
          salon_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_activity_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_activity_log_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_history: {
        Row: {
          booking_id: string
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount: number
          booking_date: string
          booking_type: Database["public"]["Enums"]["booking_type"]
          cancellation_reason: string | null
          cancelled_by: string | null
          checked_in_at: string | null
          completed_at: string | null
          coupon_code: string | null
          created_at: string
          customer_id: string
          discount_amount: number
          duration_min: number
          end_at: string | null
          hairstyle_id: string | null
          hold_expires_at: string | null
          id: string
          notes: string | null
          package_id: string | null
          rescheduled_at: string | null
          resource_id: string | null
          salon_id: string
          service_address: string | null
          service_id: string | null
          slot_time: string
          staff_id: string | null
          start_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          travel_fee: number
          updated_at: string
        }
        Insert: {
          amount?: number
          booking_date: string
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancellation_reason?: string | null
          cancelled_by?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_id: string
          discount_amount?: number
          duration_min?: number
          end_at?: string | null
          hairstyle_id?: string | null
          hold_expires_at?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          rescheduled_at?: string | null
          resource_id?: string | null
          salon_id: string
          service_address?: string | null
          service_id?: string | null
          slot_time: string
          staff_id?: string | null
          start_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          travel_fee?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancellation_reason?: string | null
          cancelled_by?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_id?: string
          discount_amount?: number
          duration_min?: number
          end_at?: string | null
          hairstyle_id?: string | null
          hold_expires_at?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          rescheduled_at?: string | null
          resource_id?: string | null
          salon_id?: string
          service_address?: string | null
          service_id?: string | null
          slot_time?: string
          staff_id?: string | null
          start_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          travel_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_profile_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hairstyle_id_fkey"
            columns: ["hairstyle_id"]
            isOneToOne: false
            referencedRelation: "hairstyles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "wedding_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "salon_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string
          message_id: string
          name: string
          phone: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          message_id?: string
          name: string
          phone: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          message_id?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          booking_id: string | null
          coupon_id: string
          created_at: string
          discount_amount: number
          id: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          coupon_id: string
          created_at?: string
          discount_amount?: number
          id?: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          coupon_id?: string
          created_at?: string
          discount_amount?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          banner_url: string | null
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          max_discount: number | null
          min_amount: number
          package_ids: string[]
          salon_id: string | null
          service_ids: string[]
          starts_at: string
          title: string | null
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          banner_url?: string | null
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          max_discount?: number | null
          min_amount?: number
          package_ids?: string[]
          salon_id?: string | null
          service_ids?: string[]
          starts_at?: string
          title?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          banner_url?: string | null
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          max_discount?: number | null
          min_amount?: number
          package_ids?: string[]
          salon_id?: string | null
          service_ids?: string[]
          starts_at?: string
          title?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_restrictions: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          reason: string
          starts_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          reason: string
          starts_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          reason?: string
          starts_at?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          address: string | null
          admin_notes: string | null
          branches: number
          city: string
          created_at: string
          created_salon_id: string | null
          district: string | null
          email: string
          id: string
          message: string | null
          owner_name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          salon_name: string
          state: string | null
          status: Database["public"]["Enums"]["demo_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          branches?: number
          city: string
          created_at?: string
          created_salon_id?: string | null
          district?: string | null
          email: string
          id?: string
          message?: string | null
          owner_name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          salon_name: string
          state?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          branches?: number
          city?: string
          created_at?: string
          created_salon_id?: string | null
          district?: string | null
          email?: string
          id?: string
          message?: string | null
          owner_name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          salon_name?: string
          state?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_requests_created_salon_id_fkey"
            columns: ["created_salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          catalog_id: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          salon_id: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          catalog_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          salon_id: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          catalog_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          salon_id?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "hairstyle_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      hairstyle_catalog: {
        Row: {
          category: string
          category_id: string | null
          created_at: string
          description: string | null
          gender: string
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          gender?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          gender?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hairstyle_catalog_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "hairstyle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hairstyle_categories: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hairstyle_signals: {
        Row: {
          catalog_id: string
          city: string | null
          created_at: string
          id: string
          kind: string
          user_id: string | null
        }
        Insert: {
          catalog_id: string
          city?: string | null
          created_at?: string
          id?: string
          kind: string
          user_id?: string | null
        }
        Update: {
          catalog_id?: string
          city?: string | null
          created_at?: string
          id?: string
          kind?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hairstyle_signals_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "hairstyle_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      hairstyles: {
        Row: {
          catalog_id: string | null
          category: string
          created_at: string
          description: string | null
          duration_min: number
          gender: string
          id: string
          image_url: string | null
          is_active: boolean
          is_bookable: boolean
          name: string
          price: number
          salon_id: string
          updated_at: string
        }
        Insert: {
          catalog_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_min?: number
          gender?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_bookable?: boolean
          name: string
          price?: number
          salon_id: string
          updated_at?: string
        }
        Update: {
          catalog_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_min?: number
          gender?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_bookable?: boolean
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hairstyles_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "hairstyle_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hairstyles_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          level: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          level: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          level?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      login_events: {
        Row: {
          created_at: string
          id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loyalty_accounts: {
        Row: {
          balance: number
          created_at: string
          customer_id: string
          id: string
          salon_id: string
          total_earned: number
          total_redeemed: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          customer_id: string
          id?: string
          salon_id: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          customer_id?: string
          id?: string
          salon_id?: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_accounts_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          kind: string
          note: string | null
          points: number
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          note?: string | null
          points: number
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          note?: string | null
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          max_redeem_percent: number
          min_redeem_points: number
          point_value_rupees: number
          points_per_hundred: number
          salon_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_redeem_percent?: number
          min_redeem_points?: number
          point_value_rupees?: number
          points_per_hundred?: number
          salon_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_redeem_percent?: number
          min_redeem_points?: number
          point_value_rupees?: number
          points_per_hundred?: number
          salon_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rules_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          booking_id: string | null
          created_at: string
          customer_id: string
          id: string
          kind: string
          payment_id: string | null
          points: number
          reason: string | null
          salon_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          kind: string
          payment_id?: string | null
          points: number
          reason?: string | null
          salon_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          kind?: string
          payment_id?: string | null
          points?: number
          reason?: string | null
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          amount: number | null
          created_at: string
          event_id: string
          id: string
          order_ref: string | null
          payload: Json
          payment_ref: string | null
          processed_at: string | null
          provider: string
          salon_id: string | null
          status: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          event_id: string
          id?: string
          order_ref?: string | null
          payload?: Json
          payment_ref?: string | null
          processed_at?: string | null
          provider: string
          salon_id?: string | null
          status?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          event_id?: string
          id?: string
          order_ref?: string | null
          payload?: Json
          payment_ref?: string | null
          processed_at?: string | null
          provider?: string
          salon_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_settings: {
        Row: {
          connection_message: string | null
          connection_status: string
          created_at: string
          display_name: string
          environment: string
          id: string
          is_active_gateway: boolean
          is_enabled: boolean
          last_verified_at: string | null
          provider: string
          public_key: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          connection_message?: string | null
          connection_status?: string
          created_at?: string
          display_name: string
          environment?: string
          id?: string
          is_active_gateway?: boolean
          is_enabled?: boolean
          last_verified_at?: string | null
          provider: string
          public_key?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          connection_message?: string | null
          connection_status?: string
          created_at?: string
          display_name?: string
          environment?: string
          id?: string
          is_active_gateway?: boolean
          is_enabled?: boolean
          last_verified_at?: string | null
          provider?: string
          public_key?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          commission_amount: number
          commission_rate: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          customer_id: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          note: string | null
          paid_at: string | null
          provider_ref: string | null
          salon_earning: number
          salon_id: string
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount?: number
          booking_id: string
          commission_amount?: number
          commission_rate?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_id: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          paid_at?: string | null
          provider_ref?: string | null
          salon_earning?: number
          salon_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          commission_amount?: number
          commission_rate?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          paid_at?: string | null
          provider_ref?: string | null
          salon_earning?: number
          salon_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_profiles_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          commission_amount: number
          created_at: string
          id: string
          note: string | null
          processed_at: string | null
          salon_id: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          amount?: number
          commission_amount?: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          salon_id: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_amount?: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          salon_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          language: string
          last_login: string | null
          phone: string | null
          referral_code: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          language?: string
          last_login?: string | null
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          language?: string
          last_login?: string | null
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          qualified: boolean
          referred_id: string
          referrer_id: string
          rewarded: boolean
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          qualified?: boolean
          referred_id: string
          referrer_id: string
          rewarded?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          qualified?: boolean
          referred_id?: string
          referrer_id?: string
          rewarded?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          is_hidden: boolean
          is_reported: boolean
          owner_replied_at: string | null
          owner_reply: string | null
          photo_url: string | null
          rating: number
          salon_id: string
          service_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_hidden?: boolean
          is_reported?: boolean
          owner_replied_at?: string | null
          owner_reply?: string | null
          photo_url?: string | null
          rating: number
          salon_id: string
          service_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_hidden?: boolean
          is_reported?: boolean
          owner_replied_at?: string | null
          owner_reply?: string | null
          photo_url?: string | null
          rating?: number
          salon_id?: string
          service_id?: string | null
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
            foreignKeyName: "reviews_customer_profile_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_blocks: {
        Row: {
          block_date: string
          created_at: string
          end_time: string | null
          full_day: boolean
          id: string
          reason: string | null
          salon_id: string
          slot_time: string | null
          start_time: string | null
        }
        Insert: {
          block_date: string
          created_at?: string
          end_time?: string | null
          full_day?: boolean
          id?: string
          reason?: string | null
          salon_id: string
          slot_time?: string | null
          start_time?: string | null
        }
        Update: {
          block_date?: string
          created_at?: string
          end_time?: string | null
          full_day?: boolean
          id?: string
          reason?: string | null
          salon_id?: string
          slot_time?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_blocks_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          salon_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          salon_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_categories_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_closures: {
        Row: {
          closed_date: string
          created_at: string
          id: string
          reason: string | null
          salon_id: string
        }
        Insert: {
          closed_date: string
          created_at?: string
          id?: string
          reason?: string | null
          salon_id: string
        }
        Update: {
          closed_date?: string
          created_at?: string
          id?: string
          reason?: string | null
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_closures_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string
          created_at: string
          id: string
          is_closed: boolean
          open_time: string
          salon_id: string
          updated_at: string
          weekday: number
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          created_at?: string
          id?: string
          is_closed?: boolean
          open_time?: string
          salon_id: string
          updated_at?: string
          weekday: number
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          created_at?: string
          id?: string
          is_closed?: boolean
          open_time?: string
          salon_id?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "salon_hours_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_resources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          salon_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          salon_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          salon_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_resources_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_subscriptions: {
        Row: {
          auto_renew: boolean
          cancelled_at: string | null
          created_at: string
          expires_at: string
          id: string
          owner_id: string | null
          plan_id: string
          salon_id: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          suspended_at: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          owner_id?: string | null
          plan_id: string
          salon_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          suspended_at?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          owner_id?: string | null
          plan_id?: string
          salon_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          suspended_at?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_subscriptions_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          about: string | null
          address: string | null
          approved_at: string | null
          approved_by: string | null
          area: string | null
          booking_interval_min: number
          buffer_min: number
          city: string
          closing_time: string | null
          commission_rate: number | null
          cover_image_url: string | null
          created_at: string
          district: string | null
          email: string | null
          facebook_url: string | null
          home_service_area: string | null
          home_service_enabled: boolean
          home_service_fee: number
          home_service_hours: string | null
          id: string
          image_url: string | null
          instagram_url: string | null
          is_active: boolean
          is_featured: boolean
          is_verified: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          opening_time: string | null
          owner_id: string | null
          phone: string | null
          pin_code: string | null
          rating: number
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          review_count: number
          salon_images: string[]
          salon_type: string | null
          seats: number | null
          services_offered: string | null
          slug: string | null
          starting_price: number
          state: string | null
          status: Database["public"]["Enums"]["salon_status"]
          timezone: string
          updated_at: string
          verified_at: string | null
          website_url: string | null
          weekly_closed_day: number | null
          whatsapp_number: string | null
          years_in_business: number | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          booking_interval_min?: number
          buffer_min?: number
          city: string
          closing_time?: string | null
          commission_rate?: number | null
          cover_image_url?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          facebook_url?: string | null
          home_service_area?: string | null
          home_service_enabled?: boolean
          home_service_fee?: number
          home_service_hours?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          opening_time?: string | null
          owner_id?: string | null
          phone?: string | null
          pin_code?: string | null
          rating?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          review_count?: number
          salon_images?: string[]
          salon_type?: string | null
          seats?: number | null
          services_offered?: string | null
          slug?: string | null
          starting_price?: number
          state?: string | null
          status?: Database["public"]["Enums"]["salon_status"]
          timezone?: string
          updated_at?: string
          verified_at?: string | null
          website_url?: string | null
          weekly_closed_day?: number | null
          whatsapp_number?: string | null
          years_in_business?: number | null
        }
        Update: {
          about?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          booking_interval_min?: number
          buffer_min?: number
          city?: string
          closing_time?: string | null
          commission_rate?: number | null
          cover_image_url?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          facebook_url?: string | null
          home_service_area?: string | null
          home_service_enabled?: boolean
          home_service_fee?: number
          home_service_hours?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          opening_time?: string | null
          owner_id?: string | null
          phone?: string | null
          pin_code?: string | null
          rating?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          review_count?: number
          salon_images?: string[]
          salon_type?: string | null
          seats?: number | null
          services_offered?: string | null
          slug?: string | null
          starting_price?: number
          state?: string | null
          status?: Database["public"]["Enums"]["salon_status"]
          timezone?: string
          updated_at?: string
          verified_at?: string | null
          website_url?: string | null
          weekly_closed_day?: number | null
          whatsapp_number?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salons_owner_id_profiles_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          category_id: string | null
          created_at: string
          description: string | null
          duration_min: number
          id: string
          image_url: string | null
          is_active: boolean
          is_bookable: boolean
          name: string
          price: number
          salon_id: string
          updated_at: string
        }
        Insert: {
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_bookable?: boolean
          name: string
          price?: number
          salon_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_bookable?: boolean
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          break_end: string | null
          break_start: string | null
          created_at: string
          end_time: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          salon_id: string
          service_ids: string[]
          start_time: string
          updated_at: string
          working_days: number[]
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          end_time?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          salon_id: string
          service_ids?: string[]
          start_time?: string
          updated_at?: string
          working_days?: number[]
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          end_time?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          salon_id?: string
          service_ids?: string[]
          start_time?: string
          updated_at?: string
          working_days?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "staff_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          environment: string
          failure_reason: string | null
          id: string
          invoice_no: string | null
          order_ref: string | null
          owner_id: string | null
          paid_at: string | null
          payment_ref: string | null
          plan_id: string | null
          provider: string
          salon_id: string
          status: string
          subscription_id: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          environment?: string
          failure_reason?: string | null
          id?: string
          invoice_no?: string | null
          order_ref?: string | null
          owner_id?: string | null
          paid_at?: string | null
          payment_ref?: string | null
          plan_id?: string | null
          provider: string
          salon_id: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          environment?: string
          failure_reason?: string | null
          id?: string
          invoice_no?: string | null
          order_ref?: string | null
          owner_id?: string | null
          paid_at?: string | null
          payment_ref?: string | null
          plan_id?: string | null
          provider?: string
          salon_id?: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payments_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "salon_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plan_features: {
        Row: {
          created_at: string
          feature_id: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          plan_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plan_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "app_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_cycle: string
          billing_days: number | null
          booking_limit: number | null
          code: string
          created_at: string
          currency: string
          description: string | null
          features: string[]
          id: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
          trial_days: number
          trial_enabled: boolean
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          billing_days?: number | null
          booking_limit?: number | null
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
          trial_days?: number
          trial_enabled?: boolean
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          billing_days?: number | null
          booking_limit?: number | null
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
          trial_days?: number
          trial_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      subscription_status_history: {
        Row: {
          action: string | null
          changed_by: string | null
          created_at: string
          end_at: string | null
          id: string
          note: string | null
          plan_id: string | null
          previous_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          salon_id: string
          start_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
        }
        Insert: {
          action?: string | null
          changed_by?: string | null
          created_at?: string
          end_at?: string | null
          id?: string
          note?: string | null
          plan_id?: string | null
          previous_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          salon_id: string
          start_at?: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
        }
        Update: {
          action?: string | null
          changed_by?: string | null
          created_at?: string
          end_at?: string | null
          id?: string
          note?: string | null
          plan_id?: string | null
          previous_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          salon_id?: string
          start_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_status_history_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_status_history_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_status_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "salon_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          id: string
          message: string
          payment_id: string | null
          priority: string
          raised_as: string
          salon_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          message: string
          payment_id?: string | null
          priority?: string
          raised_as?: string
          salon_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          payment_id?: string | null
          priority?: string
          raised_as?: string
          salon_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_internal: boolean
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_author_id_profiles_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wedding_packages: {
        Row: {
          created_at: string
          description: string | null
          duration_min: number
          id: string
          image_url: string | null
          included_services: string[]
          is_active: boolean
          is_bookable: boolean
          name: string
          price: number
          salon_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          image_url?: string | null
          included_services?: string[]
          is_active?: boolean
          is_bookable?: boolean
          name: string
          price?: number
          salon_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          image_url?: string | null
          included_services?: string[]
          is_active?: boolean
          is_bookable?: boolean
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_packages_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      active_restriction: {
        Args: { _user_id: string }
        Returns: {
          created_at: string
          ends_at: string
          id: string
          reason: string
          starts_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "customer_restrictions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_manage_subscription: {
        Args: {
          _action: string
          _days?: number
          _note?: string
          _salon_id: string
        }
        Returns: boolean
      }
      admin_remove_super_admin: { Args: { _user_id: string }; Returns: boolean }
      admin_renew_subscription: {
        Args: {
          _end: string
          _note?: string
          _plan_id?: string
          _salon_id: string
          _start: string
        }
        Returns: boolean
      }
      admin_set_salon_status: {
        Args: {
          _reason?: string
          _salon_id: string
          _status: Database["public"]["Enums"]["salon_status"]
        }
        Returns: boolean
      }
      admin_set_user_role: {
        Args: {
          _enabled: boolean
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      booking_settings: { Args: never; Returns: Json }
      claim_super_admin: { Args: never; Returns: boolean }
      create_booking: {
        Args: {
          _booking_date: string
          _hairstyle_id?: string
          _notes?: string
          _package_id?: string
          _salon_id: string
          _service_id?: string
          _slot_time: string
          _staff_id?: string
        }
        Returns: string
      }
      expire_stale_bookings: { Args: never; Returns: number }
      expired_salons_visible: { Args: never; Returns: boolean }
      hairstyle_trending: {
        Args: { _city?: string; _days?: number }
        Returns: {
          bookings: number
          catalog_id: string
          saves: number
          score: number
          searches: number
          views: number
        }[]
      }
      has_active_subscription: { Args: { _salon_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_my_salon_customer: { Args: { _profile_id: string }; Returns: boolean }
      loyalty_rule_for: {
        Args: { _salon_id: string }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          max_redeem_percent: number
          min_redeem_points: number
          point_value_rupees: number
          points_per_hundred: number
          salon_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "loyalty_rules"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      owner_loyalty_rule: {
        Args: { _salon_id: string }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          max_redeem_percent: number
          min_redeem_points: number
          point_value_rupees: number
          points_per_hundred: number
          salon_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "loyalty_rules"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      owner_mark_booking_paid: {
        Args: {
          _booking_id: string
          _method?: Database["public"]["Enums"]["payment_method"]
          _note?: string
        }
        Returns: string
      }
      owner_reschedule_booking: {
        Args: { _booking_date: string; _booking_id: string; _slot_time: string }
        Returns: undefined
      }
      owner_resubmit_salon: { Args: { _salon_id: string }; Returns: boolean }
      owner_save_loyalty_rule: {
        Args: {
          _is_active: boolean
          _max_redeem_percent: number
          _min_redeem_points: number
          _point_value_rupees: number
          _points_per_hundred: number
          _salon_id: string
        }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          max_redeem_percent: number
          min_redeem_points: number
          point_value_rupees: number
          points_per_hundred: number
          salon_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "loyalty_rules"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      owner_set_booking_status: {
        Args: {
          _booking_id: string
          _note?: string
          _status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: undefined
      }
      owns_salon: { Args: { _salon_id: string }; Returns: boolean }
      redeem_loyalty_points: {
        Args: { _booking_id?: string; _points: number; _salon_id: string }
        Returns: number
      }
      register_salon: {
        Args: {
          _about?: string
          _address?: string
          _area?: string
          _city: string
          _name: string
          _phone?: string
          _pin_code?: string
        }
        Returns: string
      }
      salon_available_slots: {
        Args: {
          _date: string
          _duration_min?: number
          _salon_id: string
          _step?: number
        }
        Returns: {
          slot: string
        }[]
      }
      salon_customer_profiles: {
        Args: never
        Returns: {
          full_name: string
          id: string
          phone: string
        }[]
      }
      salon_has_feature: {
        Args: { _code: string; _salon_id: string }
        Returns: boolean
      }
      salon_open_now: { Args: { _salon_id: string }; Returns: boolean }
      salon_subscription_states_for: {
        Args: { _salon_ids: string[] }
        Returns: {
          expires_at: string
          salon_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_end_date: string
        }[]
      }
      salons_nearby: {
        Args: { _lat: number; _limit?: number; _lng: number }
        Returns: {
          distance_km: number
          salon_id: string
        }[]
      }
      start_salon_trial: { Args: { _salon_id: string }; Returns: undefined }
      subscription_state: { Args: { _salon_id: string }; Returns: string }
      super_admin_count: { Args: never; Returns: number }
      trending_hairstyles: {
        Args: { _city?: string; _days?: number; _limit?: number }
        Returns: {
          catalog_id: string
          score: number
          signal_count: number
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "salon_owner" | "super_admin"
      booking_status:
        | "upcoming"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
        | "pending"
        | "checked_in"
        | "waiting"
        | "service_started"
        | "expired"
      booking_type: "salon" | "home"
      demo_status:
        | "pending"
        | "contacted"
        | "approved"
        | "rejected"
        | "completed"
      payment_method:
        | "upi"
        | "card"
        | "netbanking"
        | "wallet"
        | "pay_at_salon"
        | "cash"
        | "other"
      payment_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "refunded"
        | "cancelled"
      payout_status:
        | "pending"
        | "approved"
        | "processing"
        | "completed"
        | "rejected"
      salon_status: "pending" | "approved" | "rejected" | "suspended"
      staff_role:
        | "manager"
        | "stylist"
        | "beautician"
        | "receptionist"
        | "other"
      subscription_status:
        | "trialing"
        | "active"
        | "expired"
        | "cancelled"
        | "suspended"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_user"
        | "resolved"
        | "closed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["customer", "salon_owner", "super_admin"],
      booking_status: [
        "upcoming",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
        "pending",
        "checked_in",
        "waiting",
        "service_started",
        "expired",
      ],
      booking_type: ["salon", "home"],
      demo_status: [
        "pending",
        "contacted",
        "approved",
        "rejected",
        "completed",
      ],
      payment_method: [
        "upi",
        "card",
        "netbanking",
        "wallet",
        "pay_at_salon",
        "cash",
        "other",
      ],
      payment_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ],
      payout_status: [
        "pending",
        "approved",
        "processing",
        "completed",
        "rejected",
      ],
      salon_status: ["pending", "approved", "rejected", "suspended"],
      staff_role: ["manager", "stylist", "beautician", "receptionist", "other"],
      subscription_status: [
        "trialing",
        "active",
        "expired",
        "cancelled",
        "suspended",
      ],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_user",
        "resolved",
        "closed",
      ],
    },
  },
} as const
