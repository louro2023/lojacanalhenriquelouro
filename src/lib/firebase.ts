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
    id: 'pragmata_deluxe',
    title: 'Pragmata Deluxe Edition',
    realName: 'PRAGMATA Deluxe Edition LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/1w1uP8UN6J',
    coverUrl: '/covers/pragmata.jpg',
    likes: 245,
    downloads: 512,
    developer: 'Capcom',
    description: 'Aventura de ficção científica distópica na Lua com astronauta em exoesqueleto pesado e a misteriosa andróide Diana no PS5 formato LZ4.',
  },
  {
    id: 'spiderman_2',
    title: "Marvel's Spider-Man 2",
    realName: "Marvel's Spider-Man 2 LZ4",
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/vLMCxg49mW#LIZARD',
    coverUrl: '/covers/spiderman_2.jpg',
    likes: 415,
    downloads: 920,
    developer: 'Insomniac Games / PlayStation Studios',
    description: 'Peter Parker e Miles Morales enfrentam a fúria do simbionte Venom e Kraven o Caçador em Nova York no formato LZ4 otimizado para o PS5.',
  },
  {
    id: 'astro_bot',
    title: 'Astro Bot',
    realName: 'Astro Bot LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/j8QaOtne1l#LIZARD',
    coverUrl: '/covers/astro_bot.jpg',
    likes: 388,
    downloads: 840,
    developer: 'Team Asobi / PlayStation Studios',
    description: 'O premiado jogo do ano no PS5! Mais de 50 galáxias repletas de ação, homenagens icônicas ao PlayStation e uso genial do DualSense formato LZ4.',
  },
  {
    id: 'ghost_of_yotei',
    title: 'Ghost of Yôtei: Deluxe Edition',
    realName: 'Ghost of Yotei: Deluxe Edition PFS',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/Q5dNUyZid1#PPSA26344',
    coverUrl: '/covers/ghost_of_yotei.png',
    likes: 295,
    downloads: 580,
    developer: 'Sucker Punch Productions / PlayStation Studios',
    description: 'A aguardada sequência de Ghost of Tsushima! Acompanhe a jornada épica da guerreira Atsu nas terras selvagens do Monte Yôtei em 1603 formato PFS.',
  },
  {
    id: 'spiderman_remastered',
    title: "Marvel's Spider-Man Remastered",
    realName: 'Marvels Spider Man Remastered',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/s1fzcUUOs0#LIZARD',
    coverUrl: '/covers/spiderman_remastered.jpg',
    likes: 324,
    downloads: 780,
    developer: 'Insomniac Games / PlayStation Studios',
    description: 'A aventura definitiva de Peter Parker totalmente remasterizada a 60 FPS com Ray Tracing e a DLC A Cidade que Nunca Dorme no PlayStation 5.',
  },
  {
    id: 'resident_evil_4_remake',
    title: 'Resident Evil 4 Remake',
    realName: 'Resident Evil 4 Remake LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/L7Y7Zb1JuR#LIZARD',
    coverUrl: '/covers/resident_evil_4_remake.jpg',
    likes: 189,
    downloads: 412,
    developer: 'Capcom',
    description: 'Sobrevivência visceral e terror eletrizante com Leon S. Kennedy totalmente remasterizado em alta fidelidade no PS5 no formato LZ4.',
  },
  {
    id: 'hogwarts_legacy',
    title: 'Hogwarts Legacy',
    realName: 'Hogwarts Legacy LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/KWWwzvGoU5#LIZARD',
    coverUrl: '/covers/hogwarts_legacy.png',
    likes: 215,
    downloads: 540,
    developer: 'Avalanche Software / Warner Bros.',
    description: 'Explore o mundo bruxo em Hogwarts no século XIX com feitiços, poções e aventuras de mundo aberto no PlayStation 5 formato LZ4.',
  },
  {
    id: 'resident_evil_requiem',
    title: 'Resident Evil Requiem',
    realName: 'Resident Evil Requiem LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/qf7HV7WiiK#LIZARD',
    coverUrl: '/covers/resident_evil_requiem.jpg',
    likes: 167,
    downloads: 328,
    developer: 'Capcom',
    description: 'O novo capítulo de horror e sobrevivência visceral no PlayStation 5 com atmosfera intensa e ameaças biológicas formato LZ4.',
  },
  {
    id: 'black_myth_wukong',
    title: 'Black Myth: Wukong',
    realName: 'Black Myth Wukong LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/5dwq5Jznsa#LIZARD',
    coverUrl: '/covers/black_myth_wukong.jpg',
    likes: 298,
    downloads: 680,
    developer: 'Game Science',
    description: 'Ação RPG espetacular no PS5 baseado na lenda de Sun Wukong e Jornada ao Oeste com combates fluidos e gráficos de ponta formato LZ4.',
  },
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
  {
    id: 'tekken_8_ultimate',
    title: 'Tekken 8 Ultimate Edition',
    realName: 'Tekken 8 Ultimate Edition LZ4',
    platform: 'PS5',
    driveUrl: 'https://gofile.io/d/CZ8YcesH',
    coverUrl: '/covers/tekken_8.jpg',
    likes: 312,
    downloads: 580,
    developer: 'Bandai Namco Studios',
    description: 'Combate 3D de última geração com o motor gráfico Unreal Engine 5, novo sistema Heat e confrontos cinematográficos no PS5 formato LZ4.',
  },
  {
    id: 'star_wars_galactic_racer',
    title: 'Star Wars Galactic Racer',
    realName: 'Star Wars Galactic Racer LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/GIyaYXoPk4#STAR',
    coverUrl: '/covers/star_wars_galactic_racer.jpg',
    likes: 245,
    downloads: 410,
    developer: 'Lucasfilm Games / EA',
    description: 'Corridas intergalácticas em altíssima velocidade no universo Star Wars com naves customizáveis e pistas desafiadoras no PS5 formato LZ4.',
  },
  {
    id: 'hifi_rush_deluxe',
    title: 'Hi-Fi Rush Deluxe Edition',
    realName: 'Hi-Fi Rush Deluxe Edition LZ4',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/2BOC2dj8Li#Hi',
    coverUrl: '/covers/hifi_rush.jpg',
    likes: 280,
    downloads: 495,
    developer: 'Tango Gameworks / Bethesda',
    description: 'Ação e ritmo eletrizante onde cada ataque, esquiva e batida de combate sincronizam perfeitamente com a trilha sonora no PS5 formato LZ4.',
  },
  {
    id: 'hellraiser_revival_deluxe',
    title: "Clive Barker's Hellraiser Revival",
    realName: "Clive Barker's Hellraiser Revival Deluxe Edition LZ4",
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/ZZXDFWG3E6',
    coverUrl: '/covers/hellraiser_revival.jpg',
    likes: 220,
    downloads: 360,
    developer: 'Dimension / Seraphic Games',
    description: 'Terror e horror cósmico visceral inspirado no universo lendário de Pinhead e a Configuração do Lamento no PlayStation 5 formato LZ4.',
  },
  {
    id: 'saros',
    title: 'Saros',
    realName: 'Saros LZ4',
    platform: 'PS5',
    driveUrl: 'https://gofile.io/d/8PISJ5eP',
    coverUrl: '/covers/saros.jpg',
    likes: 195,
    downloads: 310,
    developer: 'Housemarque / Sony Interactive',
    description: 'Ação sci-fi intensa e roguelike espacial com visuais deslumbrantes e jogabilidade responsiva 100% testada no PS5 formato LZ4.',
  },
  {
    id: 'ufc_6',
    title: 'UFC 6',
    realName: 'UFC 6 LZ4',
    platform: 'PS5',
    driveUrl: 'https://gofile.io/d/fFtb7FZq',
    coverUrl: '/covers/ufc_6.jpg',
    likes: 265,
    downloads: 520,
    developer: 'EA Sports',
    description: 'O ápice da luta no octógono com física realista de impacto, golpes devastadores e elenco completo dos maiores lutadores do mundo no PS5 formato LZ4.',
  },
  {
    id: 'street_fighter_6_fighters_edition',
    title: 'Street Fighter 6 + DLC Years 1-3',
    realName: 'Street Fighter 6 + DLC Years 1-3 Fighters Edition LZ4',
    platform: 'PS5',
    driveUrl: 'https://gofile.io/d/eIWOvYvF',
    coverUrl: '/covers/street_fighter_6.jpg',
    likes: 340,
    downloads: 690,
    developer: 'Capcom',
    description: 'A experiência definitiva de luta com elenco expandido, todos os lutadores das temporadas 1 a 3 e o modo World Tour completo no PS5 formato LZ4.',
  },
  {
    id: 'blasphemous_2_pfs',
    title: 'Blasphemous 2',
    realName: 'Blasphemous 2 PFS',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/JCt28wlupy',
    coverUrl: '/covers/blasphemous_2.jpg',
    likes: 230,
    downloads: 430,
    developer: 'The Game Kitchen / Team17',
    description: 'O retorno do Penitente em um mundo gótico não linear com combate implacável, relíquias profanas e chefes colossais no PS5 formato PFS.',
  },
  {
    id: 'returnal_pfs',
    title: 'Returnal',
    realName: 'Returnal PFS',
    platform: 'PS5',
    driveUrl: 'https://vik1ngfile.site/f/sN01dJD3wv',
    coverUrl: '/covers/returnal.jpg',
    likes: 310,
    downloads: 560,
    developer: 'Housemarque / PlayStation Studios',
    description: 'Quebre o ciclo temporal em Atropos neste aclamado shooter roguelike com áudio 3D imersivo e resposta tátil DualSense no PS5 formato PFS.',
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

        const order = [
          'pragmata_deluxe',
          'spiderman_2',
          'astro_bot',
          'ghost_of_yotei',
          'spiderman_remastered',
          'resident_evil_4_remake',
          'hogwarts_legacy',
          'resident_evil_requiem',
          'black_myth_wukong',
          'silenthill_townfall',
          'wolverine',
          '007',
          'onimusha',
          'tekken_8_ultimate',
          'star_wars_galactic_racer',
          'hifi_rush_deluxe',
          'hellraiser_revival_deluxe',
          'saros',
          'ufc_6',
          'street_fighter_6_fighters_edition',
          'blasphemous_2_pfs',
          'returnal_pfs',
        ];
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

// ========================================================
// PEÇA SEU GAME AQUI!! - SISTEMA DE PEDIDOS, CURTIDAS E RANKING
// ========================================================

export interface GameRequestItem {
  id: string;
  gameTitle: string;
  userName: string;
  notes?: string;
  likes: number;
  status?: 'voting' | 'in_review' | 'testing' | 'added';
  createdAt?: string;
  timestamp?: any;
}

export const INITIAL_GAME_REQUESTS: GameRequestItem[] = [
  {
    id: 'req_gta_6',
    gameTitle: 'Grand Theft Auto VI (GTA 6)',
    userName: 'Pedro_GamerPS5',
    notes: 'O lançamento mais aguardado no PS5! Testado com gráficos em alta resolução.',
    likes: 428,
    status: 'voting',
    createdAt: 'Hoje',
  },
  {
    id: 'req_gow_rag',
    gameTitle: 'God of War Ragnarök (PT-BR)',
    userName: 'Carlos_Spartan',
    notes: 'Dublagem completa em português do Brasil e expansão Valhalla.',
    likes: 356,
    status: 'in_review',
    createdAt: 'Hoje',
  },
  {
    id: 'req_spiderman_2',
    gameTitle: "Marvel's Spider-Man 2",
    userName: 'Lucas_Teia',
    notes: 'Peter Parker e Miles Morales juntos com trajes e missões desbloqueadas! (Adicionado ao Catálogo!)',
    likes: 312,
    status: 'added',
    createdAt: 'Ontem',
  },
  {
    id: 'req_elden_ring',
    gameTitle: 'Elden Ring + Shadow of the Erdtree',
    userName: 'SoulsMaster_BR',
    notes: 'Com a expansão Shadow of the Erdtree testada funcionando no PS5.',
    likes: 245,
    status: 'voting',
    createdAt: 'Ontem',
  },
  {
    id: 'req_tlou_part1',
    gameTitle: 'The Last of Us Part I Remake',
    userName: 'Joel_Ellie_99',
    notes: 'Remake da obra-prima com fidelidade visual fantástica.',
    likes: 198,
    status: 'in_review',
    createdAt: '2 dias atrás',
  },
  {
    id: 'req_ff7_rebirth',
    gameTitle: 'Final Fantasy VII Rebirth',
    userName: 'Cloud_Strife',
    notes: 'A continuação grandiosa de Final Fantasy VII no PS5.',
    likes: 174,
    status: 'voting',
    createdAt: '3 dias atrás',
  },
  {
    id: 'req_cyberpunk',
    gameTitle: 'Cyberpunk 2077: Phantom Liberty',
    userName: 'V_NightCity',
    notes: 'DLC Phantom Liberty e atualização gráfica de última geração.',
    likes: 152,
    status: 'voting',
    createdAt: '4 dias atrás',
  },
  {
    id: 'req_demons_souls',
    gameTitle: "Demon's Souls Remake",
    userName: 'Boletaria_Knight',
    notes: 'Visual de cair o queixo da Bluepoint Games.',
    likes: 139,
    status: 'added',
    createdAt: '5 dias atrás',
  },
];

// Inscrição em tempo real para os pedidos de jogos ("Peça seu Game Aqui!!")
export function subscribeGameRequests(callback: (requests: GameRequestItem[]) => void) {
  const reqCollection = collection(db, 'gameRequests');
  return onSnapshot(
    reqCollection,
    (snapshot) => {
      if (snapshot.empty) {
        INITIAL_GAME_REQUESTS.forEach((item) => {
          setDoc(doc(db, 'gameRequests', item.id), {
            gameTitle: item.gameTitle,
            userName: item.userName,
            notes: item.notes || '',
            likes: item.likes,
            status: item.status || 'voting',
            createdAt: item.createdAt || 'Hoje',
            timestamp: serverTimestamp(),
          }).catch(console.error);
        });
        callback(INITIAL_GAME_REQUESTS);
      } else {
        const requests: GameRequestItem[] = [];
        snapshot.forEach((d) => {
          requests.push({ id: d.id, ...(d.data() as Omit<GameRequestItem, 'id'>) });
        });
        callback(requests);
      }
    },
    (err) => {
      console.warn('Erro ao carregar pedidos do Firestore, usando lista inicial:', err);
      callback(INITIAL_GAME_REQUESTS);
    }
  );
}

// Adicionar um novo pedido de jogo no Firestore
export async function addGameRequest(gameTitle: string, userName: string, notes?: string) {
  try {
    const docRef = await addDoc(collection(db, 'gameRequests'), {
      gameTitle: gameTitle.trim(),
      userName: userName.trim(),
      notes: notes?.trim() || '',
      likes: 1,
      status: 'voting',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error('Erro ao adicionar pedido de jogo:', err);
    return { success: false, error: err.message };
  }
}

// Dar joinha / curtir (ou remover curtida) em um pedido de jogo
export async function likeGameRequest(requestId: string, delta: number = 1) {
  try {
    const reqRef = doc(db, 'gameRequests', requestId);
    await updateDoc(reqRef, {
      likes: increment(delta),
    });
    return true;
  } catch (err) {
    console.error('Erro ao curtir pedido de jogo:', err);
    return false;
  }
}
