export interface RoutineSummaryDto {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: string;
  lastUsedAt: string | null;
}
