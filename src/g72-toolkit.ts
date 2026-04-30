
export interface PlannerEvent {
  id: string;
  title: string;
  startsAt?: number;
  endsAt?: number;
}

export const usePlannerStore = () => ({
  list: () => [] as PlannerEvent[],
  add: (item: any) => console.log('Mock Planner Add', item),
});

export const imageRegistry = {
  register: (url: string) => {},
  hydrate: () => {},
};

export const handleBackupPlannerJSON = (fn: () => any) => {
  const data = fn();
  console.log('Backup Planner', data);
};

export const handleExportCurrentProject = (project: any) => {
  console.log('Exporting Project', project);
};

// FIX: Updated to return a complete project structure to satisfy Project interface requirements in App.tsx
export const handleImportProject = async (file: File) => {
  return { 
    id: 'imported_' + Date.now(), 
    title: 'Imported Project', 
    pages: [], 
    currentIndex: 0,
    cover: '',
    createdAt: Date.now()
  };
};
