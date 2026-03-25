import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { projectsApi } from '@/api/projects.api';

export function useProjects(params?: Ref<any>) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getAll(params?.value).then((r) => r.data),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
