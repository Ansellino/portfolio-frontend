export type SkillCategoryOption = {
  value: string;
  label: string;
};

export type SkillCategoryGroup = {
  group: string;
  options: SkillCategoryOption[];
};

export const skillCategoryGroups: SkillCategoryGroup[] = [
  {
    group: 'Programming',
    options: [
      { value: 'programming_language', label: 'Programming Language' },
      { value: 'object_oriented_programming', label: 'Object-Oriented Programming' },
      { value: 'functional_programming', label: 'Functional Programming' },
      { value: 'scripting', label: 'Scripting' },
    ],
  },
  {
    group: 'Frontend',
    options: [
      { value: 'frontend_framework', label: 'Frontend Framework' },
      { value: 'frontend_library', label: 'Frontend Library' },
      { value: 'state_management', label: 'State Management' },
      { value: 'styling_ui', label: 'Styling / UI' },
      { value: 'mobile_frontend', label: 'Mobile Frontend' },
    ],
  },
  {
    group: 'Backend',
    options: [
      { value: 'backend_framework', label: 'Backend Framework' },
      { value: 'api_design', label: 'API Design' },
      { value: 'authentication_security', label: 'Authentication & Security' },
      { value: 'microservices', label: 'Microservices' },
      { value: 'message_broker', label: 'Message Broker' },
    ],
  },
  {
    group: 'Data & Infrastructure',
    options: [
      { value: 'database_sql', label: 'Database (SQL)' },
      { value: 'database_nosql', label: 'Database (NoSQL)' },
      { value: 'orm_query_builder', label: 'ORM / Query Builder' },
      { value: 'cloud_platform', label: 'Cloud Platform' },
      { value: 'devops_ci_cd', label: 'DevOps / CI-CD' },
      { value: 'containerization', label: 'Containerization' },
      { value: 'monitoring_observability', label: 'Monitoring / Observability' },
    ],
  },
  {
    group: 'Quality & Process',
    options: [
      { value: 'testing', label: 'Testing' },
      { value: 'architecture_design_pattern', label: 'Architecture / Design Pattern' },
      { value: 'version_control', label: 'Version Control' },
      { value: 'project_management', label: 'Project Management' },
      { value: 'documentation', label: 'Documentation' },
    ],
  },
  {
    group: 'Data, AI & Other',
    options: [
      { value: 'data_analysis', label: 'Data Analysis' },
      { value: 'machine_learning_ai', label: 'Machine Learning / AI' },
      { value: 'design_tool', label: 'Design Tool' },
      { value: 'other', label: 'Other' },
    ],
  },
];

export const allSkillCategoryValues = skillCategoryGroups.flatMap((group) =>
  group.options.map((option) => option.value)
);
