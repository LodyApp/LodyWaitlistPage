import { supabase } from './supabaseClient';

export interface WaitlistEntry {
  name: string;
  email: string;
  target_languages: string[];
}

export class WaitlistService {
  // Add a new waitlist entry
  static async addEntry(entry: WaitlistEntry) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([entry])
        .select()
        .single();

      if (error) {
        console.error('Error adding waitlist entry:', error);
        throw error;
      }

      console.log('✅ Waitlist entry added successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Failed to add waitlist entry:', error);
      return { data: null, error };
    }
  }

  // Check if email already exists
  static async checkEmailExists(email: string) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking email:', error);
        throw error;
      }

      return { exists: !!data, error: null };
    } catch (error) {
      console.error('❌ Failed to check email:', error);
      return { exists: false, error };
    }
  }

  // Get all waitlist entries (for admin use)
  static async getAllEntries() {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching waitlist entries:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Failed to fetch waitlist entries:', error);
      return { data: null, error };
    }
  }

  // Get total count
  static async getCount() {
    try {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting count:', error);
        throw error;
      }

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('❌ Failed to get count:', error);
      return { count: 0, error };
    }
  }
} 