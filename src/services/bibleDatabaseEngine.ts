/**
 * MOTOR DE BASE DE DATOS LOCAL OFFLINE PARA LA BIBLIA (VBL / RV / Español)
 * 
 * Implementa una arquitectura relacional offline estructurada sobre IndexedDB y memoria RAM:
 * 1. Tabla / Store 'libros': id, nombre, testamento, abreviatura, totalCapitulos
 * 2. Tabla / Store 'capitulos': id, libro_id, numero_capitulo, totalVersiculos
 * 3. Tabla / Store 'versiculos': id, capitulo_id, libro_id, numero_capitulo, numero_versiculo, texto
 */

import { BIBLE_BOOKS } from '../data/havahData';
import matData from '../../public/bible/books/MAT.json';

export type Testamento = 'Antiguo' | 'Nuevo';

export interface LibroSchema {
  id: string; // ej: "GEN", "MAT", "PSA"
  nombre: string; // ej: "Génesis", "Mateo", "Salmos"
  nombreEn: string;
  testamento: Testamento;
  abreviatura: string; // ej: "Gén", "Mt", "Sal"
  totalCapitulos: number;
  orden: number;
}

export interface CapituloSchema {
  id: string; // ej: "MAT_4", "GEN_1"
  libro_id: string; // ej: "MAT"
  numero_capitulo: number; // ej: 4
  totalVersiculos: number;
}

export interface VersiculoSchema {
  id: string; // ej: "MAT_4_23"
  capitulo_id: string; // ej: "MAT_4"
  libro_id: string; // ej: "MAT"
  numero_capitulo: number; // ej: 4
  numero_versiculo: number; // ej: 23
  texto: string; // Texto en Español (VBL / RV)
  textoEn?: string; // Texto en Inglés (KJV)
}

export interface SyncProgressCallback {
  (cargados: number, total: number, libroActual: string, totalVersiculos: number): void;
}

const DB_NAME = 'BibliaOfflineDB_VBL_v2';
const DB_VERSION = 1;
const STORE_LIBROS = 'libros';
const STORE_CAPITULOS = 'capitulos';
const STORE_VERSICULOS = 'versiculos';
const META_STORE = 'db_metadata';

export class BibleDatabaseEngine {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private memoryLibros: Map<string, LibroSchema> = new Map();
  private memoryCapitulos: Map<string, CapituloSchema[]> = new Map();
  private memoryVersiculos: Map<string, VersiculoSchema[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.buildLibrosCatalog();
    this.initDatabase();
    this.preloadBundledData();
  }

  /**
   * Catálogo maestro de los 66 libros de la Biblia con su estructura canónica.
   */
  private buildLibrosCatalog() {
    const abrevMap: Record<string, string> = {
      GEN: 'Gén', EXO: 'Éxo', LEV: 'Lev', NUM: 'Núm', DEU: 'Deu',
      JOS: 'Jos', JDG: 'Jue', RUT: 'Rut', '1SA': '1 S', '2SA': '2 S',
      '1KI': '1 R', '2KI': '2 R', '1CH': '1 Cr', '2CH': '2 Cr', EZR: 'Esd',
      NEH: 'Neh', EST: 'Est', JOB: 'Job', PSA: 'Sal', PRO: 'Pr',
      ECC: 'Ecl', SNG: 'Cnt', ISA: 'Isa', JER: 'Jer', LAM: 'Lam',
      EZK: 'Ez', DAN: 'Dn', HOS: 'Os', JOL: 'Jl', AMO: 'Am',
      OBA: 'Abd', JON: 'Jon', MIC: 'Miq', NAM: 'Nah', HAB: 'Hab',
      ZEP: 'Sof', HAG: 'Hag', ZEC: 'Zac', MAL: 'Mal',
      MAT: 'Mt', MRK: 'Mr', LUK: 'Lc', JHN: 'Jn', ACT: 'Hch',
      ROM: 'Ro', '1CO': '1 Co', '2CO': '2 Co', GAL: 'Gál', EPH: 'Ef',
      PHP: 'Fil', COL: 'Col', '1TH': '1 Ts', '2TH': '2 Ts', '1TI': '1 Ti',
      '2TI': '2 Ti', TIT: 'Tit', PHM: 'Flm', HEB: 'Heb', JAS: 'Stg',
      '1PE': '1 P', '2PE': '2 P', '1JN': '1 Jn', '2JN': '2 Jn', '3JN': '3 Jn',
      JUD: 'Jud', REV: 'Ap',
    };

    BIBLE_BOOKS.forEach((b, index) => {
      const libro: LibroSchema = {
        id: b.id,
        nombre: b.nameEs,
        nombreEn: b.nameEn,
        testamento: b.isOldTestament ? 'Antiguo' : 'Nuevo',
        abreviatura: abrevMap[b.id] || b.id,
        totalCapitulos: b.chaptersCount,
        orden: index + 1,
      };
      this.memoryLibros.set(b.id, libro);
    });
  }

  /**
   * Pre-carga de datos empaquetados localmente para disponibilidad inmediata (0ms latency).
   */
  private preloadBundledData() {
    if (matData && matData.bookId === 'MAT' && matData.chapters) {
      const libroId = 'MAT';
      const caps: CapituloSchema[] = [];
      matData.chapters.forEach((vers, cIdx) => {
        const numCap = cIdx + 1;
        const capId = `${libroId}_${numCap}`;
        caps.push({
          id: capId,
          libro_id: libroId,
          numero_capitulo: numCap,
          totalVersiculos: vers.length,
        });

        const versiculos: VersiculoSchema[] = vers.map((v: any) => ({
          id: `${libroId}_${numCap}_${v.verseNumber}`,
          capitulo_id: capId,
          libro_id: libroId,
          numero_capitulo: numCap,
          numero_versiculo: v.verseNumber,
          texto: v.textEs,
          textoEn: v.textEn,
        }));
        this.memoryVersiculos.set(capId, versiculos);
      });
      this.memoryCapitulos.set(libroId, caps);
    }
  }

  /**
   * Inicialización de la base de datos relacional IndexedDB.
   */
  public async initDatabase(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const request = window.indexedDB.open(DB_NAME, DB_VERSION);

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // 1. Tabla 'libros'
            if (!db.objectStoreNames.contains(STORE_LIBROS)) {
              const storeLibros = db.createObjectStore(STORE_LIBROS, { keyPath: 'id' });
              storeLibros.createIndex('testamento', 'testamento', { unique: false });
              storeLibros.createIndex('orden', 'orden', { unique: true });
            }

            // 2. Tabla 'capitulos'
            if (!db.objectStoreNames.contains(STORE_CAPITULOS)) {
              const storeCaps = db.createObjectStore(STORE_CAPITULOS, { keyPath: 'id' });
              storeCaps.createIndex('libro_id', 'libro_id', { unique: false });
              storeCaps.createIndex('libro_capitulo', ['libro_id', 'numero_capitulo'], { unique: true });
            }

            // 3. Tabla 'versiculos'
            if (!db.objectStoreNames.contains(STORE_VERSICULOS)) {
              const storeVers = db.createObjectStore(STORE_VERSICULOS, { keyPath: 'id' });
              storeVers.createIndex('capitulo_id', 'capitulo_id', { unique: false });
              storeVers.createIndex('libro_id', 'libro_id', { unique: false });
              storeVers.createIndex('libro_cap_vers', ['libro_id', 'numero_capitulo', 'numero_versiculo'], { unique: true });
            }

            // 4. Metadatos del sistema
            if (!db.objectStoreNames.contains(META_STORE)) {
              db.createObjectStore(META_STORE, { keyPath: 'key' });
            }
          };

          request.onsuccess = () => {
            this.isInitialized = true;
            resolve(request.result);
          };

          request.onerror = () => {
            console.warn('BibleDatabaseEngine: Error abriendo IndexedDB, usando modo memoria.');
            resolve(null);
          };
        } catch (err) {
          console.warn('BibleDatabaseEngine: Excepción en IndexedDB:', err);
          resolve(null);
        }
      });
    }

    return this.dbPromise;
  }

  /**
   * Carga e indexa la Biblia Completa desde los archivos JSON estáticos en primer inicio
   */
  public async seedDatabaseFromAssets(onProgress?: SyncProgressCallback): Promise<boolean> {
    const db = await this.initDatabase();
    const libros = Array.from(this.memoryLibros.values());
    const totalLibros = libros.length;
    let totalVersiculosCount = 0;

    for (let i = 0; i < totalLibros; i++) {
      const libro = libros[i];
      if (onProgress) {
        onProgress(i, totalLibros, libro.nombre, totalVersiculosCount);
      }

      try {
        const resp = await fetch(`/bible/books/${libro.id}.json`);
        if (resp.ok) {
          const bookJson = await resp.json();
          if (bookJson.chapters && Array.isArray(bookJson.chapters)) {
            const capitulosParaInsertar: CapituloSchema[] = [];
            const versiculosParaInsertar: VersiculoSchema[] = [];

            bookJson.chapters.forEach((versList: any[], chIdx: number) => {
              const numeroCapitulo = chIdx + 1;
              const capId = `${libro.id}_${numeroCapitulo}`;

              capitulosParaInsertar.push({
                id: capId,
                libro_id: libro.id,
                numero_capitulo: numeroCapitulo,
                totalVersiculos: versList.length,
              });

              versList.forEach((v) => {
                totalVersiculosCount++;
                versiculosParaInsertar.push({
                  id: `${libro.id}_${numeroCapitulo}_${v.verseNumber}`,
                  capitulo_id: capId,
                  libro_id: libro.id,
                  numero_capitulo: numeroCapitulo,
                  numero_versiculo: v.verseNumber,
                  texto: v.textEs || '',
                  textoEn: v.textEn || '',
                });
              });

              // Actualizar caché de memoria para acceso instantáneo
              this.memoryVersiculos.set(capId, versiculosParaInsertar.filter(v => v.capitulo_id === capId));
            });

            this.memoryCapitulos.set(libro.id, capitulosParaInsertar);

            // Inserción en lote en IndexedDB
            if (db) {
              await this.batchInsert(db, libro, capitulosParaInsertar, versiculosParaInsertar);
            }
          }
        }
      } catch (err) {
        console.error(`Error cargando libro ${libro.id}:`, err);
      }
    }

    if (onProgress) {
      onProgress(totalLibros, totalLibros, 'Sincronización Completa', totalVersiculosCount);
    }

    if (db) {
      try {
        const tx = db.transaction(META_STORE, 'readwrite');
        tx.objectStore(META_STORE).put({ key: 'is_synced', value: true, timestamp: Date.now() });
      } catch {}
    }

    return true;
  }

  private async batchInsert(
    db: IDBDatabase,
    libro: LibroSchema,
    capitulos: CapituloSchema[],
    versiculos: VersiculoSchema[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction([STORE_LIBROS, STORE_CAPITULOS, STORE_VERSICULOS], 'readwrite');
        const librosStore = tx.objectStore(STORE_LIBROS);
        const capsStore = tx.objectStore(STORE_CAPITULOS);
        const versStore = tx.objectStore(STORE_VERSICULOS);

        librosStore.put(libro);
        capitulos.forEach((c) => capsStore.put(c));
        versiculos.forEach((v) => versStore.put(v));

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Consulta de Libros (todos o filtrados por Antiguo / Nuevo Testamento).
   */
  public getLibros(testamento?: Testamento): LibroSchema[] {
    const list = Array.from(this.memoryLibros.values()).sort((a, b) => a.orden - b.orden);
    if (!testamento) return list;
    return list.filter((l) => l.testamento === testamento);
  }

  /**
   * Consulta de un Libro específico por ID o Abreviatura.
   */
  public getLibro(libroId: string): LibroSchema | null {
    const idClean = (libroId || '').toUpperCase();
    return this.memoryLibros.get(idClean) || null;
  }

  /**
   * Consulta de Capítulos de un Libro.
   */
  public async getCapitulos(libroId: string): Promise<CapituloSchema[]> {
    const idClean = (libroId || 'MAT').toUpperCase();

    // 1. Memoria
    if (this.memoryCapitulos.has(idClean)) {
      return this.memoryCapitulos.get(idClean)!;
    }

    // 2. Generar lista canónica según metadata
    const libro = this.getLibro(idClean);
    const totalCaps = libro ? libro.totalCapitulos : 28;
    const caps: CapituloSchema[] = Array.from({ length: totalCaps }, (_, i) => ({
      id: `${idClean}_${i + 1}`,
      libro_id: idClean,
      numero_capitulo: i + 1,
      totalVersiculos: 0,
    }));

    this.memoryCapitulos.set(idClean, caps);
    return caps;
  }

  /**
   * Consulta síncrona inmediata de Versículos (si ya están en memoria).
   */
  public getVersiculosSync(libroId: string, numeroCapitulo: number): VersiculoSchema[] | null {
    const capId = `${(libroId || 'MAT').toUpperCase()}_${numeroCapitulo}`;
    const inMem = this.memoryVersiculos.get(capId);
    if (inMem && inMem.length > 0) {
      return inMem;
    }
    return null;
  }

  /**
   * Consulta asíncrona de Versículos: Memoria -> IndexedDB -> Carga JSON estático.
   * Garantiza la obtención del 100% de versículos (e.g. Mateo 4 devuelve los 25 versículos completos).
   */
  public async getVersiculos(libroId: string, numeroCapitulo: number): Promise<VersiculoSchema[]> {
    const cleanId = (libroId || 'MAT').toUpperCase();
    const capNum = Math.max(1, parseInt(String(numeroCapitulo), 10) || 1);
    const capId = `${cleanId}_${capNum}`;

    // 1. Caché en Memoria
    if (this.memoryVersiculos.has(capId)) {
      const vers = this.memoryVersiculos.get(capId)!;
      if (vers.length > 0) return vers;
    }

    // 2. IndexedDB
    const db = await this.initDatabase();
    if (db) {
      try {
        const fromDb = await this.getVersiculosFromDb(db, capId);
        if (fromDb && fromDb.length > 0) {
          this.memoryVersiculos.set(capId, fromDb);
          return fromDb;
        }
      } catch (e) {
        console.warn('Error leyendo versículos de IndexedDB:', e);
      }
    }

    // 3. Carga desde JSON estático
    try {
      const resp = await fetch(`/bible/books/${cleanId}.json`);
      if (resp.ok) {
        const bookJson = await resp.json();
        if (bookJson.chapters && bookJson.chapters[capNum - 1]) {
          const rawList: any[] = bookJson.chapters[capNum - 1];
          const versiculos: VersiculoSchema[] = rawList.map((v) => ({
            id: `${cleanId}_${capNum}_${v.verseNumber}`,
            capitulo_id: capId,
            libro_id: cleanId,
            numero_capitulo: capNum,
            numero_versiculo: v.verseNumber,
            texto: v.textEs || '',
            textoEn: v.textEn || '',
          }));

          this.memoryVersiculos.set(capId, versiculos);

          // Almacenar en IndexedDB en segundo plano
          if (db) {
            this.saveVersiculosToDb(db, versiculos).catch(() => {});
          }

          return versiculos;
        }
      }
    } catch (err) {
      console.error(`BibleDatabaseEngine: Error cargando /bible/books/${cleanId}.json`, err);
    }

    return [];
  }

  private getVersiculosFromDb(db: IDBDatabase, capId: string): Promise<VersiculoSchema[]> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_VERSICULOS, 'readonly');
        const store = tx.objectStore(STORE_VERSICULOS);
        const index = store.index('capitulo_id');
        const req = index.getAll(capId);

        req.onsuccess = () => {
          const list: VersiculoSchema[] = req.result || [];
          list.sort((a, b) => a.numero_versiculo - b.numero_versiculo);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  private saveVersiculosToDb(db: IDBDatabase, versiculos: VersiculoSchema[]): Promise<void> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_VERSICULOS, 'readwrite');
        const store = tx.objectStore(STORE_VERSICULOS);
        versiculos.forEach((v) => store.put(v));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Búsqueda por palabras clave en todos los versículos
   */
  public async searchVersiculos(termino: string, limite = 25): Promise<VersiculoSchema[]> {
    const q = (termino || '').trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const resultados: VersiculoSchema[] = [];

    // Buscar primero en memoria
    for (const [, versList] of this.memoryVersiculos) {
      for (const v of versList) {
        if (v.texto.toLowerCase().includes(q)) {
          resultados.push(v);
          if (resultados.length >= limite) return resultados;
        }
      }
    }

    return resultados;
  }
}

// Instancia singleton para toda la aplicación
export const bibleDb = new BibleDatabaseEngine();
