/**
 * Temporary demo-persistence layer.
 *
 * fakeapi.dev's POST/PUT/DELETE endpoints only ECHO a response — nothing is
 * actually written to their database. So that the admin CRUD screens are
 * genuinely testable today, writes are also recorded here, in localStorage,
 * and merged over the API's read responses.
 *
 * DELETE THIS FILE once the real Laravel API is live and persists writes
 * itself: remove the three `applyOverlay` calls in productsService.js /
 * categoriesService.js and every admin mutation keeps working unchanged,
 * because they already call the real endpoints first.
 */

const KEY = "admin_overlay_v1";

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      products: raw.products || {},   // id -> product | null (null = deleted)
      categories: raw.categories || {},
      nextId: raw.nextId || -1,       // negative ids for local products, never collide with API ids
    };
  } catch {
    return { products: {}, categories: {}, nextId: -1 };
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function nextLocalId() {
  const state = read();
  state.nextId -= 1;
  write(state);
  return state.nextId + 1;
}

export function upsertOverlay(kind, id, value) {
  const state = read();
  state[kind][id] = value;
  write(state);
}

export function deleteOverlay(kind, id) {
  upsertOverlay(kind, id, null);
}

// Applies recorded creates/edits/deletes on top of a list fetched from the API.
// `includeCreated` / `matches` let callers show locally created records only
// where they belong (e.g. page 1 of a list, and only if they match the filters).
export function applyOverlayToList(kind, list, { includeCreated = true, matches = () => true } = {}) {
  const state = read();
  const overlay = state[kind];
  const merged = list
    .map((item) => (item.id in overlay ? overlay[item.id] : item))
    .filter(Boolean);
  // Records created locally aren't in the API response, so prepend them.
  const created = includeCreated
    ? Object.values(overlay).filter((item) => item && item.isLocal && matches(item))
    : [];
  return [...created, ...merged];
}

export function applyOverlayToItem(kind, id, item) {
  const state = read();
  if (id in state[kind]) return state[kind][id]; // null if deleted, object if edited
  return item;
}

export function clearOverlay() {
  localStorage.removeItem(KEY);
}
