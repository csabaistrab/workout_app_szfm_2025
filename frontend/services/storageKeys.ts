// frontend/services/storageKeys.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get a unique user identifier for scoping workout progress.
 * Uses authToken if available, otherwise userName, otherwise 'guest'.
 */
export async function getUserId(): Promise<string> {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) return token; // Use token as unique ID for logged-in users
    
    const userName = await AsyncStorage.getItem('userName');
    if (userName) return userName; // Use userName for guest users
    
    return 'guest'; // Fallback
  } catch {
    return 'guest';
  }
}

/**
 * Generate a user-specific storage key for workout progress
 */
export async function getUserKey(baseKey: string): Promise<string> {
  const userId = await getUserId();
  return `${userId}:${baseKey}`;
}
