// frontend/services/storageKeys.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get a unique user identifier for scoping workout progress.
 * Uses userName (persistent) instead of authToken (changes on each login).
 */
export async function getUserId(): Promise<string> {
  try {
    const userName = await AsyncStorage.getItem('userName');
    if (userName) return userName; // Use userName as stable identifier
    
    const token = await AsyncStorage.getItem('authToken');
    if (token) return token; // Fallback to token
    
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
