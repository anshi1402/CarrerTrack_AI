export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today by completing your daily goal!';
  if (streak === 1) return '🔥 1 day streak! Day 1 is done, keep going!';
  if (streak < 7) return `🔥 ${streak}-day streak! Consistency is the key to placements.`;
  if (streak < 30) return `🔥 You're on an amazing ${streak}-day learning streak! Keep your streak alive!`;
  return `👑 Legendary ${streak}-day streak! You are in the top 1% of prepared candidates!`;
}
