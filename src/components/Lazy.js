export function artifactsList() {
  return import(/* webpackChunkName: "list-artifact" */ './widgets/artifacts/List');
}

export function nexusArtifactsList() {
  return import(/* webpackChunkName: "list-nexus-artifact" */ './widgets/nexus/ListNexusArtifact');
}
export function historyList() {
  return import(/* webpackChunkName: "list-history" */ './widgets/history/HistoryList');
}

export function logger() {
  return import(/* webpackChunkName: "logger" */ './widgets/logger/Logger');
}
