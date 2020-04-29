export function artifactsList() {
  return import(/* webpackChunkName: "list-artifact" */ './widgets/artifacts/ArtifactList');
}

export function nexusArtifactsList() {
  return import(/* webpackChunkName: "list-nexus-artifact" */ './widgets/nexus/ListNexusArtifact');
}
export function historyList() {
  return import(/* webpackChunkName: "list-history" */ './widgets/history/HistoryList');
}

export function schedulersList() {
  return import(/* webpackChunkName: "list-schedulers" */ './widgets/schedulers/SchedulersList');
}

export function logger() {
  return import(/* webpackChunkName: "logger" */ './widgets/logger/Logger');
}
