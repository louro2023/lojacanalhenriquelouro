import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  increment,
  getDocFromServer,
  query,
  orderBy,
  limit,
  addDoc,
  where,
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

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  status: 'active' | 'pending' | 'suspended' | 'expired';
  downloadCredits: number;
  totalDownloads: number;
  licenseDays: number;
  licenseExpiresAt: string; // ISO String
  createdAt: string;
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
  createdAt?: string;
}

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'wolverine',
    title: 'Wolverine',
    realName: "Marvel's Wolverine",
    platform: 'PS5',
    driveUrl: 'https://drive.google.com/drive/folders/1b-JKWAcrRU0s9nAE1dWqW_Y40ZOBNfrN?usp=drive_link',
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
    driveUrl: 'https://drive.google.com/drive/folders/1_QpKgLa5mL-2ojdQHV8DgpBua2PLtUAt?usp=drive_link',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2b/007_First_Light_%282026%29_cover.jpg',
    likes: 98,
    downloads: 247,
    developer: 'IO Interactive',
    description: 'A origem do espião James Bond no serviço secreto MI6 com espionagem de ponta.',
  },
  {
    id: 'onimusha',
    title: 'Onimusha',
    realName: 'Onimusha: Warlords',
    platform: 'PS5',
    driveUrl: 'https://drive.google.com/drive/folders/1oEzSNKLzjXiBosNs-1TLVxBQvNbYbbas?usp=drive_link',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/761030/library_600x900_2x.jpg',
    likes: 85,
    downloads: 194,
    developer: 'Capcom',
    description: 'Lenda samurai no Japão feudal enfrentando demônios com a manopla Oni e espadas mágicas.',
  },
];

// Helper to calculate future expiration date
export function calculateExpirationDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(1, days));
  return date.toISOString();
}

// Calculate remaining days from ISO date
export function getDaysRemaining(expiresAt: string): number {
  if (!expiresAt) return 0;
  const now = new Date().getTime();
  const target = new Date(expiresAt).getTime();
  const diff = target - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if license is still valid
export function isLicenseValid(user: UserAccount): boolean {
  if (user.role === 'admin') return true;
  if (user.status !== 'active') return false;
  return getDaysRemaining(user.licenseExpiresAt) > 0;
}

// Seed initial users if none exist
export async function seedInitialUsers() {
  try {
    const now = new Date().toISOString();

    // Master Administrator Henrique Louro
    const henriqueRef = doc(db, 'userAccounts', 'admin_henrique_louro');
    const adminUser: UserAccount = {
      id: 'admin_henrique_louro',
      username: 'Henrique Louro',
      email: 'henrique-louro@hotmail.com',
      password: 'Fredunter2020!',
      role: 'admin',
      status: 'active',
      downloadCredits: 9999,
      totalDownloads: 0,
      licenseDays: 3650,
      licenseExpiresAt: calculateExpirationDate(3650),
      createdAt: now,
    };
    await setDoc(henriqueRef, adminUser, { merge: true });

    // Seed a sample customer account if needed
    const demoRef = doc(db, 'userAccounts', 'demo_gamer');
    const demoSnap = await getDoc(demoRef);
    if (!demoSnap.exists()) {
      const demoUser: UserAccount = {
        id: 'demo_gamer',
        username: 'Gamer Demonstração',
        email: 'gamer@henriquegames.com',
        password: 'gamer123',
        role: 'customer',
        status: 'active',
        downloadCredits: 999,
        totalDownloads: 2,
        licenseDays: 30,
        licenseExpiresAt: calculateExpirationDate(30),
        createdAt: now,
      };
      await setDoc(demoRef, demoUser);
    }
  } catch (e) {
    console.warn('Initial users seed check:', e);
  }
}

// Login user
export async function loginUser(
  identifier: string,
  pass: string
): Promise<{ user: UserAccount | null; error?: string }> {
  try {
    await seedInitialUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    const usersCol = collection(db, 'userAccounts');
    const snapshot = await getDocs(usersCol);

    let foundUser: UserAccount | null = null;

    snapshot.forEach((d) => {
      const data = d.data() as UserAccount;
      if (
        (data.email?.toLowerCase() === cleanId || data.username?.toLowerCase() === cleanId) &&
        data.password === cleanPass
      ) {
        foundUser = { ...data, id: d.id };
      }
    });

    if (!foundUser) {
      return { user: null, error: 'E-mail, usuário ou senha incorretos.' };
    }

    const u = foundUser as UserAccount;

    if (u.status === 'pending') {
      return {
        user: null,
        error: 'Sua conta ainda está aguardando aprovação do administrador.',
      };
    }

    if (u.status === 'suspended') {
      return {
        user: null,
        error: 'Esta conta foi suspensa temporariamente pelo administrador.',
      };
    }

    // Check expiration for customers
    if (u.role === 'customer' && getDaysRemaining(u.licenseExpiresAt) <= 0) {
      // Mark as expired
      await updateDoc(doc(db, 'userAccounts', u.id), { status: 'expired' });
      return {
        user: null,
        error: 'Sua licença de acesso expirou. Entre em contato para renovar!',
      };
    }

    return { user: u };
  } catch (err: any) {
    return { user: null, error: err.message || 'Falha ao autenticar usuário.' };
  }
}

// Request access / Register user as pending
export async function requestAccess(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const usersCol = collection(db, 'userAccounts');
    const qEmail = query(usersCol, where('email', '==', email.trim().toLowerCase()));
    const snap = await getDocs(qEmail);

    if (!snap.empty) {
      return { success: false, error: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newId = 'user_' + Date.now();
    const now = new Date().toISOString();

    const newUser: UserAccount = {
      id: newId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: 'customer',
      status: 'pending',
      downloadCredits: 0,
      totalDownloads: 0,
      licenseDays: 30,
      licenseExpiresAt: calculateExpirationDate(30),
      createdAt: now,
    };

    await setDoc(doc(db, 'userAccounts', newId), newUser);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao solicitar cadastro.' };
  }
}

// Subscribe to a single user in real-time
export function subscribeUser(userId: string, callback: (user: UserAccount | null) => void) {
  const userRef = doc(db, 'userAccounts', userId);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...(snap.data() as UserAccount), id: snap.id });
      } else {
        callback(null);
      }
    },
    () => callback(null)
  );
}

// Subscribe to all users (for Admin Dashboard)
export function subscribeAllUsers(callback: (users: UserAccount[]) => void) {
  const usersCol = collection(db, 'userAccounts');
  return onSnapshot(
    usersCol,
    (snap) => {
      const list: UserAccount[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as UserAccount), id: d.id });
      });
      // Sort: pending first, then by creation date
      list.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
      callback(list);
    },
    (err) => {
      console.warn('Real-time users error:', err);
      callback([]);
    }
  );
}

// Admin: Create new user
export async function adminCreateUser(data: {
  username: string;
  email: string;
  password: string;
  downloadCredits: number;
  licenseDays: number;
  role?: 'admin' | 'customer';
}): Promise<{ success: boolean; error?: string }> {
  try {
    const newId = 'user_' + Date.now();
    const now = new Date().toISOString();
    const newUser: UserAccount = {
      id: newId,
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      role: data.role || 'customer',
      status: 'active',
      downloadCredits: Number(data.downloadCredits) || 1,
      totalDownloads: 0,
      licenseDays: Number(data.licenseDays) || 30,
      licenseExpiresAt: calculateExpirationDate(data.licenseDays),
      createdAt: now,
    };

    await setDoc(doc(db, 'userAccounts', newId), newUser);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Admin: Approve pending user and assign credits and license
export async function adminApproveUser(
  userId: string,
  downloadCredits: number,
  licenseDays: number
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'userAccounts', userId), {
      status: 'active',
      downloadCredits: Number(downloadCredits) || 3,
      licenseDays: Number(licenseDays) || 30,
      licenseExpiresAt: calculateExpirationDate(licenseDays || 30),
    });
    return true;
  } catch {
    return false;
  }
}

// Admin: Update user credits and license
export async function adminUpdateUser(
  userId: string,
  updates: Partial<UserAccount>
): Promise<boolean> {
  try {
    const cleanUpdates = { ...updates };
    if (updates.licenseDays && !updates.licenseExpiresAt) {
      cleanUpdates.licenseExpiresAt = calculateExpirationDate(updates.licenseDays);
    }
    await updateDoc(doc(db, 'userAccounts', userId), cleanUpdates);
    return true;
  } catch {
    return false;
  }
}

// Admin: Delete user
export async function adminDeleteUser(userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'userAccounts', userId));
    return true;
  } catch {
    return false;
  }
}

// Consume download credit
export async function consumeDownloadCredit(
  userId: string,
  gameId: string
): Promise<{ success: boolean; remainingCredits: number; message?: string }> {
  try {
    const userRef = doc(db, 'userAccounts', userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return { success: false, remainingCredits: 0, message: 'Usuário não encontrado.' };
    }

    const userData = snap.data() as UserAccount;

    // Admin has infinite downloads
    if (userData.role === 'admin') {
      await incrementDownload(gameId);
      return { success: true, remainingCredits: 9999 };
    }

    // Check expiration
    if (getDaysRemaining(userData.licenseExpiresAt) <= 0) {
      return {
        success: false,
        remainingCredits: userData.downloadCredits,
        message: 'Sua licença expirou. Entre em contato para renovar seu acesso.',
      };
    }

    // Check credits
    if (userData.downloadCredits <= 0) {
      return {
        success: false,
        remainingCredits: 0,
        message: 'Seus créditos de download acabaram. Solicite novos créditos ao administrador.',
      };
    }

    // Deduct 1 credit and add 1 download
    const nextCredits = userData.downloadCredits - 1;
    await updateDoc(userRef, {
      downloadCredits: increment(-1),
      totalDownloads: increment(1),
    });

    // Increment game download counter
    await incrementDownload(gameId);

    return { success: true, remainingCredits: nextCredits };
  } catch (err: any) {
    return { success: false, remainingCredits: 0, message: err.message };
  }
}

// Real-time games list
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
        snapshot.forEach((d) => {
          games.push({ id: d.id, ...(d.data() as Omit<GameItem, 'id'>) });
        });
        const order = ['wolverine', '007', 'onimusha'];
        games.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
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
  const q = query(collection(db, 'supporterMessages'), orderBy('createdAt', 'desc'), limit(15));
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
      callback([
        { id: '1', name: 'Lucas Gamer', message: 'Marvel Wolverine rodando top demais!', createdAt: 'Hoje' },
        { id: '2', name: 'Gabriel PS5', message: 'Melhor catálogo de jogos, parabéns Henrique!', createdAt: 'Hoje' },
      ]);
    }
  );
}

export async function addSupporterMessage(name: string, message: string) {
  try {
    await addDoc(collection(db, 'supporterMessages'), {
      name: name.trim().slice(0, 50),
      message: message.trim().slice(0, 280),
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
        // Automatically save initial default settings
        setDoc(docRef, DEFAULT_SYSTEM_SETTINGS, { merge: true }).catch(() => {});
        callback(DEFAULT_SYSTEM_SETTINGS);
      }
    },
    () => {
      callback(DEFAULT_SYSTEM_SETTINGS);
    }
  );
}

// Update system settings (Admin only)
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

