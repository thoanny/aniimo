export type Period = 'daily' | 'weekly' | 'season' | null;

export type Task = {
  id: string | number;
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

export type Settings = {
  showHidden: boolean;
};
