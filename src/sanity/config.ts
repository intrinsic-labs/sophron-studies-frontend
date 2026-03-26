const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19';

const projectId: string = rawProjectId || '';
const dataset: string = rawDataset || 'production';

export { apiVersion, dataset, projectId };
