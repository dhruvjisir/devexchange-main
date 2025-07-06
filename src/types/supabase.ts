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
      payment_orders: {
        Row: {
          id: string
          user_id: string
          project_id: string
          amount: number
          currency: string
          status: string
          payment_id: string | null
          order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          amount: number
          currency?: string
          status?: string
          payment_id?: string | null
          order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_id?: string | null
          order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string
          payment_id: string
          signature: string
          amount: number
          currency: string
          status: string
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_id: string
          signature: string
          amount: number
          currency?: string
          status?: string
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_id?: string
          signature?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          price: number
          category: string
          image: string | null
          is_new: boolean
          is_verified: boolean
          maker_id: string
          tags: string[]
          yearly_revenue: number | null
          ttm_revenue: number | null
          ttm_profit: number | null
          last_month_revenue: number | null
          last_month_profit: number | null
          customer_count: number | null
          arr: number | null
          growth_rate: number | null
          churn_rate: number | null
          date_founded: string | null
          team_size: number | null
          business_models: string[] | null
          tech_stack: string[] | null
          competitors: string[] | null
          growth_opportunities: string[] | null
          key_assets: string[] | null
          selling_reason: string | null
          financing: string | null
          views?: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          price: number
          category: string
          image?: string | null
          is_new?: boolean
          is_verified?: boolean
          maker_id: string
          tags?: string[]
          yearly_revenue?: number | null
          ttm_revenue?: number | null
          ttm_profit?: number | null
          last_month_revenue?: number | null
          last_month_profit?: number | null
          customer_count?: number | null
          arr?: number | null
          growth_rate?: number | null
          churn_rate?: number | null
          date_founded?: string | null
          team_size?: number | null
          business_models?: string[] | null
          tech_stack?: string[] | null
          competitors?: string[] | null
          growth_opportunities?: string[] | null
          key_assets?: string[] | null
          selling_reason?: string | null
          financing?: string | null
          views?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          price?: number
          category?: string
          image?: string | null
          is_new?: boolean
          is_verified?: boolean
          maker_id?: string
          tags?: string[]
          yearly_revenue?: number | null
          ttm_revenue?: number | null
          ttm_profit?: number | null
          last_month_revenue?: number | null
          last_month_profit?: number | null
          customer_count?: number | null
          arr?: number | null
          growth_rate?: number | null
          churn_rate?: number | null
          date_founded?: string | null
          team_size?: number | null
          business_models?: string[] | null
          tech_stack?: string[] | null
          competitors?: string[] | null
          growth_opportunities?: string[] | null
          key_assets?: string[] | null
          selling_reason?: string | null
          financing?: string | null
          views?: number
        }
      }
      // ... other tables
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 