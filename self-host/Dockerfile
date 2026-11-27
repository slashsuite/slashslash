# syntax=docker/dockerfile:1.7
#
# Every Slash server in one image: PixelSlash and ToggleSlash behind Caddy, supervised by
# s6-overlay, all as the one non-root user `app` (UID and GID 1654), with every byte of state on one
# volume at /data. See README.md.
#
# The products are not rebuilt here. Each is its own repo's self-host image, built from a pinned
# commit (pins/*.sha) and handed in as a named build context; `bun self-host/build.ts` does all of
# it. The build context is the repo root (for LICENSE and NOTICE); Dockerfile.dockerignore keeps it
# to those and self-host/.
#
#   pixelslash       PixelSlash's docker/self-host/Dockerfile image
#   toggleslash      ToggleSlash's apps/server/Dockerfile image
#   pixelslash-src   PixelSlash's repo at the pin (its LICENSE and NOTICE)
#   toggleslash-src  ToggleSlash's repo at the pin (its LICENSE and NOTICE)

ARG PIXELSLASH_REVISION
ARG TOGGLESLASH_REVISION
ARG BUN=1.4.4

# Caddy's binary without its file capability (cap_net_bind_service): it binds no low port here, and
# nothing in the image may gain privilege. s6-overlay unpacked from its release tarballs, checked,
# and both licences fetched at the same versions, as is Bun's (BUN must be the Bun in PixelSlash's
# image; the final stage checks it, so a pin that moves Bun fails here until BUN and its checksum move).
FROM caddy:2.11.9@sha256:4e2425f6009577e7c651010f16679c28f7d12df3e7b1914f941a7a3370746b3c AS tools
ARG S6=3.2.1.0
ARG BUN
ADD --checksum=sha256:42e038a9a00fc0fef70bf0bc42f625a9c14f8ecdfe77d4ad93281edf717e10c5 \
    https://github.com/just-containers/s6-overlay/releases/download/v${S6}/s6-overlay-noarch.tar.xz /tmp/
ADD --checksum=sha256:8bcbc2cada58426f976b159dcc4e06cbb1454d5f39252b3bb0c778ccf71c9435 \
    https://github.com/just-containers/s6-overlay/releases/download/v${S6}/s6-overlay-x86_64.tar.xz /tmp/
RUN apk add --no-cache libcap xz \
 && setcap -r /usr/bin/caddy \
 && test -z "$(getcap /usr/bin/caddy)" \
 && mkdir /s6 \
 && tar -C /s6 -Jxpf /tmp/s6-overlay-noarch.tar.xz \
 && tar -C /s6 -Jxpf /tmp/s6-overlay-x86_64.tar.xz
ADD --checksum=sha256:cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 \
    https://raw.githubusercontent.com/caddyserver/caddy/v2.11.9/LICENSE /licenses/caddy/LICENSE
ADD --checksum=sha256:7a3a86cd4e1e2c17dd3f4a972e946773e8bed86e52099d1624c8c9f9fda7d9e3 \
    https://raw.githubusercontent.com/just-containers/s6-overlay/v${S6}/COPYING /licenses/s6-overlay/COPYING
ADD --checksum=sha256:362fe32c954ec829240bd7429c53d705eef08c6bfa45ffc2d02005f857cba4dd \
    https://raw.githubusercontent.com/oven-sh/bun/bun-v${BUN}/LICENSE.md /licenses/bun/LICENSE.md

# The ToggleSlash runtime stage is the base: aspnet 10.0.14 on Ubuntu 24.04, whose `app` user (1654)
# is the one user everything runs as.
FROM toggleslash
ARG PIXELSLASH_REVISION
ARG TOGGLESLASH_REVISION
ARG SLASHSLASH_VERSION
ARG BUN
USER root
COPY --from=tools /s6/ /
COPY --from=tools /usr/bin/caddy /usr/local/bin/caddy
COPY --from=pixelslash /usr/local/bin/bun /usr/local/bin/bun
COPY --from=pixelslash /opt/pixelslash /opt/pixelslash
COPY self-host/rootfs/ /
COPY self-host/Caddyfile self-host/domain.caddy /etc/caddy/
COPY LICENSE NOTICE /usr/share/licenses/slashslash/
COPY --from=pixelslash-src LICENSE NOTICE /usr/share/licenses/slashslash/pixelslash/
COPY --from=toggleslash-src LICENSE NOTICE /usr/share/licenses/slashslash/toggleslash/
COPY --from=tools /licenses/ /usr/share/licenses/slashslash/

# The .NET runtime's licence is copied next to the others, not only left in /usr/share/dotnet, and
# the version this image reports is written once, for `slashslash version`.
RUN test -n "${SLASHSLASH_VERSION}" \
 && test "$(bun --version)" = "${BUN}" \
 && mkdir -p /usr/share/licenses/slashslash/dotnet /etc/slashslash \
 && cp /usr/share/dotnet/LICENSE.txt /usr/share/licenses/slashslash/dotnet/ \
 && printf '%s\n' "${SLASHSLASH_VERSION}" > /etc/slashslash/version

# /data and its folders, /run (s6 and Caddy write there) and HOME belong to `app` in the image, so a
# Docker named volume starts owned right and nothing needs root, a chown or a tmpfs at start. No file
# keeps a setuid or setgid bit (s6-overlay-suexec included: as `app` it runs preinit unprivileged).
RUN mkdir -p /data/pixelslash /data/toggleslash /data/secrets /data/caddy \
 && chmod 700 /data/secrets \
 && chown -R 1654:1654 /data /run /home/app \
 && find / -xdev -type f -perm /6000 -exec chmod ug-s {} + \
 && test -z "$(find / -xdev -type f -perm /6000)"

ENV HOME=/home/app \
    PIXELSLASH_PORT=3000 \
    TOGGLESLASH_PORT=8080 \
    SLASHSLASH_PORT=8000 \
    S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \
    S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
    S6_VERBOSITY=1

LABEL org.opencontainers.image.title="slashslash" \
      org.opencontainers.image.description="PixelSlash and ToggleSlash in one image" \
      org.opencontainers.image.source="https://github.com/slashsuite/slashslash" \
      org.opencontainers.image.licenses="MIT AND Elastic-2.0 AND Apache-2.0 AND ISC AND LGPL-2.1-only" \
      org.opencontainers.image.version="${SLASHSLASH_VERSION}" \
      build.slashslash.pixelslash.revision="${PIXELSLASH_REVISION}" \
      build.slashslash.toggleslash.revision="${TOGGLESLASH_REVISION}"

USER app
WORKDIR /home/app
VOLUME /data
EXPOSE 3000 8080 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --start-interval=2s \
  CMD ["/usr/local/bin/healthcheck"]
ENTRYPOINT ["/init"]
