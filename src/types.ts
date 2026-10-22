export type PhotoShape = 'portrait' | 'square' | 'circle';

export interface MemberCardData {
  name: string;
  role: string;
  photoUrl: string | null;
  photoShape: PhotoShape;
  photoZoom: number; // 1 to 3
  photoOffsetX: number; // -150 to 150
  photoOffsetY: number; // -150 to 150
  viewOnTeqx: string;
  funFact: string;
  memberId: string;
}

export interface PresetProfile {
  id: string;
  label: string;
  data: MemberCardData;
}
