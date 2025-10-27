// BudgetAssistant/services/idGenerator.ts
export const generateId = (): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};
