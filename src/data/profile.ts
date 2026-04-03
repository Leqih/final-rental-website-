import type { College } from './colleges';

export interface StudentProfile {
  college: College | null;
  budgetMax: number;
  beds: 'any' | 'Studio' | '1B' | '2B+';
}

export function matchScore(
  listing: { price: number; beds: string; walkFrom: Record<string, number> },
  p: StudentProfile
): number {
  let total = 0, w = 0;
  if (p.college) {
    const mins = listing.walkFrom[p.college.id] ?? 30;
    const s = mins <= 8 ? 100 : mins <= 12 ? 78 : mins <= 17 ? 52 : 20;
    total += s * 0.4; w += 0.4;
  }
  const budgetS = listing.price <= p.budgetMax ? 100 : listing.price <= p.budgetMax * 1.12 ? 55 : 15;
  total += budgetS * 0.4; w += 0.4;
  if (p.beds !== 'any') {
    const bedsS =
      p.beds === 'Studio' ? (listing.beds === 'Studio' ? 100 : 20) :
      p.beds === '1B'     ? (listing.beds.startsWith('1B') ? 100 : 20) :
                            (listing.beds.startsWith('2B') ? 100 : 20);
    total += bedsS * 0.2; w += 0.2;
  }
  return w > 0 ? Math.round(total / w) : 0;
}

export function matchReasons(
  listing: { price: number; beds: string; walkFrom: Record<string, number> },
  p: StudentProfile
): { text: string; ok: boolean }[] {
  const reasons: { text: string; ok: boolean }[] = [];
  if (p.college) {
    const mins = listing.walkFrom[p.college.id] ?? 30;
    reasons.push({
      text: `${mins} min from ${p.college.short}`,
      ok: mins <= 12,
    });
  }
  reasons.push({
    text: listing.price <= p.budgetMax
      ? `$${listing.price}/mo — in budget`
      : `$${listing.price}/mo — $${listing.price - p.budgetMax} over budget`,
    ok: listing.price <= p.budgetMax,
  });
  if (p.beds !== 'any') {
    const matches =
      p.beds === 'Studio' ? listing.beds === 'Studio' :
      p.beds === '1B'     ? listing.beds.startsWith('1B') :
                            listing.beds.startsWith('2B');
    reasons.push({ text: `${listing.beds} ${matches ? '— matches your preference' : '— not your preferred type'}`, ok: matches });
  }
  return reasons;
}
