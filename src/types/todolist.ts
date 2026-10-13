export type Period = 'daily' | 'weekly' | 'season' | null;

export type TaskKey = string | number;

export type Task = {
  id: TaskKey;
  title: string;
  description: string | null;
  period: Period;
  link: string | null;
  hidden: boolean;
  completed: boolean;
};

export type UserTask = Task & {
  id: string;
};

export type NewTask = {
  title: string;
  description: string;
  period: Period;
  link: string;
};

export type Category = {
  id: string;
  title: string;
  collapsed: boolean;
  custom: boolean;
};

export type Settings = {
  showHidden: boolean;
};
