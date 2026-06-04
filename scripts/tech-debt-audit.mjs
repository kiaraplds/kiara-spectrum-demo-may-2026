#!/usr/bin/env node
/**
 * Tech debt audit for react-spectrum production sources.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = '/workspace';
const SCAN_DIRS = [
  'packages/@adobe/react-spectrum/src',
  'packages/@react-spectrum/s2/src',
  'packages/react-aria-components/src',
  'packages/react-aria/src',
];

const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)/g;
const ANY_RE = /:\s*any\b|as any\b|<any>|Array<any>|Record<string,\s*any>|ReactElement<any|JSXElementConstructor<any>|ContextValue<[^>]*any|TreeState<any>|ComboBoxState<any>|props:\s*any\b|ref:\s*any\b|function\s+\w+\([^)]*:\s*any/g;
const ONCLICK_RE = /\bonClick\s*=/g;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(name)) files.push(p);
  }
  return files;
}

function lineOf(content, index) {
  return content.slice(0, index).split('\n').length;
}

function hasPropsInterface(content, componentName) {
  const patterns = [
    new RegExp(`interface\\s+${componentName}Props\\b`),
    new RegExp(`interface\\s+Spectrum${componentName}Props\\b`),
    new RegExp(`type\\s+${componentName}Props\\b`),
    new RegExp(`Spectrum${componentName}Props\\b`),
  ];
  return patterns.some((re) => re.test(content));
}

function isExportedComponent(line) {
  return /export (const|function) ([A-Z][A-Za-z0-9]*)/.test(line);
}

function extractExportedComponents(content) {
  const comps = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/export (?:const|function) ([A-Z][A-Za-z0-9]*)/);
    if (m) comps.push({ name: m[1], line: i + 1 });
  }
  return comps;
}

function hasKeyboardSupport(content, clickLineIdx) {
  const window = content.split('\n').slice(Math.max(0, clickLineIdx - 30), clickLineIdx + 30).join('\n');
  return /onKeyDown|onKeyUp|usePress|Pressable|role=["']button|role=\{[^}]*button|<button\b|ActionButton|ToggleButton|useButton|tabIndex=\{0\}/.test(window);
}

function hasAriaBasics(content, startLine) {
  const window = content.split('\n').slice(Math.max(0, startLine - 40), startLine + 40).join('\n');
  return /aria-[a-z]+|role=|useLabel|useButton|useTextField|useDialog|useMenu|useListBox|useCheckbox|useRadio|useSlider|useTab|useTable|useToast|useTooltip|useSelect|useComboBox|useSearchField|useSwitch|useProgress|useMeter|useBreadcrumbs|useLink|useCalendar|useDatePicker|useNumberField|useColor|useGridList|useTree|useTagGroup|useField|useDateField|useTimeField|useAutocomplete|useDisclosure|useAccordion|useDropZone|hidden=|alt=/.test(window);
}

function isInteractiveDiv(content, lineNum) {
  const lines = content.split('\n');
  const window = lines.slice(Math.max(0, lineNum - 15), lineNum + 5).join('\n');
  return /<div[^>]*(onClick|onPointerDown|cursor:\s*pointer)|elementType=["']div["']/.test(window) || /\bonClick/.test(lines[lineNum - 1] || '');
}

const findings = {
  colors: [],
  any: [],
  missingProps: [],
  missingAria: [],
  onClickNoKeyboard: [],
};

for (const relDir of SCAN_DIRS) {
  const absDir = join(ROOT, relDir);
  for (const file of walk(absDir)) {
    const content = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file);

    // Skip test-like paths
    if (/\/(test|tests|stories)\//.test(rel)) continue;

  for (const m of content.matchAll(COLOR_RE)) {
      const line = lineOf(content, m.index);
      const text = m[0];
      // Allow transparent placeholders common in color components
      if (text === '#fff0' || text === '#0000') continue;
      const severity =
        /CoachMark|rgba\(20,\s*115,\s*230/.test(content.slice(Math.max(0, m.index - 200), m.index + 200))
          ? 'high'
          : /#fff|#E1E1E1|#e6e6e6|repeating-conic/.test(text)
            ? 'medium'
            : 'low';
      findings.colors.push({ file: rel, line, severity, match: text, fix: 'Replace with Spectrum design token (e.g. var(--spectrum-*) or style macro token)' });
    }

    for (const m of content.matchAll(ANY_RE)) {
      const line = lineOf(content, m.index);
      const ctx = content.slice(Math.max(0, m.index - 80), m.index + 80);
      let severity = 'medium';
      if (/props:\s*any|function Input\(props: any|wrapperStyle:\s*any|let style:\s*any/.test(ctx)) severity = 'high';
      if (/Validation<any>|ContextValue<Partial<\w+Props<any>>/.test(m[0])) severity = 'low';
      findings.any.push({ file: rel, line, severity, match: m[0].trim().slice(0, 60), fix: 'Add proper generic or interface types; avoid `as any` casts' });
    }

    const exported = extractExportedComponents(content);
    for (const { name, line } of exported) {
      if (!hasPropsInterface(content, name) && !/Context|Provider|Wrapper|Base|Inner|ElementType|Node/.test(name)) {
        // Check if props type is imported or aliased
        if (!new RegExp(`${name}Props|Spectrum${name}Props`).test(content)) {
          findings.missingProps.push({
            file: rel,
            line,
            severity: name.length > 2 ? 'medium' : 'low',
            match: `export ${name}`,
            fix: `Add exported ${name}Props interface extending appropriate Aria/Spectrum props`,
          });
        }
      }
    }

    // onClick without keyboard
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/\bonClick\s*=/.test(lines[i])) {
        if (!hasKeyboardSupport(content, i)) {
          findings.onClickNoKeyboard.push({
            file: rel,
            line: i + 1,
            severity: isInteractiveDiv(content, i + 1) ? 'high' : 'medium',
            match: lines[i].trim().slice(0, 80),
            fix: 'Use usePress/useButton, or add onKeyDown + role="button" + tabIndex={0}',
          });
        }
      }
    }

    // Interactive-looking exports missing aria in file (heuristic)
    if (/onClick|onPointerDown|cursor:\s*['"]?pointer/.test(content)) {
      const comps = exported.filter((c) => !/Provider|Context/.test(c.name));
      for (const { name, line } of comps) {
        const fnStart = content.indexOf(`function ${name}`);
        const chunk = content.slice(fnStart > -1 ? fnStart : 0, fnStart > -1 ? fnStart + 2500 : 2500);
        if (fnStart > -1 && /onClick|div/.test(chunk) && !hasAriaBasics(chunk, 0)) {
          const already = findings.missingAria.some((f) => f.file === rel && Math.abs(f.line - line) < 50);
          if (!already) {
            findings.missingAria.push({
              file: rel,
              line,
              severity: 'medium',
              match: name,
              fix: 'Ensure interactive surface has aria-label/role and keyboard support via React Aria hooks',
            });
          }
        }
      }
    }
  }
}

// Dedupe colors on same line
function dedupe(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

findings.colors = dedupe(findings.colors, (f) => `${f.file}:${f.line}:${f.match}`);
findings.any = dedupe(findings.any, (f) => `${f.file}:${f.line}`);
findings.missingProps = dedupe(findings.missingProps, (f) => `${f.file}:${f.name || f.match}`);
findings.onClickNoKeyboard = dedupe(findings.onClickNoKeyboard, (f) => `${f.file}:${f.line}`);
findings.missingAria = dedupe(findings.missingAria, (f) => `${f.file}:${f.match}`);

const priority = (f) => ({ high: 3, medium: 2, low: 1 }[f.severity] || 0);
const allFindings = [
  ...findings.colors.map((f) => ({ ...f, category: 'hardcoded-colors' })),
  ...findings.any.map((f) => ({ ...f, category: 'typescript-any' })),
  ...findings.missingProps.map((f) => ({ ...f, category: 'missing-props-interface' })),
  ...findings.missingAria.map((f) => ({ ...f, category: 'missing-aria' })),
  ...findings.onClickNoKeyboard.map((f) => ({ ...f, category: 'onclick-no-keyboard' })),
].sort((a, b) => priority(b) - priority(a));

const summary = {
  totals: {
    'hardcoded-colors': findings.colors.length,
    'typescript-any': findings.any.length,
    'missing-props-interface': findings.missingProps.length,
    'missing-aria': findings.missingAria.length,
    'onclick-no-keyboard': findings.onClickNoKeyboard.length,
  },
  top5: allFindings.filter((f) => f.severity === 'high').slice(0, 5),
  samples: {
    colorsHigh: findings.colors.filter((f) => f.severity === 'high').slice(0, 5),
    anyHigh: findings.any.filter((f) => f.severity === 'high').slice(0, 8),
    onClick: findings.onClickNoKeyboard.slice(0, 10),
    missingProps: findings.missingProps.slice(0, 8),
    missingAria: findings.missingAria.slice(0, 8),
  },
};

console.log(JSON.stringify(summary, null, 2));
