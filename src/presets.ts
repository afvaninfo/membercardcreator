import { MemberCardData, PresetProfile } from './types.ts';

// Sample royalty-free unsplash portraits for presets
const SAMPLE_PHOTO_1 = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
const SAMPLE_PHOTO_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
const SAMPLE_PHOTO_3 = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_CARD_DATA: MemberCardData = {
  name: 'Alex Rivera',
  role: 'Creative Technologist',
  photoUrl: SAMPLE_PHOTO_1,
  photoShape: 'portrait',
  photoZoom: 1.15,
  photoOffsetX: 0,
  photoOffsetY: -10,
  viewOnTeqx: 'Teqx Studio moves with the speed of thought. The craft is unapologetically sharp, bold, and laser-focused on digital work that actually moves people.',
  funFact: 'I own 4 mechanical keyboards and none of them make the same sound.',
  memberId: '#TQ-042',
};

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'creative-tech',
    label: 'Alex Rivera (Tech Lead)',
    data: {
      name: 'Alex Rivera',
      role: 'Creative Technologist',
      photoUrl: SAMPLE_PHOTO_1,
      photoShape: 'portrait',
      photoZoom: 1.15,
      photoOffsetX: 0,
      photoOffsetY: -10,
      viewOnTeqx: 'Teqx Studio moves with the speed of thought. The craft is unapologetically sharp, bold, and laser-focused on digital work that actually moves people.',
      funFact: 'I own 4 mechanical keyboards and none of them make the same sound.',
      memberId: '#TQ-042',
    },
  },
  {
    id: 'brand-designer',
    label: 'Maya Chen (Brand Designer)',
    data: {
      name: 'Maya Chen',
      role: 'Lead Brand Designer',
      photoUrl: SAMPLE_PHOTO_3,
      photoShape: 'square',
      photoZoom: 1.2,
      photoOffsetX: 0,
      photoOffsetY: 0,
      viewOnTeqx: 'Designing identities that lean forward like the logo itself. No corporate fluff, just intense contrast and unmistakable visual presence.',
      funFact: 'Secretly a competitive Mario Kart speedrunner in regional tournaments.',
      memberId: '#TQ-088',
    },
  },
  {
    id: 'product-engineer',
    label: 'Kiran Patel (Product Engineer)',
    data: {
      name: 'Kiran Patel',
      role: 'Senior Product Engineer',
      photoUrl: SAMPLE_PHOTO_2,
      photoShape: 'circle',
      photoZoom: 1.1,
      photoOffsetX: 0,
      photoOffsetY: 0,
      viewOnTeqx: 'Fast iterations, deep code craftsmanship, and zero compromise on performance. Building things here feels like playing in the creative major leagues.',
      funFact: 'Can solve a 3x3 Rubik’s cube in under 32 seconds while waiting for local builds.',
      memberId: '#TQ-114',
    },
  },
];
