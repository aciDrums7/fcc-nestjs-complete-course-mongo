FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

WORKDIR /workspaces/fcc-nestjs-mongo

ENV PNPM_HOME=/workspaces/pnpm
RUN corepack enable pnpm

# pre-loads required packages from pnpm-lock.yaml into the store,
# ready to be installed with `pnpm install`
RUN pnpm fetch