import { Code, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { Evidence } from "#/developers/evidence";
import { DevSection } from "#/developers/section";

type Row = { name: string; staging: string; production: string; differs: boolean };

const ROWS: readonly Row[] = [
  { name: "FS_TIMEOUT", staging: "30s", production: "5s", differs: true },
  { name: "FS_API_URL", staging: "test.example", production: "www.example", differs: true },
  { name: "FS_SHOP_ID", staging: "2", production: "2", differs: false },
  { name: "DB_PASSWORD", staging: "not read", production: "not read", differs: false },
];

export function Env(): ReactNode {
  return (
    <DevSection
      id="env"
      title="How long is the timeout in production?"
      lead="Often nobody can say. The timeout is an environment variable, and these tend to be treated as secrets nobody can read."
    >
      <Evidence kind="idea" title="imagined, no tool prints this">
        <Table label="Environment variables in staging and production">
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                <span className="sr-only">variable</span>
              </TableHeaderCell>
              <TableHeaderCell>staging</TableHeaderCell>
              <TableHeaderCell>production</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.name} data-differs={row.differs}>
                <TableCell mono>
                  <span aria-hidden="true">{row.differs ? "~" : "\u00a0"}</span>
                  {row.name}
                </TableCell>
                {/* Elements, not mono cells: a mono cell never wraps, and the three do not fit a phone side by side. */}
                <TableCell>
                  <span className="font-mono text-sm">{row.staging}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{row.production}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Evidence>
      <Text>
        Most of these are not secrets: a URL, a timeout, an ID. The idea is to mark them with an <Code>FS_</Code>{" "}
        prefix and show them side by side. Anything shown must not be a secret, so a password would never get the
        prefix or be read.
      </Text>
    </DevSection>
  );
}
