import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  getDocFromServer,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initial connection test
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    return false;
  }
}

export interface GameItem {
  id: string;
  title: string;
  realName: string;
  platform: string;
  driveUrl: string;
  coverUrl: string;
  likes: number;
  downloads: number;
  developer?: string;
  description?: string;
}

export interface SupporterMessageItem {
  id: string;
  name: string;
  message: string;
  gameRequested?: string;
  createdAt?: string;
}

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'silenthill_townfall',
    title: 'Silent Hill: Townfall',
    realName: 'Silent.Hill.Townfall.exfat',
    platform: 'PS5',
    driveUrl: 'https://vault1.link-vault.org/c/K7J88S4_',
    coverUrl: '/images/silent_hill_townfall.jpg',
    likes: 135,
    downloads: 78,
    developer: 'Konami / Annapurna',
    description: 'Terror psicológico visceral e atmosfera densa na névoa enigmática. 100% testado e funcionando pronto para instalação no PS5.',
  },
  {
    id: 'wolverine',
    title: 'Wolverine',
    realName: "Marvel's Wolverine",
    platform: 'PS5',
    driveUrl: 'https://vault14.link-vault.org/c/i45HTvlW',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3d/Marvel%27s_Wolverine_cover_art.jpg',
    likes: 142,
    downloads: 389,
    developer: 'Insomniac Games',
    description: 'Ação visceral e narrativa profunda com garras de adamantium exclusivas no PlayStation 5.',
  },
  {
    id: '007',
    title: '007',
    realName: '007 First Light',
    platform: 'PS5',
    driveUrl: 'https://vault1.link-vault.org/c/4cKVAIvM',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2b/007_First_Light_%282026%29_cover.jpg',
    likes: 98,
    downloads: 247,
    developer: 'IO Interactive',
    description: 'A origem do espião James Bond no serviço secreto MI6 com espionagem de ponta.',
  },
  {
    id: 'onimusha',
    title: 'Onimusha: Way of the Sword',
    realName: 'Onimusha: Way of the Sword',
    platform: 'PS5',
    driveUrl: 'https://vault15.link-vault.org/c/Ip8J0lL4',
    coverUrl: '/covers/onimusha_way_of_the_sword.jpg',
    likes: 85,
    downloads: 194,
    developer: 'Capcom',
    description: 'Ação e combate samurai com Miyamoto Musashi e a manopla Oni demoníaca na era feudal de Kyoto.',
  },
];

// Subscribe to games with real-time updates and dynamic sync of target URLs
export function subscribeGames(callback: (games: GameItem[]) => void) {
  const gamesCollection = collection(db, 'games');

  return onSnapshot(
    gamesCollection,
    (snapshot) => {
      if (snapshot.empty) {
        INITIAL_GAMES.forEach((game) => {
          setDoc(doc(db, 'games', game.id), game).catch(console.error);
        });
        callback(INITIAL_GAMES);
      } else {
        const games: GameItem[] = [];
        const existingIds = new Set<string>();
        snapshot.forEach((d) => {
          existingIds.add(d.id);
          games.push({ id: d.id, ...(d.data() as Omit<GameItem, 'id'>) });
        });

        // Ensure newly introduced games and updated links sync into Firestore
        INITIAL_GAMES.forEach((initGame) => {
          if (!existingIds.has(initGame.id)) {
            setDoc(doc(db, 'games', initGame.id), initGame).catch(console.error);
            games.push(initGame);
          } else {
            const found = games.find((g) => g.id === initGame.id);
            if (found && (found.driveUrl !== initGame.driveUrl || found.coverUrl !== initGame.coverUrl || found.realName !== initGame.realName)) {
              found.driveUrl = initGame.driveUrl;
              found.realName = initGame.realName;
              found.title = initGame.title;
              found.coverUrl = initGame.coverUrl;
              setDoc(doc(db, 'games', initGame.id), initGame, { merge: true }).catch(console.error);
            }
          }
        });

        const order = ['silenthill_townfall', 'wolverine', '007', 'onimusha'];
        games.sort((a, b) => {
          const idxA = order.indexOf(a.id);
          const idxB = order.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
        callback(games);
      }
    },
    () => {
      callback(INITIAL_GAMES);
    }
  );
}

// Increment likes
export async function likeGame(gameId: string) {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, { likes: increment(1) });
  } catch (err) {
    console.error('Error liking game:', err);
  }
}

// Increment downloads
export async function incrementDownload(gameId: string) {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, { downloads: increment(1) });
  } catch (err) {
    console.error('Error updating downloads:', err);
  }
}

// Real-time community messages
export function subscribeSupporterMessages(callback: (messages: SupporterMessageItem[]) => void) {
  const q = query(collection(db, 'supporterMessages'), orderBy('timestamp', 'desc'), limit(15));
  return onSnapshot(
    q,
    (snapshot) => {
      const messages: SupporterMessageItem[] = [];
      snapshot.forEach((d) => {
        messages.push({ id: d.id, ...(d.data() as Omit<SupporterMessageItem, 'id'>) });
      });
      callback(messages);
    },
    () => {
      callback([]);
    }
  );
}

// Add community game request message
export async function addSupporterMessage(name: string, message: string, gameRequested?: string) {
  try {
    await addDoc(collection(db, 'supporterMessages'), {
      name: name.trim(),
      message: message.trim(),
      gameRequested: gameRequested ? gameRequested.trim() : message.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      timestamp: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

// System & License Settings
export interface SystemSettings {
  availableLicenses: number;
  noticeEnabled: boolean;
  customNoticeMessage?: string;
  updatedAt?: string;
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  availableLicenses: 10,
  noticeEnabled: true,
  customNoticeMessage: '',
};

// Real-time listener for system settings
export function subscribeSystemSettings(callback: (settings: SystemSettings) => void) {
  const docRef = doc(db, 'systemSettings', 'licenses');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SystemSettings>;
        callback({
          availableLicenses: typeof data.availableLicenses === 'number' ? data.availableLicenses : 10,
          noticeEnabled: data.noticeEnabled !== false,
          customNoticeMessage: data.customNoticeMessage || '',
          updatedAt: data.updatedAt,
        });
      } else {
        setDoc(docRef, DEFAULT_SYSTEM_SETTINGS, { merge: true }).catch(() => {});
        callback(DEFAULT_SYSTEM_SETTINGS);
      }
    },
    () => {
      callback(DEFAULT_SYSTEM_SETTINGS);
    }
  );
}

// Update system settings
export async function updateSystemSettings(
  updates: Partial<SystemSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'systemSettings', 'licenses');
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    console.error('Error updating system settings:', err);
    return { success: false, error: err.message || 'Erro ao salvar configurações.' };
  }
}
