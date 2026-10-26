import test from 'node:test';
import assert from 'node:assert/strict';
import { translations, translate } from '../src/lib/translations.js';
import arabic from '../src/i18n/locales/ar-phrases.json' with { type: 'json' };
import en from '../src/i18n/locales/en.json' with { type: 'json' };
import fr from '../src/i18n/locales/fr.json' with { type: 'json' };
import ar from '../src/i18n/locales/ar.json' with { type: 'json' };

test('every legacy French phrase has Arabic text with matching placeholders', () => {
  for (const [key, value] of Object.entries(translations)) {
    assert.ok(arabic[key], `Arabic missing: ${key}`);
    const placeholders = text => [...text.matchAll(/\{\d+\}/g)].map(m => m[0]).sort();
    assert.deepEqual(placeholders(arabic[key]), placeholders(key), key);
    assert.deepEqual(placeholders(value), placeholders(key), key);
  }
});
test('dynamic messages translate without losing names or stock quantities', () => {
  assert.equal(translate('Added "Phone" to cart!', 'ar'), 'تمت إضافة «Phone» إلى السلة!');
  assert.equal(translate('Collection: Summer', 'fr'), 'Collection : Summer');
  assert.equal(translate('Cannot add more. Maximum available stock for "Phone" is 3.', 'ar'), 'لا يمكن إضافة المزيد. المخزون المتاح من «Phone» هو 3.');
  assert.equal(translate('Dark mode', 'ar-MA'), 'الوضع الداكن');
  assert.equal(translate('Dark mode', 'en'), 'Dark mode');
  assert.equal(translate('Unknown product name', 'ar'), 'Unknown product name');
});
test('key-based translations have consistent locale coverage', () => {
  function walk(source, target, path = '') {
    for (const [key, value] of Object.entries(source)) {
      // Arabic has its own plural categories, but must retain the shared fallback.
      if (/_(zero|one|two|few|many)$/.test(key)) continue;
      assert.ok(target[key], `${path}${key}`);
      if (typeof value === 'object') walk(value, target[key], `${path}${key}.`);
    }
  }
  walk(en, fr); walk(en, ar);
});

test('static translated JSX labels are covered in both phrase dictionaries', async () => {
  const { readdir, readFile } = await import('node:fs/promises');
  const literalValues = new Set(['S', 'M', 'L', 'XL', 'FASHION', 'URL', 'x', '123 Fashion Street, City, CT 20002', 'info@fashionstore.com']);
  async function scan(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await scan(path);
      else if (path.endsWith('.jsx')) {
        const source = await readFile(path, 'utf8');
        for (const match of source.matchAll(/<T>\s*([^<{]+?)\s*<\/T>/g)) {
          const phrase = match[1];
          if (literalValues.has(phrase)) continue;
          assert.ok(translations[phrase], `French missing: ${phrase} in ${path}`);
          assert.ok(arabic[phrase], `Arabic missing: ${phrase} in ${path}`);
        }
      }
    }
  }
  await scan(new URL('../src', import.meta.url).pathname);
});
