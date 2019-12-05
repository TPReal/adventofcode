FROM gitpod/workspace-full:latest

USER gitpod

RUN npm install --global parcel-bundler

USER root
