// The usage tables' rows: a name, then the cells every usage table shares (`usageCells`), dearest first. The by-model
// table puts each model's effort levels under it as sub-rows and a swatch of the model's color before its name. Plain
// functions, so the components only draw them.

import type { ModelEffortUsage, ModelUsage, Usage } from './api';
import { effortName, effortRank, slotColor, type Slot } from './colors';
import { byCost, USAGE_COLUMNS, usageCells } from './tables';

/** A row of a usage table: what it is named, its cells after the name, and how it sits among the rows. */
export interface UsageRow {
  key: string;
  /** The row's name, or for an effort row its level in words. */
  name: string;
  kind: 'plain' | 'model' | 'effort';
  /** The model's color, for a model row. */
  swatch: string | null;
  /** The cells after the name, in `USAGE_COLUMNS`. */
  cells: string[];
  /** An effort row stays with its model on a page. */
  sub: boolean;
  /** A model row heads its effort rows. */
  group: boolean;
}

/** The columns of a usage table: the name's heading, then the usage columns. */
export function usageColumns(nameLabel: string): { label: string; numeric?: boolean }[] {
  return [{ label: nameLabel }, ...USAGE_COLUMNS];
}

/** A table of rows named by `name` (an agent type, a project, a skill, an MCP server), dearest first. */
export function usageRows<Row extends Usage>(rows: readonly Row[], name: (row: Row) => string): UsageRow[] {
  return rows
    .slice()
    .sort(byCost)
    .map((row) => ({
      key: name(row),
      name: name(row),
      kind: 'plain',
      swatch: null,
      cells: usageCells(row),
      sub: false,
      group: false,
    }));
}

/**
 * The models dearest first, each followed by its usage per effort level from least to most (background calls as one
 * of them); calls without an effort level show no row of their own. `slots` say each model's color.
 */
export function modelRows(
  models: readonly ModelUsage[],
  efforts: readonly ModelEffortUsage[],
  slots: ReadonlyMap<string, Slot>,
): UsageRow[] {
  return models
    .slice()
    .sort(byCost)
    .flatMap((model) => {
      const head: UsageRow = {
        key: model.model,
        name: model.model,
        kind: 'model',
        swatch: slotColor(slots.get(model.model) ?? null),
        cells: usageCells(model),
        sub: false,
        group: true,
      };
      const levels = efforts
        .filter((row) => row.model === model.model && row.effort !== null)
        .sort((left, right) => effortRank(left.effort ?? '') - effortRank(right.effort ?? '') ||
          (left.effort ?? '').localeCompare(right.effort ?? ''));
      return [
        head,
        ...levels.map(
          (row): UsageRow => ({
            key: `${model.model}\u0000${row.effort}`,
            name: effortName(row.effort),
            kind: 'effort',
            swatch: null,
            cells: usageCells(row),
            sub: true,
            group: false,
          }),
        ),
      ];
    });
}
