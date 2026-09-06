export function routeTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function jobPath(jobId) {
  return `/jobs/${Number(jobId)}`;
}
