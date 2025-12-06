// app/types.ts
export interface Day {
  id: number;
  title: string;
  done: boolean;
}

export interface Week {
  id: number;
  title: string;
  done: boolean;
}

// Default export to avoid expo-router treating this file as a route.
export default {} as any;