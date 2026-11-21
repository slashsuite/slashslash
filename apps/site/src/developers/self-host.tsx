import { CodeBlock, Stack, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { SELF_HOST_REPO_URL } from "#/content/site";
import { DevSection } from "#/developers/section";
import { Rich } from "#/shell/rich-text";

export const SELF_HOST: {
  title: string;
  lead: Claim;
  docker: readonly string[];
  details: readonly Claim[];
} = {
  title: "Self-host PixelSlash and ToggleSlash in one container",
  lead: {
    text: "One rootless amd64 image (UID 1654) runs PixelSlash on port 3000 and ToggleSlash on port 8080 against a single volume at `/data`, with automatic pre-upgrade backups and built-in backup and restore commands.",
    facts: ["pixelslash/self-host-docker", "toggleslash/server-container"],
    repo: ["self-host/README.md"],
  },
  docker: [
    "docker run -d --name slashslash --restart unless-stopped \\",
    "  -p 3000:3000 -p 8080:8080 \\",
    "  -e GITHUB_CLIENT_ID=<id> -e GITHUB_CLIENT_SECRET=<secret> \\",
    "  -v slashslash-data:/data \\",
    "  ghcr.io/slashsuite/slashslash:latest",
  ],
  details: [
    {
      text: "Proxmox: one-line LXC installer in `self-host/proxmox/install.sh` creates an unprivileged Debian 13 container on its own data mount.",
      facts: ["pixelslash/self-host-docker", "toggleslash/server-container"],
      repo: ["self-host/proxmox/install.sh"],
    },
    {
      text: "Kubernetes: Helm chart published at `oci://ghcr.io/slashsuite/charts`.",
      facts: ["pixelslash/self-host-docker", "toggleslash/server-container"],
      repo: ["self-host/README.md"],
    },
    {
      text: "Guided setup for agents or people: `skills/self-host/SKILL.md` in the slashslash repository.",
      facts: ["pixelslash/self-host-docker", "toggleslash/server-container"],
      repo: ["skills/self-host/SKILL.md"],
    },
    {
      text: "Licences: the image wrapper is MIT; PixelSlash and ToggleSlash inside it are Elastic License 2.0 (free to self-host, not offered to others as a managed service).",
      facts: ["pixelslash/licence", "toggleslash/licence"],
      repo: ["self-host/README.md"],
    },
  ],
};

/** Self-hosting section for the combined PixelSlash + ToggleSlash image. Hydrates for the CodeBlock copy button. */
export function SelfHost(): ReactNode {
  return (
    <DevSection id="self-host" title={SELF_HOST.title} lead={<Rich text={SELF_HOST.lead.text} />}>
      <Stack gap="md">
        <CodeBlock label="bash" language="bash" lines={[...SELF_HOST.docker]} copy />
        <ul className="list-disc space-y-2 pl-6">
          {SELF_HOST.details.map((detail) => (
            <li key={detail.text}>
              <Text>
                <Rich text={detail.text} />
              </Text>
            </li>
          ))}
        </ul>
        <Text>
          <TextLink href={SELF_HOST_REPO_URL} external>
            Self-host docs and scripts on GitHub
          </TextLink>
        </Text>
      </Stack>
    </DevSection>
  );
}
